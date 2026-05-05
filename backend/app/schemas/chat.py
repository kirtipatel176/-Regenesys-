from datetime import datetime
from typing import List, Optional
from uuid import UUID

from app.models.chat import RoleType
from pydantic import BaseModel


class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatMessageResponse(BaseModel):
    id: UUID
    role: RoleType
    content: str
    citations: Optional[List[dict]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatAskRequest(BaseModel):
    session_id: Optional[UUID] = None  # If not provided, create a new session
    question: str


class SourceDetail(BaseModel):
    document_id: UUID
    filename: str
    page_number: Optional[int]
    content_snippet: str


class ChatAskResponse(BaseModel):
    session_id: UUID
    answer: str
    citations: List[dict]
    sources: List[SourceDetail]
    confidence_score: float = 0.0
