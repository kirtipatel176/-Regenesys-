import logging
import os
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.audit import AuditLog
from app.models.chat import ChatSession
from app.models.document import Document, ProcessingStatus
from app.models.user import User
from app.schemas.admin import AdminStatsResponse, UserStatusUpdate
from app.schemas.document import DocumentResponse
from app.schemas.user import UserResponse
from app.services.graph_builder import delete_document_graph

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.require_admin),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(User).offset(skip).limit(limit).order_by(User.created_at.desc())
    )
    return result.scalars().all()


@router.patch("/users/{id}/status", response_model=UserResponse)
async def update_user_status(
    id: uuid.UUID,
    status_update: UserStatusUpdate,
    current_user: User = Depends(deps.require_admin),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(select(User).filter(User.id == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = status_update.is_active

    audit_log = AuditLog(
        user_id=current_user.id,
        action="update_user_status",
        entity_type="user",
        entity_id=str(user.id),
        metadata_info={"is_active": user.is_active},
    )
    db.add(audit_log)

    await db.commit()
    await db.refresh(user)
    return user


@router.get("/documents", response_model=List[DocumentResponse])
async def list_all_documents(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.require_admin),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(Document).offset(skip).limit(limit).order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/documents/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_document(
    id: uuid.UUID,
    current_user: User = Depends(deps.require_admin),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(select(Document).filter(Document.id == id))
    document = result.scalars().first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(document.storage_path):
        os.remove(document.storage_path)

    # Remove the document's Neo4j subgraph
    await delete_document_graph(str(document.id))
    logger.info("Admin deleted graph for document %s", document.id)

    audit_log = AuditLog(
        user_id=current_user.id,
        action="delete_document",
        entity_type="document",
        entity_id=str(document.id),
        metadata_info={"filename": document.filename},
    )
    db.add(audit_log)

    await db.delete(document)
    await db.commit()
    return None


@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    current_user: User = Depends(deps.require_admin),
    db: AsyncSession = Depends(deps.get_db),
):
    total_users = await db.scalar(select(func.count(User.id)))
    total_docs = await db.scalar(select(func.count(Document.id)))
    processed_docs = await db.scalar(
        select(func.count(Document.id)).filter(
            Document.processing_status == ProcessingStatus.completed
        )
    )
    failed_docs = await db.scalar(
        select(func.count(Document.id)).filter(
            Document.processing_status == ProcessingStatus.failed
        )
    )

    # Calculate chats today (UTC)
    today = datetime.now(timezone.utc).date()
    today_start = datetime(today.year, today.month, today.day, tzinfo=timezone.utc)

    total_chats_today = await db.scalar(
        select(func.count(ChatSession.id)).filter(ChatSession.created_at >= today_start)
    )

    return AdminStatsResponse(
        total_users=total_users or 0,
        total_docs=total_docs or 0,
        processed_docs=processed_docs or 0,
        failed_docs=failed_docs or 0,
        total_chats_today=total_chats_today or 0,
    )
