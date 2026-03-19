import uuid
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import contains_eager
from sqlalchemy_utils import Ltree
from app.repositories.base_repository import BaseRepository
from app.models.chunk import Chunk
from app.models.document import Document
from app.schemas.enums import LanguageEnum

class ChunkRepository(BaseRepository[Chunk]):
    
    def __init__(self, db: AsyncSession):
        super().__init__(Chunk, db)

    #################################################################################
    #################################################################################
    async def delete_by_document_id(self, document_id: uuid.UUID) -> None:
        await self.db.execute(
            delete(self.model).where(self.model.document_id == document_id)
        )

    #################################################################################
    #################################################################################
    async def get_all_ordered(self) -> List[Chunk]:
        stmt = (
            select(self.model)
            .order_by(self.model.document_id, self.model.chunk_index)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    #################################################################################
    #################################################################################
    def create_many(self, chunks_data: List[Dict[str, Any]]) -> None:
        models_to_insert = [
            self.model(
                document_id=data["document_id"],
                chunk_index=data["chunk_index"],
                content=data["content"],
                embedding=data["embedding"]
            )
            for data in chunks_data
        ]
        self.db.add_all(models_to_insert)
        
    #################################################################################
    #################################################################################
    async def search(
        self, 
        workspace_id: uuid.UUID,
        lang: LanguageEnum, 
        question_vector: list[float], 
        limit: int = 10,
        tags: List[str] = None
    ) -> Tuple[Dict[uuid.UUID, float], List[Document]]:
        
        score_col = Chunk.embedding.cosine_distance(question_vector).label("score")
        
        stmt = (
            select(Document, Chunk.id.label("chunk_id"), score_col)
            .join(Chunk, Document.id == Chunk.document_id)
            .options(contains_eager(Document.chunks))
            .where(
                Document.workspace_id == workspace_id,
                Document.lang == lang,
                Document.is_approved == True
            )
        )

        if tags:
            ltree_tags = [Ltree(t) for t in tags]
            stmt = stmt.where(Document.tags.overlap(ltree_tags))

        stmt = stmt.order_by(score_col).limit(limit)

        result = await self.db.execute(stmt)
        rows = result.unique().all()

        scores = {row.chunk_id: float(row.score) for row in rows}

        seen_docs = set()
        db_documents = []
        for row in rows:
            if row.Document.id not in seen_docs:
                db_documents.append(row.Document)
                seen_docs.add(row.Document.id)

        return scores, db_documents