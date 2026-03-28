import uuid
from datetime import datetime
from sqlalchemy import Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base
from app.models.types import PydanticType
from app.schemas.chat import SessionDebug

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.workspace import Workspace


class Rating(Base):
    __tablename__ = "ratings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    is_helpful: Mapped[bool] = mapped_column(Boolean, nullable=False)
    session: Mapped[SessionDebug] = mapped_column(PydanticType(SessionDebug), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    workspace_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False)
    workspace: Mapped["Workspace"] = relationship("Workspace")
