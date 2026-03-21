from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from redis.asyncio import Redis
from app.redis.main import get_redis 

from app.repositories.organization import OrganizationRepository
from app.repositories.workspace import WorkspaceRepository
from app.repositories.document import DocumentRepository
from app.repositories.chunk import ChunkRepository
from app.repositories.job import JobRepository
from app.repositories.session import SessionRepository



def get_organization_repo(db: AsyncSession = Depends(get_db)) -> OrganizationRepository:
    return OrganizationRepository(db)

def get_workspace_repo(db: AsyncSession = Depends(get_db)) -> WorkspaceRepository:
    return WorkspaceRepository(db)

def get_document_repo(db: AsyncSession = Depends(get_db)) -> DocumentRepository:
    return DocumentRepository(db)

def get_chunk_repo(db: AsyncSession = Depends(get_db)) -> ChunkRepository:
    return ChunkRepository(db)

def get_job_repo(db: AsyncSession = Depends(get_db)) -> JobRepository:
    return JobRepository(db)


def get_session_repo(redis: Redis = Depends(get_redis)) -> SessionRepository:
    return SessionRepository(redis)

OrganizationRepositoryDep = Annotated[OrganizationRepository, Depends(get_organization_repo)]
WorkspaceRepositoryDep = Annotated[WorkspaceRepository, Depends(get_workspace_repo)]
DocumentRepositoryDep = Annotated[DocumentRepository, Depends(get_document_repo)]
ChunkRepositoryDep = Annotated[ChunkRepository, Depends(get_chunk_repo)]
JobRepositoryDep = Annotated[JobRepository, Depends(get_job_repo)]
SessionRepositoryDep = Annotated[SessionRepository, Depends(get_session_repo)]