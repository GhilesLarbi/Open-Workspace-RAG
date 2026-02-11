from __future__ import annotations
from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import func
from app.models.base import Base
from datetime import datetime
import uuid


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    domain: Mapped[str] = mapped_column(String, index=True, nullable=True, default=None)
    question: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    answer: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())