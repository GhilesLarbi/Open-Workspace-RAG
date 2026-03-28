import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.repositories.base_repository import BaseRepository
from app.models.rating import Rating
from app.schemas.chat import SessionDebug


class RatingRepository(BaseRepository[Rating]):

    def __init__(self, db: AsyncSession):
        super().__init__(Rating, db)

    ##################################################################
    ##################################################################
    def create(
        self,
        workspace_id: uuid.UUID,
        is_helpful: bool,
        session: SessionDebug,
    ) -> Rating:
        db_rating = Rating(
            workspace_id=workspace_id,
            is_helpful=is_helpful,
            session=session,
        )
        self.db.add(db_rating)
        return db_rating

    ##################################################################
    ##################################################################
    async def get_by_workspace(
        self,
        workspace_id: uuid.UUID,
        skip: int = 0,
        limit: int = 10,
        is_helpful: Optional[bool] = None,
        created_at_from: Optional[datetime] = None,
        created_at_to: Optional[datetime] = None,
    ) -> tuple[list[Rating], int]:
        query = select(Rating).where(Rating.workspace_id == workspace_id)

        if is_helpful is not None:
            query = query.where(Rating.is_helpful == is_helpful)

        if created_at_from is not None:
            query = query.where(Rating.created_at >= created_at_from)

        if created_at_to is not None:
            query = query.where(Rating.created_at <= created_at_to)

        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query)

        items_query = query.order_by(Rating.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(items_query)
        items = result.scalars().all()

        return list(items), total
