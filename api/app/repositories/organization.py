from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base_repository import BaseRepository
from app.models.organization import Organization
import uuid


class OrganizationRepository(BaseRepository[Organization]):
    
    def __init__(self, db: AsyncSession):
        super().__init__(Organization, db)

    #################################################################################
    #################################################################################
    def create(self, email: str, password_hash: str, name: str) -> Organization:
        org = Organization(email=email, password_hash=password_hash, name=name)
        self.db.add(org)
        return org

    #################################################################################
    #################################################################################
    async def get_by_id(self, org_id: str | uuid.UUID) -> Organization | None:
        result = await self.db.execute(select(Organization).where(Organization.id == uuid.UUID(str(org_id))))
        return result.scalar_one_or_none()

    #################################################################################
    #################################################################################
    async def get_by_email(self, email: str) -> Organization | None:
        result = await self.db.execute(select(Organization).where(Organization.email == email))
        return result.scalar_one_or_none()

    #################################################################################
    #################################################################################
    async def delete(self, org: Organization) -> None:
        await self.db.delete(org)