import uuid
from typing import Optional, List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, text, delete, update, func
from app.repositories.base_repository import BaseRepository
from app.models.document import Document
from app.models.job_document import JobDocument
from app.schemas.enums import LanguageEnum, JobDocumentAction

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
    async def get_hashes_by_urls(
        self, 
        workspace_id: uuid.UUID, 
        urls: List[str]
    ) -> Dict[str, str]:

        stmt = select(self.model.url, self.model.content_hash).where(
            self.model.workspace_id == workspace_id,
            self.model.url.in_(urls)
        )
        result = await self.db.execute(stmt)
        return {row.url: row.content_hash for row in result}

    async def get_by_id_with_chunks(
        self,
        workspace_id: uuid.UUID,
        document_id: uuid.UUID
    ) -> Optional[Document]:

        stmt = (
            select(self.model)
            .where(
                self.model.workspace_id == workspace_id,
                self.model.id == document_id
            )
            .options(selectinload(self.model.chunks))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    #################################################################################
    #################################################################################
    async def get_all_by_workspace_paginated(
        self, 
        workspace_id: uuid.UUID,
        skip: int,
        limit: int,
        document_ids: Optional[List[uuid.UUID]] = None,
        job_ids: Optional[List[uuid.UUID]] = None,
        is_approved: Optional[bool] = None,
        langs: Optional[LanguageEnum] = None,
        actions: Optional[List[JobDocumentAction]] = None
    ) -> tuple[List[Document], int]:

        stmt = select(self.model).where(self.model.workspace_id == workspace_id)

        if document_ids:
            stmt = stmt.where(self.model.id.in_(document_ids))
        
        if is_approved is not None:
            stmt = stmt.where(self.model.is_approved == is_approved)
            
        if langs:
            stmt = stmt.where(self.model.lang.in_(langs))

        if job_ids or actions:
            stmt = stmt.join(JobDocument, JobDocument.document_id == self.model.id)
            if job_ids:
                stmt = stmt.where(JobDocument.job_id.in_(job_ids))
            if actions:
                stmt = stmt.where(JobDocument.action.in_(actions))                
            stmt = stmt.distinct()

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await self.db.scalar(count_stmt) or 0

        stmt = (
            stmt.options(selectinload(self.model.chunks))
            .order_by(self.model.created_at.desc(), self.model.id.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.db.execute(stmt)
        items = result.scalars().all()
        
        return list(items), total
    
    #################################################################################
    #################################################################################
    def create(
        self, 
        workspace_id: uuid.UUID,
        url: str, 
        lang: LanguageEnum, 
        content_hash: str,
        job_id: Optional[uuid.UUID] = None,
        action: JobDocumentAction = JobDocumentAction.CREATED,
        is_approved: bool = True,
        title: Optional[str] = None, 
        tags: Optional[List[str]] = None, 
        suggestions: Optional[List[str]] = None
    ) -> Document:

        db_document = self.model(
            workspace_id=workspace_id,
            url=url,
            title=title,
            lang=lang,
            content_hash=content_hash,
            is_approved=is_approved,
            tags=tags or[],
            suggestions=suggestions or[]
        )

        if job_id:
            db_jobdocument = JobDocument(job_id=job_id, action=action)
            db_document.document_jobs.append(db_jobdocument)


        self.db.add(db_document)
        return db_document


    #################################################################################
    #################################################################################
    async def upsert_for_job(
        self,
        workspace_id: uuid.UUID,
        url: str,
        title: str,
        lang: LanguageEnum,
        content_hash: str,
        job_id: uuid.UUID,
    ) -> Document:

        db_document = await self.get_by_url_and_workspace(url, workspace_id)
        
        if db_document:
            db_document.content_hash = content_hash
            db_document.title = title
            db_document.lang = lang
            db_document.updated_at = func.now()
            action = JobDocumentAction.UPDATED
        else:
            db_document = self.model(
                workspace_id=workspace_id,
                url=url,
                title=title,
                lang=lang,
                content_hash=content_hash,
                tags=[],
                suggestions=[],
                is_approved=False
            )
            self.db.add(db_document)
            action = JobDocumentAction.CREATED


        await self.db.flush() 
        db_jobdocument = JobDocument(
            job_id=job_id, 
            document_id=db_document.id,
            action=action
        )
        await self.db.merge(db_jobdocument)
        
        return db_document        
    

    #################################################################################
    #################################################################################
    async def bulk_label_documents_with_debug(
        self, 
        document_ids: List[uuid.UUID]
    ) -> List[dict]:
        # Final Tuned Math: 0.09 + 0.02 * ln(L)
        # This provides a ~0.24 threshold for full chunks, catching all relevant themes.
        query = text("""
            WITH scoring AS (
                SELECT 
                    c.document_id,
                    tag.key AS tag_path,
                    (c.embedding <=> tag.val::text::vector) AS distance,
                    (0.04 + 0.025 * ln(GREATEST(length(c.content), 1))) AS threshold
                FROM chunks c
                JOIN documents d ON c.document_id = d.id
                JOIN workspaces w ON d.workspace_id = w.id
                CROSS JOIN LATERAL jsonb_each(w.tags_embeddings) AS tag(key, val)
                WHERE d.id = ANY(:document_ids)
            ),
            document_best_matches AS (
                SELECT 
                    document_id,
                    tag_path,
                    MIN(distance) AS best_distance,
                    -- We use the max threshold calculated for the doc's chunks
                    MAX(threshold) AS calculated_threshold
                FROM scoring
                GROUP BY document_id, tag_path
            ),
            matches AS (
                SELECT 
                    document_id, 
                    array_agg(DISTINCT tag_path::ltree) AS final_tags_list
                FROM document_best_matches
                WHERE best_distance < calculated_threshold
                GROUP BY document_id
            ),
            update_step AS (
                UPDATE documents d
                SET tags = COALESCE(m.final_tags_list, '{}'::ltree[])
                FROM matches m
                WHERE d.id = m.document_id
            )
            SELECT 
                dbm.document_id,
                dbm.tag_path,
                ROUND(dbm.best_distance::numeric, 4) AS distance,
                ROUND(dbm.calculated_threshold::numeric, 4) AS threshold,
                (dbm.best_distance < dbm.calculated_threshold) AS is_match
            FROM document_best_matches dbm
            ORDER BY dbm.document_id, dbm.best_distance ASC;
        """)
        
        result = await self.db.execute(query, {"document_ids": document_ids})
        return [dict(row._mapping) for row in result.fetchall()]    
    #################################################################################
    #################################################################################
    async def bulk_remove_tag_hierarchy(self, workspace_id: uuid.UUID, path: str):
        query = text("""
            UPDATE documents 
            SET tags = ARRAY(
                SELECT t FROM unnest(tags) AS t 
                WHERE NOT (t <@ CAST(:path AS ltree))
            )
            WHERE workspace_id = :workspace_id 
              AND tags ~ CAST(:path || '.*' AS lquery)
        """)
        
        await self.db.execute(query, {"path": path, "workspace_id": workspace_id})

    #################################################################################
    #################################################################################
    async def bulk_rename_tag_hierarchy(self, workspace_id: uuid.UUID, old_path: str, new_path: str):
        query = text("""
            UPDATE documents
            SET tags = ARRAY(
                SELECT DISTINCT
                    CASE 
                        WHEN t = CAST(:old AS ltree) THEN CAST(:new AS ltree)
                        WHEN t <@ CAST(:old AS ltree) THEN CAST(:new AS ltree) || subpath(t, nlevel(CAST(:old AS ltree)))
                        ELSE t 
                    END
                FROM unnest(tags) AS t
            )
            WHERE workspace_id = :workspace_id 
              AND tags ~ CAST(:old || '.*' AS lquery)
        """)
        
        await self.db.execute(query, {"old": old_path, "new": new_path, "workspace_id": workspace_id})

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