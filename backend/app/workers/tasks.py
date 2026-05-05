"""
Celery background tasks for document processing.

Pipeline
--------
  Upload saved to disk
      ↓
  parse_document()          — extract raw text (PyMuPDF / python-docx / plain text)
      ↓
  chunk_text()              — tokenizer-aware, overlapping chunks with metadata
      ↓
  build_document_graph()    — create Neo4j graph: Document→Section→Chunk→Concept
      ↓
  ProcessingStatus.completed saved to Postgres Document row
"""

import asyncio
import logging
from uuid import UUID

from sqlalchemy.future import select

from app.db.session import AsyncSessionLocal
from app.models.document import Document, ProcessingStatus
from app.services.graph_builder import build_document_graph
from app.workers.celery_app import celery_app
from app.workers.document_parser import chunk_text, parse_document

logger = logging.getLogger(__name__)


async def process_document_async(document_id: str) -> None:
    """Async core of the document processing pipeline."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Document).filter(Document.id == UUID(document_id))
        )
        document = result.scalars().first()
        if not document:
            logger.error("process_document_async: document %s not found.", document_id)
            return

        try:
            # Mark as in-progress
            document.processing_status = ProcessingStatus.processing
            await db.commit()

            # Step 1-3: Extract and clean text from the file
            logger.info("Parsing document %s (%s)", document_id, document.mime_type)
            text = parse_document(document.storage_path, document.mime_type)

            # Step 4: Chunk into overlapping token windows with metadata
            logger.info("Chunking document %s", document_id)
            chunks = chunk_text(text, chunk_size=800, overlap=120)
            logger.info("Document %s split into %d chunks", document_id, len(chunks))

            # Step 5: Build the Neo4j knowledge graph
            logger.info("Building knowledge graph for document %s", document_id)
            await build_document_graph(
                document_id=str(document.id),
                user_id=str(document.uploaded_by),
                filename=document.filename,
                original_name=document.original_name,
                mime_type=document.mime_type,
                chunks=chunks,
            )

            # Step 6: Mark as done
            document.processing_status = ProcessingStatus.completed
            await db.commit()
            logger.info("Document %s processing complete.", document_id)

        except Exception as exc:
            logger.exception("Document %s processing failed: %s", document_id, exc)
            document.processing_status = ProcessingStatus.failed
            await db.commit()
            raise


@celery_app.task(name="process_document_task", bind=True, max_retries=3)
def process_document_task(self, document_id: str) -> None:
    """
    Celery task entry-point.  Wraps the async pipeline in asyncio.run().
    Retries up to 3 times on failure with exponential back-off.
    """
    try:
        asyncio.run(process_document_async(document_id))
    except Exception as exc:
        logger.warning(
            "Task failed for document %s (attempt %d/%d): %s",
            document_id,
            self.request.retries + 1,
            self.max_retries,
            exc,
        )
        raise self.retry(exc=exc, countdown=2**self.request.retries)
