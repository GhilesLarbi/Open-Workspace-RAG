import uuid, asyncio
from datetime import datetime
from taskiq import TaskiqDepends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.job import JobConfig
from app.models.enums import JobStatus, LanguageEnum

from app.taskiq.broker import broker
from app.core.database import get_db
from app.repositories.document import DocumentRepository
from app.repositories.chunk import ChunkRepository
from app.repositories.job import JobRepository

from app.utils.text import get_language_enum, get_content_hash, chunk_text
from app.utils.vector import embed_chunks
from app.utils.scraper import scrape_deep_crawl


################################################################################
################################################################################
@broker.task
async def process_and_store_page_task(
    url: str,
    fit_markdown: str,
    title: str,
    lang: LanguageEnum,
    workspace_id: str,
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:
    doc_repo = DocumentRepository(db)
    chunk_repo = ChunkRepository(db)
    
    content_hash = get_content_hash(fit_markdown)
    ws_uuid = uuid.UUID(workspace_id)
    existing_doc = await doc_repo.get_by_url_and_workspace(url, ws_uuid)
    
    if existing_doc:
        await chunk_repo.delete_by_document_id(existing_doc.id)
        existing_doc.content_hash = content_hash
        existing_doc.updated_at = datetime.now()
        existing_doc.title = title
        doc_id = existing_doc.id
    else:
        new_doc = doc_repo.create(
            workspace_id=ws_uuid,
            url=url,
            title=title or "Untitled",
            lang=lang,
            content_hash=content_hash,
            is_approved=False,
            tags=[], 
            suggestions=[]
        )
        await db.flush()
        doc_id = new_doc.id

    chunks_text = chunk_text(text=fit_markdown, window_size=400, overlap=50)
    
    if chunks_text:
        vectors = embed_chunks(chunks_text)
        chunks_data = [
            {
                "document_id": doc_id, 
                "chunk_index": i, 
                "content": txt, 
                "embedding": vec
            }
            for i, (txt, vec) in enumerate(zip(chunks_text, vectors))
        ]
        chunk_repo.create_many(chunks_data)

    await db.commit()
    return {
        "doc_id": str(doc_id),
        "url": url,
        "title": title,
        "lang": lang
    }


################################################################################
################################################################################
@broker.task
async def sync_site_task(
    job_id: str, 
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:
    job_repo = JobRepository(db)
    doc_repo = DocumentRepository(db)

    db_job = await job_repo.get_by_id(uuid.UUID(job_id))
    db_job.status = JobStatus.STARTED
    await db.commit()

    config = JobConfig(**db_job.payload)
    results = await scrape_deep_crawl(config=config)
    
    success_pages = []
    failed_pages = []
    queued_urls = set()
    handles = []

    for result in results:
        if not result.success:
            failed_pages.append({
                "url": result.url,
                "error": result.error_message or "Unknown crawler error",
                "status": "crawler_error"
            })
            continue
            
        if not result.markdown or not result.markdown.fit_markdown:
            failed_pages.append({
                "url": result.url,
                "error": "Page returned no content",
                "status": "empty_content"
            })
            continue

        normalized_url = result.url.rstrip('/')
        if normalized_url in queued_urls:
            continue

        clean_text = result.markdown.fit_markdown

        word_count = len(clean_text.split())
        if word_count < config.filtering.word_count_threshold:
            failed_pages.append({
                "url": result.url,
                "error": f"Word count {word_count} is below threshold {config.filtering.word_count_threshold}",
                "status": "filtered_word_count"
            })
            continue

        detected_lang = get_language_enum(clean_text)        
        if config.filtering.languages and detected_lang not in config.filtering.languages:
            failed_pages.append({
                "url": result.url,
                "error": f"Language {detected_lang} not in allowed list",
                "status": "filtered_language"
            })
            continue

        content_hash = get_content_hash(clean_text)
        existing_doc = await doc_repo.get_by_url_and_workspace(
            url=normalized_url,
            workspace_id=db_job.workspace_id
        )

        if existing_doc and existing_doc.content_hash == content_hash:
            continue

        queued_urls.add(normalized_url)
        
        meta = result.metadata or {}
        title = meta.get("title") or meta.get("og:title") or "Untitled"

        handle = await process_and_store_page_task.kiq(
            url=result.url,
            fit_markdown=clean_text,
            title=title,
            workspace_id=str(db_job.workspace_id),
            lang=detected_lang
        )
        handles.append(handle)

    if handles:
        task_results = await asyncio.gather(*[h.wait_result() for h in handles])
        for r in task_results:
            success_pages.append(r.return_value)

    total_attempted = len(results)
    
    if total_attempted > 0 and len(success_pages) == 0:
        db_job.status = JobStatus.FAILURE
    else:
        db_job.status = JobStatus.SUCCESS

    db_job.result = {
        "success_pages": success_pages,
        "failed_pages": failed_pages,
        "summary": {
            "total": total_attempted,
            "succeeded": len(success_pages),
            "failed": len(failed_pages)
        }
    }

    await db.commit()
    return db_job.result