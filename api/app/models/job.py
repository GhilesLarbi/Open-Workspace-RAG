import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base
from app.models.enums import JobStatus

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.workspace import Workspace

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    task_id: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[JobStatus] = mapped_column(SAEnum(JobStatus, name="job_status_enum"), default=JobStatus.PENDING, nullable=False)
    
    payload: Mapped[dict] = mapped_column(JSONB, nullable=True)
    result: Mapped[dict] = mapped_column(JSONB, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False)
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="jobs")