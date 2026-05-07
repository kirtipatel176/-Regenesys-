from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.document import ProcessingStatus


class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    original_name: str
    mime_type: str
    size_bytes: int
    processing_status: ProcessingStatus
    page_count: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
