"""
Graph Ingestion Service — builds the Neo4j knowledge graph for a document.

Graph schema
------------

    (:Document {id, user_id, filename, original_name, mime_type, created_at})
        -[:HAS_SECTION]->
    (:Section {name, document_id})
        -[:HAS_CHUNK]->
    (:Chunk {id, document_id, chunk_index, content, page_number, token_count, section})
        -[:MENTIONS]->
    (:Concept {name})          # shared nodes; one Concept node per unique lowercase term

    (:Chunk)-[:NEXT_CHUNK {distance: 1}]->(:Chunk)   # sequential order within a document

All nodes carry a ``user_id`` property so that Cypher WHERE clauses can
enforce per-user document isolation during retrieval.

Entry point
-----------
    from app.services.graph_builder import build_document_graph, delete_document_graph

    await build_document_graph(document_id, user_id, filename, original_name,
                               mime_type, chunks)

    await delete_document_graph(document_id)
"""
import logging
from datetime import datetime, timezone
from typing import List

from app.ai.concept_extractor import extract_concepts
from app.db.neo4j import get_neo4j_session

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def build_document_graph(
    document_id: str,
    user_id: str,
    filename: str,
    original_name: str,
    mime_type: str,
    chunks: List[dict],
) -> None:
    """
    Persist the entire document graph to Neo4j.

    Parameters
    ----------
    document_id : str
        UUID of the Postgres Document row (used as primary key in Neo4j).
    user_id : str
        UUID of the owning user — stored on every node for isolation.
    filename : str
        Secure (UUID-based) filename on disk.
    original_name : str
        Human-readable original upload name.
    mime_type : str
        MIME type of the uploaded file.
    chunks : List[dict]
        Output of ``document_parser.chunk_text()`` — each dict has:
        ``content``, ``section``, ``page_number``, ``token_count``.
    """
    if not chunks:
        logger.warning("build_document_graph called with no chunks for doc %s", document_id)
        return

    async with get_neo4j_session() as session:
        # 1. Create / merge the Document node
        await session.run(
            """
            MERGE (d:Document {id: $doc_id})
            SET d.user_id      = $user_id,
                d.filename     = $filename,
                d.original_name = $original_name,
                d.mime_type    = $mime_type,
                d.created_at   = $created_at
            """,
            doc_id=document_id,
            user_id=user_id,
            filename=filename,
            original_name=original_name,
            mime_type=mime_type,
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        logger.debug("Document node created/merged: %s", document_id)

        # 2. Create Section nodes + Chunk nodes + Concept nodes
        prev_chunk_id: str | None = None

        for i, chunk_data in enumerate(chunks):
            content: str = chunk_data["content"].strip()
            if not content:
                continue

            section_name: str = chunk_data.get("section") or "General"
            page_number: int = chunk_data.get("page_number") or 1
            token_count: int = chunk_data.get("token_count") or 0
            chunk_id: str = f"{document_id}::chunk::{i}"

            # 2a. Section node (MERGE so duplicate names collapse)
            await session.run(
                """
                MERGE (s:Section {name: $section_name, document_id: $doc_id})
                SET s.user_id = $user_id
                """,
                section_name=section_name,
                doc_id=document_id,
                user_id=user_id,
            )

            # 2b. Link Document -> Section
            await session.run(
                """
                MATCH (d:Document {id: $doc_id})
                MATCH (s:Section {name: $section_name, document_id: $doc_id})
                MERGE (d)-[:HAS_SECTION]->(s)
                """,
                doc_id=document_id,
                section_name=section_name,
            )

            # 2c. Chunk node
            await session.run(
                """
                MERGE (c:Chunk {id: $chunk_id})
                SET c.document_id  = $doc_id,
                    c.user_id      = $user_id,
                    c.chunk_index  = $chunk_index,
                    c.content      = $content,
                    c.page_number  = $page_number,
                    c.token_count  = $token_count,
                    c.section      = $section_name
                """,
                chunk_id=chunk_id,
                doc_id=document_id,
                user_id=user_id,
                chunk_index=i,
                content=content,
                page_number=page_number,
                token_count=token_count,
                section_name=section_name,
            )

            # 2d. Link Section -> Chunk
            await session.run(
                """
                MATCH (s:Section {name: $section_name, document_id: $doc_id})
                MATCH (c:Chunk {id: $chunk_id})
                MERGE (s)-[:HAS_CHUNK]->(c)
                """,
                section_name=section_name,
                doc_id=document_id,
                chunk_id=chunk_id,
            )

            # 2e. Sequential NEXT_CHUNK relationship
            if prev_chunk_id is not None:
                await session.run(
                    """
                    MATCH (prev:Chunk {id: $prev_id})
                    MATCH (curr:Chunk {id: $curr_id})
                    MERGE (prev)-[:NEXT_CHUNK {distance: 1}]->(curr)
                    """,
                    prev_id=prev_chunk_id,
                    curr_id=chunk_id,
                )

            prev_chunk_id = chunk_id

            # 2f. Extract concepts and create Concept nodes + MENTIONS edges
            concepts = extract_concepts(content, max_concepts=15)
            for concept in concepts:
                # Global Concept nodes (shared across documents / users)
                await session.run(
                    """
                    MERGE (k:Concept {name: $name})
                    """,
                    name=concept,
                )
                await session.run(
                    """
                    MATCH (c:Chunk {id: $chunk_id})
                    MATCH (k:Concept {name: $name})
                    MERGE (c)-[:MENTIONS]->(k)
                    """,
                    chunk_id=chunk_id,
                    name=concept,
                )

        logger.info(
            "Graph built for document %s: %d chunk(s) ingested.",
            document_id,
            len(chunks),
        )


async def delete_document_graph(document_id: str) -> None:
    """
    Remove the entire subgraph for *document_id* from Neo4j.

    Cascade-deletes:  Document → Section → Chunk → (MENTIONS edges)
    Concept nodes are *not* deleted because they may be referenced by
    other documents.  Orphan Concepts can be cleaned up separately if
    needed.
    """
    async with get_neo4j_session() as session:
        await session.run(
            """
            MATCH (d:Document {id: $doc_id})
            OPTIONAL MATCH (d)-[:HAS_SECTION]->(s:Section)
            OPTIONAL MATCH (s)-[:HAS_CHUNK]->(c:Chunk)
            DETACH DELETE c, s, d
            """,
            doc_id=document_id,
        )
        logger.info("Deleted graph subgraph for document %s", document_id)
