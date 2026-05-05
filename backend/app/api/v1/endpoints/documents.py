import logging
import os
import shutil
import uuid
from typing import List

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core.config import settings
from app.models.document import Document, ProcessingStatus
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.graph_builder import delete_document_graph
from app.workers.tasks import process_document_async

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


@router.post(
    "/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED
)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF, DOCX, and TXT are allowed.",
        )

    # Check file size by moving cursor to end
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 25MB.")

    try:
        ext = os.path.splitext(file.filename)[1]
        secure_filename = f"{uuid.uuid4()}{ext}"
        
        # Ensure directory exists
        abs_upload_dir = os.path.abspath(settings.UPLOAD_DIR)
        os.makedirs(abs_upload_dir, exist_ok=True)
        
        file_path = os.path.join(abs_upload_dir, secure_filename)
        logger.info(f"Uploading file to: {file_path}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document = Document(
            uploaded_by=current_user.id,
            filename=secure_filename,
            original_name=file.filename,
            mime_type=file.content_type,
            size_bytes=file_size,
            storage_path=file_path,
            processing_status=ProcessingStatus.pending,
        )
        db.add(document)
        await db.commit()
        await db.refresh(document)

        # Trigger background processing — parse, chunk, and build Neo4j graph
        background_tasks.add_task(process_document_async, str(document.id))
        logger.info("Queued background task for document %s", document.id)

        return document
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Failed to save file on server",
                "error": str(e),
                "path": settings.UPLOAD_DIR
            }
        )


@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(Document)
        .filter(Document.uploaded_by == current_user.id)
        .order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{id}", response_model=DocumentResponse)
async def get_document(
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(Document).filter(
            Document.id == id, Document.uploaded_by == current_user.id
        )
    )
    document = result.scalars().first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(Document).filter(
            Document.id == id, Document.uploaded_by == current_user.id
        )
    )
    document = result.scalars().first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove file from disk
    if os.path.exists(document.storage_path):
        os.remove(document.storage_path)

    # Remove Neo4j subgraph (Chunks, Sections, MENTIONS edges)
    await delete_document_graph(str(document.id))

    await db.delete(document)
    await db.commit()
    return None
