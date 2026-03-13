import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.repositories.base_repository import BaseRepository
from app.models.job import Job
from app.models.enums import JobStatus
from typing import List, Optional
from sqlalchemy import delete

class JobRepository(BaseRepository[Job]):
    
    def __init__(self, db: AsyncSession):
        super().__init__(Job, db)

    ##################################################################
    ##################################################################
    def create(
        self, 
        workspace_id: uuid.UUID, 
        payload: dict, 
        status: JobStatus = JobStatus.PENDING
    ) -> Job:

        db_job = Job(
            workspace_id=workspace_id, 
            payload=payload, 
            status=status
        )
        self.db.add(db_job)
        return db_job
    
    ##################################################################
    ##################################################################
    async def get_by_workspace(
        self, 
        workspace_id: uuid.UUID, 
        skip: int = 0, 
        limit: int = 10, 
        statuses: Optional[List[JobStatus]] = None
    ):
        query = select(self.model).where(self.model.workspace_id == workspace_id)
        if statuses:
            query = query.where(self.model.status.in_(statuses))
                
        query = query.order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        
        return result.scalars().all()

    ##################################################################
    ##################################################################
    async def delete(self, job: Job) -> None:
        await self.db.delete(job)

    ##################################################################
    ##################################################################
    async def delete_many(self, job_ids: List[uuid.UUID], workspace_id: uuid.UUID) -> int:
        stmt = delete(self.model).where(
            self.model.id.in_(job_ids),
            self.model.workspace_id == workspace_id
        )
        result = await self.db.execute(stmt)
        return getattr(result, "rowcount", 0)