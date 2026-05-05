"""
Graph-based RAG retrieval engine.

Replaces the previous pgvector cosine-similarity retrieval.
No embeddings are used.  All retrieval is done via Cypher graph traversal
on the Neo4j knowledge graph built by ``app.services.graph_builder``.

Retrieval strategy
------------------
1. Extract keywords / concepts from the user's question using
   ``app.ai.concept_extractor.extract_query_keywords``.

2. **Concept-match traversal** — find Chunk nodes that MENTION any of the
   extracted keywords, scored by how many concepts they match
   (graph "relevance density").

3. **Context window expansion** — for the top-ranked chunks, also fetch
   their immediate neighbours via NEXT_CHUNK edges to preserve reading
   context.

4. **Section-fallback** — if no chunks matched the concept list, fall back
   to a simple keyword CONTAINS search on chunk content directly.

5. Return the top-*limit* chunks as lightweight dicts (not ORM objects)
   so the caller doesn't need a Postgres session.

Return type
-----------
Each returned item is a ``RetrievedChunk`` dataclass with the fields
expected by ``app.ai.chat.generate_rag_answer``:
  - ``document_id``
  - ``filename``
  - ``content``
  - ``page_number``
  - ``section``
  - ``relevance_score``  (float, higher = more relevant)
"""

import logging
from dataclasses import dataclass
from typing import List, Optional

from app.ai.concept_extractor import extract_query_keywords
from app.db.neo4j import get_neo4j_session

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data container (replaces the SQLAlchemy DocumentChunk ORM object)
# ---------------------------------------------------------------------------


@dataclass
class RetrievedChunk:
    document_id: str
    filename: str
    content: str
    page_number: Optional[int]
    section: Optional[str]
    relevance_score: float = 0.0

    # ------------------------------------------------------------------
    # Compatibility shim so that app.ai.chat.format_context() can call
    # `chunk.document.filename` without change.
    # ------------------------------------------------------------------
    @property
    def document(self) -> "_FakeDocument":
        return _FakeDocument(id=self.document_id, filename=self.filename)


class _FakeDocument:
    """Thin proxy so RetrievedChunk.document.filename / .id work."""

    __slots__ = ("id", "filename")

    def __init__(self, id: str, filename: str):
        self.id = id
        self.filename = filename


# ---------------------------------------------------------------------------
# Main retrieval function
# ---------------------------------------------------------------------------


async def retrieve_relevant_chunks(
    user_id: str,
    question: str,
    limit: int = 5,
    context_window: int = 1,
) -> List[RetrievedChunk]:
    """
    Retrieve the most relevant document chunks for *question* using graph
    traversal on Neo4j.

    Parameters
    ----------
    user_id : str
        UUID of the current user.  Only chunks belonging to this user's
        documents are considered (enforced by Cypher WHERE clause).
    question : str
        The user's natural-language question.
    limit : int
        Maximum number of chunks to return.
    context_window : int
        Number of adjacent chunks (NEXT_CHUNK neighbours) to pull in for
        each top-ranked chunk to provide surrounding context.

    Returns
    -------
    List[RetrievedChunk]
        Ranked list of chunks, highest relevance first.
    """
    keywords = extract_query_keywords(question, max_keywords=10)
    logger.debug("Query keywords extracted: %s", keywords)

    chunks: List[RetrievedChunk] = []

    async with get_neo4j_session() as session:
        # ------------------------------------------------------------------ #
        # 1. Concept-match traversal
        # ------------------------------------------------------------------ #
        if keywords:
            result = await session.run(
                """
                UNWIND $keywords AS kw
                MATCH (k:Concept {name: kw})
                      <-[:MENTIONS]-
                      (c:Chunk {user_id: $user_id})
                      <-[:HAS_CHUNK]-
                      (s:Section)
                      <-[:HAS_SECTION]-
                      (d:Document {user_id: $user_id})
                WITH c, d, s, count(k) AS relevance
                ORDER BY relevance DESC
                LIMIT $limit
                RETURN c.id          AS chunk_id,
                       c.content     AS content,
                       c.page_number AS page_number,
                       c.section     AS section,
                       d.id          AS document_id,
                       d.filename    AS filename,
                       relevance
                """,
                keywords=keywords,
                user_id=user_id,
                limit=limit * 2,  # over-fetch so we have room after dedup
            )
            records = await result.data()

            seen_ids: set = set()
            for rec in records:
                if rec["chunk_id"] not in seen_ids:
                    seen_ids.add(rec["chunk_id"])
                    chunks.append(
                        RetrievedChunk(
                            document_id=rec["document_id"],
                            filename=rec["filename"],
                            content=rec["content"],
                            page_number=rec["page_number"],
                            section=rec["section"],
                            relevance_score=float(rec["relevance"]),
                        )
                    )

        # ------------------------------------------------------------------ #
        # 2. Context window — pull NEXT_CHUNK neighbours for top chunks
        # ------------------------------------------------------------------ #
        if chunks and context_window > 0:
            top_chunk_ids = [
                f"{c.document_id}::chunk::{i}"
                for i, c in enumerate(chunks[:limit])
                # We can't reconstruct IDs easily here, so we fall back
                # to re-querying by content hash. Instead, include IDs
                # in the primary query (done via chunk_id above) and use
                # them directly.
            ]
            # Re-build from the actual returned chunk_ids
            top_chunk_ids = (
                [rec["chunk_id"] for rec in records[:limit]] if records else []
            )

            if top_chunk_ids:
                nb_result = await session.run(
                    """
                    UNWIND $chunk_ids AS cid
                    MATCH (anchor:Chunk {id: cid, user_id: $user_id})
                    MATCH (anchor)-[:NEXT_CHUNK*1..%d]-(neighbour:Chunk {user_id: $user_id})
                    MATCH (neighbour)<-[:HAS_CHUNK]-(:Section)<-[:HAS_SECTION]->(d:Document)
                    RETURN DISTINCT
                           neighbour.id          AS chunk_id,
                           neighbour.content     AS content,
                           neighbour.page_number AS page_number,
                           neighbour.section     AS section,
                           d.id                  AS document_id,
                           d.filename            AS filename
                    """
                    % context_window,
                    chunk_ids=top_chunk_ids,
                    user_id=user_id,
                )
                nb_records = await nb_result.data()

                existing_ids = {
                    c.content[:50] for c in chunks
                }  # deduplicate by content prefix
                for rec in nb_records:
                    prefix = rec["content"][:50]
                    if prefix not in existing_ids:
                        existing_ids.add(prefix)
                        chunks.append(
                            RetrievedChunk(
                                document_id=rec["document_id"],
                                filename=rec["filename"],
                                content=rec["content"],
                                page_number=rec["page_number"],
                                section=rec["section"],
                                relevance_score=0.1,  # neighbour bonus; lower than direct match
                            )
                        )

        # ------------------------------------------------------------------ #
        # 3. Section keyword fallback — if no concept matches found
        # ------------------------------------------------------------------ #
        if not chunks and keywords:
            logger.info(
                "No concept matches found for question. Falling back to content keyword search."
            )
            # Build a case-insensitive CONTAINS check per keyword
            conditions = " OR ".join(
                [f"toLower(c.content) CONTAINS toLower('{kw}')" for kw in keywords[:5]]
            )
            fallback_query = f"""
                MATCH (c:Chunk {{user_id: $user_id}})
                      <-[:HAS_CHUNK]-(:Section)
                      <-[:HAS_SECTION]-(d:Document {{user_id: $user_id}})
                WHERE {conditions}
                RETURN c.id          AS chunk_id,
                       c.content     AS content,
                       c.page_number AS page_number,
                       c.section     AS section,
                       d.id          AS document_id,
                       d.filename    AS filename
                LIMIT $limit
            """
            fb_result = await session.run(fallback_query, user_id=user_id, limit=limit)
            fb_records = await fb_result.data()

            for rec in fb_records:
                chunks.append(
                    RetrievedChunk(
                        document_id=rec["document_id"],
                        filename=rec["filename"],
                        content=rec["content"],
                        page_number=rec["page_number"],
                        section=rec["section"],
                        relevance_score=0.3,  # fallback base score
                    )
                )

    # Sort descending by relevance and return top-limit results
    chunks.sort(key=lambda x: x.relevance_score, reverse=True)
    logger.info("Retrieved %d chunks for query.", min(len(chunks), limit))
    return chunks[:limit]
