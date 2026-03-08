import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.models.workspace import Workspace
from app.repositories.base_repository import BaseRepository
from sqlalchemy_utils import Ltree

class WorkspaceRepository(BaseRepository[Workspace]):

    def __init__(self, db: AsyncSession):
        super().__init__(Workspace, db)

    #############################################################################
    #############################################################################
    def create(
        self, 
        organization_id: uuid.UUID, 
        slug: str, 
        name: str, 
        url: str
    ) -> Workspace:

        workspace = Workspace(
            organization_id=organization_id, 
            slug=slug, 
            name=name, 
            url=url
        )
        self.db.add(workspace)
        return workspace

    #############################################################################
    #############################################################################
    async def get_by_slug_and_org(
        self, 
        slug: str, 
        organization_id: uuid.UUID
    ) -> Optional[Workspace]:

        result = await self.db.execute(
            select(self.model).where(
                self.model.slug == slug,
                self.model.organization_id == organization_id
            )
        )
        return result.scalar_one_or_none()

    #############################################################################
    #############################################################################
    async def get_all_by_org(
        self, 
        organization_id: uuid.UUID
    ) -> List[Workspace]:

        result = await self.db.execute(
            select(self.model).where(self.model.organization_id == organization_id)
        )
        return list(result.scalars().all())
    

    #############################################################################
    #############################################################################
    async def add_tag(self, workspace_id: uuid.UUID, path: str):
        query = text("""
            UPDATE workspaces 
            SET tags = array_append(tags, CAST(:path AS ltree))
            WHERE id = :id 
            AND NOT (tags @> ARRAY[CAST(:path AS ltree)])
        """)
        
        await self.db.execute(query, {"path": path, "id": workspace_id})
    

    #############################################################################
    #############################################################################
    async def remove_tag_hierarchy(self, workspace_id: uuid.UUID, path: str):
        query = text("""
            UPDATE workspaces 
            SET tags = ARRAY(
                SELECT t FROM unnest(tags) AS t 
                WHERE NOT (t <@ CAST(:path AS ltree))
            )
            WHERE id = :id
        """)
        await self.db.execute(query, {"path": path, "id": workspace_id})

    #############################################################################
    #############################################################################
    async def rename_tag_hierarchy(self, workspace_id: uuid.UUID, old_path: str, new_path: str):
        query = text("""
            UPDATE workspaces
            SET tags = ARRAY(
                SELECT 
                    CASE 
                        WHEN t = CAST(:old AS ltree) THEN CAST(:new AS ltree)
                        WHEN t <@ CAST(:old AS ltree) THEN CAST(:new AS ltree) || subpath(t, nlevel(CAST(:old AS ltree)))
                        ELSE t 
                    END
                FROM unnest(tags) AS t
            )
            WHERE id = :id
              AND tags && ARRAY[CAST(:old AS ltree)]
        """)
        await self.db.execute(query, {"old": old_path, "new": new_path, "id": workspace_id})