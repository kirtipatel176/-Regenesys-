import uuid

from app.db.base_class import Base
from app.models.mixins import TimestampMixin
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import JSONB, UUID


class AuditLog(TimestampMixin, Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), index=True, nullable=True
    )  # Nullable if action is system-level or anonymous
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    metadata_info = Column(JSONB, nullable=True)
