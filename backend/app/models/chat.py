import enum
import uuid

from app.db.base_class import Base
from app.models.mixins import TimestampMixin
from sqlalchemy import Column, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class RoleType(str, enum.Enum):
    user = "user"
    assistant = "assistant"


class ChatSession(TimestampMixin, Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String, nullable=False)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(TimestampMixin, Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role = Column(Enum(RoleType), nullable=False)
    content = Column(String, nullable=False)
    citations = Column(JSONB, nullable=True)
    token_usage = Column(JSONB, nullable=True)
    model_used = Column(String, nullable=True)

    session = relationship("ChatSession", back_populates="messages")
