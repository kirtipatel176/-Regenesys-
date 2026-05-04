"""
Concept / keyword extraction module.

Used at two points in the RAG pipeline:
  1. **Ingestion time** — extract concepts from each text chunk so we can
     create (:Concept) nodes and (:Chunk)-[:MENTIONS]->(:Concept) edges in
     the graph.
  2. **Query time** — extract keywords from the user's question so we can
     build the Cypher WHERE clause for graph traversal.

Strategy
--------
We use spaCy's English model (``en_core_web_sm``) for fast, offline
extraction.  We pull *noun chunks* and *named entities* as the primary
signal, then filter by minimum length.  Stopwords and punctuation are
removed automatically by spaCy.

If spaCy is unavailable (e.g. the model hasn't been downloaded yet), the
module falls back to a simple regex-based tokeniser that strips common
English stopwords.  This fallback is intentionally lightweight — download
the spaCy model for production use:

    python -m spacy download en_core_web_sm
"""
import logging
import re
from typing import List

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lazy-load spaCy to avoid paying the import cost if the module is not used.
# ---------------------------------------------------------------------------

_nlp = None

def _get_nlp():
    global _nlp
    if _nlp is not None:
        return _nlp
    try:
        import spacy
        _nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])
        logger.info("spaCy model 'en_core_web_sm' loaded for concept extraction.")
    except OSError:
        logger.warning(
            "spaCy model 'en_core_web_sm' not found. "
            "Run: python -m spacy download en_core_web_sm  "
            "Falling back to regex-based extraction."
        )
        _nlp = "fallback"
    return _nlp


# ---------------------------------------------------------------------------
# Minimal English stopword list for the fallback path
# ---------------------------------------------------------------------------

_STOPWORDS = frozenset({
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "up", "about", "into", "over", "after",
    "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "will", "would", "could", "should", "may",
    "might", "shall", "can", "need", "dare", "ought", "used", "not", "no",
    "nor", "so", "yet", "both", "either", "neither", "each", "few", "more",
    "most", "other", "some", "such", "than", "too", "very", "just", "that",
    "this", "these", "those", "i", "me", "my", "we", "our", "you", "your",
    "he", "his", "she", "her", "it", "its", "they", "their", "what",
    "which", "who", "whom", "how", "when", "where", "why",
})


def _fallback_extract(text: str, min_len: int = 4) -> List[str]:
    """Simple regex tokeniser used when spaCy is unavailable."""
    tokens = re.findall(r"\b[a-zA-Z]{%d,}\b" % min_len, text.lower())
    return list({t for t in tokens if t not in _STOPWORDS})


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def extract_concepts(text: str, max_concepts: int = 20) -> List[str]:
    """
    Extract the most relevant concepts / keywords from *text*.

    Returns a de-duplicated list of lowercase strings, capped at
    *max_concepts* items (sorted by apparent importance — noun chunks /
    named entities first when spaCy is available).

    Parameters
    ----------
    text:
        Raw chunk content or a user query string.
    max_concepts:
        Hard cap on the number of concepts returned.
    """
    if not text or not text.strip():
        return []

    nlp = _get_nlp()

    if nlp == "fallback":
        concepts = _fallback_extract(text)
        return concepts[:max_concepts]

    # spaCy path ----------------------------------------------------------------
    # Process first 10 000 characters to keep it fast for long chunks.
    doc = nlp(text[:10_000])

    seen: set[str] = set()
    concepts: List[str] = []

    # 1. Noun chunks (e.g. "machine learning", "board of directors")
    for chunk in doc.noun_chunks:
        lemma = chunk.lemma_.lower().strip()
        if len(lemma) >= 3 and lemma not in seen:
            seen.add(lemma)
            concepts.append(lemma)

    # 2. Individual important tokens (NOUN / PROPN) not already captured
    for token in doc:
        if token.pos_ in ("NOUN", "PROPN") and not token.is_stop and not token.is_punct:
            lemma = token.lemma_.lower().strip()
            if len(lemma) >= 3 and lemma not in seen:
                seen.add(lemma)
                concepts.append(lemma)

    return concepts[:max_concepts]


def extract_query_keywords(question: str, max_keywords: int = 10) -> List[str]:
    """
    Lightweight keyword extraction optimised for short user questions.

    Compared to *extract_concepts*, this function skips noun-chunk
    grouping (which is less meaningful for short sentences) and focuses
    purely on non-stopword tokens, giving the graph traversal a tight set
    of lookup terms.
    """
    if not question or not question.strip():
        return []

    nlp = _get_nlp()

    if nlp == "fallback":
        keywords = _fallback_extract(question, min_len=3)
        return keywords[:max_keywords]

    doc = nlp(question[:2_000])
    seen: set[str] = set()
    keywords: List[str] = []

    for token in doc:
        if (
            not token.is_stop
            and not token.is_punct
            and token.is_alpha
            and len(token.text) >= 3
        ):
            lemma = token.lemma_.lower()
            if lemma not in seen:
                seen.add(lemma)
                keywords.append(lemma)

    return keywords[:max_keywords]
