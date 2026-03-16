# app/repositories/document_repository.py
import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, text, delete, update
from app.repositories.base_repository import BaseRepository
from app.models.document import Document
from app.models.enums import LanguageEnum

class DocumentRepository(BaseRepository[Document]):

    def __init__(self, db: AsyncSession):
        super().__init__(Document, db)

    #################################################################################
    #################################################################################
    async def get_by_url_and_workspace(self, url: str, workspace_id: uuid.UUID) -> Optional[Document]:
        result = await self.db.execute(
            select(self.model).where(
                self.model.url == url,
                self.model.workspace_id == workspace_id
            )
        )
        return result.scalar_one_or_none()

    #################################################################################
    #################################################################################
    async def get_all_with_chunks_by_workspace(
        self, 
        workspace_id: uuid.UUID,
        skip: int,
        limit: int,
        document_ids: Optional[List[uuid.UUID]] = None
    ) -> List[Document]:
        stmt = (
            select(self.model)
            .where(self.model.workspace_id == workspace_id)
            .options(selectinload(self.model.chunks))
        )

        if document_ids:
            stmt = stmt.where(self.model.id.in_(document_ids))


        stmt = stmt.order_by(
            self.model.created_at.desc(), 
            self.model.id.desc()
        ).offset(skip).limit(limit)
        
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
    
    #################################################################################
    #################################################################################
    def create(
        self, 
        workspace_id: uuid.UUID,
        url: str, 
        lang: LanguageEnum, 
        content_hash: str,
        is_approved: bool = True,
        title: Optional[str] = None, 
        tags: Optional[List[str]] = None, 
        suggestions: Optional[List[str]] = None
    ) -> Document:

        new_doc = self.model(
            workspace_id=workspace_id,
            url=url,
            title=title,
            lang=lang,
            content_hash=content_hash,
            is_approved=is_approved,
            tags=tags or[],
            suggestions=suggestions or[]
        )
        self.db.add(new_doc)
        return new_doc
    
    #################################################################################
    #################################################################################
    async def bulk_remove_tag_hierarchy(self, workspace_id: uuid.UUID, path: str):
        query = text("""
            UPDATE documents 
            SET tags = ARRAY(
                SELECT t FROM unnest(tags) AS t 
                WHERE NOT (t <@ CAST(:path AS ltree))
            )
            WHERE workspace_id = :ws_id 
              AND tags && ARRAY[CAST(:path AS ltree)]
        """)
        await self.db.execute(query, {"path": path, "ws_id": workspace_id})

    #################################################################################
    #################################################################################
    async def bulk_rename_tag_hierarchy(self, workspace_id: uuid.UUID, old_path: str, new_path: str):
        query = text("""
            UPDATE documents
            SET tags = ARRAY(
                SELECT 
                    CASE 
                        WHEN t = CAST(:old AS ltree) THEN CAST(:new AS ltree)
                        WHEN t <@ CAST(:old AS ltree) THEN CAST(:new AS ltree) || subpath(t, nlevel(CAST(:old AS ltree)))
                        ELSE t 
                    END
                FROM unnest(tags) AS t
            )
            WHERE workspace_id = :ws_id 
              AND tags && ARRAY[CAST(:old AS ltree)]
        """)
        await self.db.execute(query, {"old": old_path, "new": new_path, "ws_id": workspace_id})

    #################################################################################
    #################################################################################
    async def delete_by_ids_and_workspace(self, document_ids: List[uuid.UUID], workspace_id: uuid.UUID):
        stmt = delete(self.model).where(
            self.model.id.in_(document_ids),
            self.model.workspace_id == workspace_id
        )
        await self.db.execute(stmt)

    #################################################################################
    #################################################################################
    async def update_approval_status(self, document_ids: List[uuid.UUID], workspace_id: uuid.UUID, is_approved: bool):
        stmt = update(self.model).where(
            self.model.id.in_(document_ids),
            self.model.workspace_id == workspace_id
        ).values(is_approved=is_approved)
        await self.db.execute(stmt)