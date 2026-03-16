from __future__ import annotations
import uuid
from datetime import datetime
from typing import List

from sqlalchemy import String, ForeignKey, DateTime, Index, UniqueConstraint, Enum, text, Boolean
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy_utils import LtreeType

from app.models.base import Base
from app.models.enums import LanguageEnum

from typing import TYPE_CHECKING

if TYPE_CHECKING : 
    from app.models.chunk import Chunk
    from app.models.workspace import Workspace

class Document(Base):
    __tablename__ = "documents"

    __table_args__ = (
        Index("idx_documents_tags", "tags", postgresql_using="gin"),        
        UniqueConstraint("workspace_id", "url", name="uq_workspace_url"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, nullable=False, index=True, default=True, server_default=text("true"))
    
    url: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str | None] = mapped_column(String, nullable=True)
    lang: Mapped[LanguageEnum] = mapped_column(Enum(LanguageEnum, name="language_enum"), nullable=False, index=True)

    tags: Mapped[list[str]] = mapped_column(
        ARRAY(LtreeType), 
        nullable=False, 
        server_default=text("'{}'::ltree[]")
    )
    
    suggestions: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    content_hash: Mapped[str] = mapped_column(String, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False)
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="documents")


    chunks: Mapped[List["Chunk"]] = relationship("Chunk", back_populates="document", cascade="all, delete-orphan")