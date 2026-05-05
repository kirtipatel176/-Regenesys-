import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin


class RefreshToken(TimestampMixin, Base):
    __tablename__ = "refresh_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_jti = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)

    user = relationship("User")
