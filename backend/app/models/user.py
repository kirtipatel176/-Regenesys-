import enum
import uuid

from sqlalchemy import Boolean, Column, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin


class RoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    profile = relationship(
        "Profile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    documents = relationship("Document", back_populates="uploader")
    chat_sessions = relationship("ChatSession", back_populates="user")
