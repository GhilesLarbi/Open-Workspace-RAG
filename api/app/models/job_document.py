from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Enum as SAEnum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base
from app.schemas.enums import JobDocumentAction

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.job import Job
    from app.models.document import Document

class JobDocument(Base):
    __tablename__ = "job_documents"

    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("jobs.id", ondelete="CASCADE"), 
        primary_key=True
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("documents.id", ondelete="CASCADE"), 
        primary_key=True
    )
    
    action: Mapped[JobDocumentAction] = mapped_column(
        SAEnum(JobDocumentAction, name="job_document_action_enum"), 
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    job: Mapped["Job"] = relationship("Job", back_populates="job_documents")
    document: Mapped["Document"] = relationship("Document", back_populates="document_jobs")