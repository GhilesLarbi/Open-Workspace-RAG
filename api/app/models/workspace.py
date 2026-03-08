from __future__ import annotations
import uuid
from typing import List

from sqlalchemy import String, ForeignKey, UniqueConstraint, ARRAY, text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base
from sqlalchemy_utils import LtreeType

from typing import TYPE_CHECKING

if TYPE_CHECKING: 
    from app.models.organization import Organization
    from app.models.document import Document

class Workspace(Base):
    __tablename__ = "workspaces"

    __table_args__ = (
        UniqueConstraint("organization_id", "slug", name="uq_organization_workspace_slug"),
        Index("idx_workspaces_tags_gist", "tags", postgresql_using="gist"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False)
    
    slug: Mapped[str] = mapped_column(String, index=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)

    tags: Mapped[list[str]] = mapped_column(
        ARRAY(LtreeType), 
        nullable=False, 
        server_default=text("'{}'::ltree[]")
    )

    organization: Mapped["Organization"] = relationship("Organization", back_populates="workspaces")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="workspace", cascade="all, delete-orphan")