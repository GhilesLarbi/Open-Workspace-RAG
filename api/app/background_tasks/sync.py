import uuid, asyncio
from datetime import datetime
from itertools import islice
from typing import Dict, Any, List
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

BATCH_SIZE = 10


def _batched(iterable, n):
    it = iter(iterable)
    while chunk := list(islice(it, n)):
        yield chunk


################################################################################
# PagePayload shape expected in each batch item:
# {
#   "url": str,
#   "fit_markdown": str,
#   "title": str,
#   "lang": LanguageEnum,
#   "workspace_id": str,
# }
################################################################################
@broker.task
async def process_and_store_page_task(
    pages: List[Dict[str, Any]],
    db: AsyncSession = TaskiqDepends(get_db)
) -> List[Dict[str, Any]]:
    doc_repo = DocumentRepository(db)
    chunk_repo = ChunkRepository(db)

    results = []

    for page in pages:
        url          = page["url"]
        fit_markdown = page["fit_markdown"]
        title        = page["title"]
        lang         = page["lang"]
        ws_uuid      = uuid.UUID(page["workspace_id"])

        content_hash  = get_content_hash(fit_markdown)
        existing_doc  = await doc_repo.get_by_url_and_workspace(url, ws_uuid)

        if existing_doc:
            await chunk_repo.delete_by_document_id(existing_doc.id)
            existing_doc.content_hash = content_hash
            existing_doc.updated_at   = datetime.now()
            existing_doc.title        = title
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
            vectors     = embed_chunks(chunks_text)
            chunks_data = [
                {
                    "document_id": doc_id,
                    "chunk_index": i,
                    "content":     txt,
                    "embedding":   vec,
                }
                for i, (txt, vec) in enumerate(zip(chunks_text, vectors))
            ]
            chunk_repo.create_many(chunks_data)

        # Flush after each page so subsequent pages in the same batch
        # can see the newly created doc (e.g. avoid duplicate inserts).
        await db.flush()

        results.append({
            "doc_id": str(doc_id),
            "url":    url,
            "title":  title,
            "lang":   lang,
        })

    await db.commit()
    return results


################################################################################
@broker.task
async def sync_site_task(
    job_id: str,
    db: AsyncSession = TaskiqDepends(get_db)
) -> dict:
    job_repo = JobRepository(db)
    doc_repo = DocumentRepository(db)

    db_job        = await job_repo.get_by_id(uuid.UUID(job_id))
    db_job.status = JobStatus.STARTED
    await db.commit()

    config  = JobConfig(**db_job.payload)
    results = await scrape_deep_crawl(config=config)

    valid_pages    = []
    failed_pages   = []
    ignored_pages  = []
    queued_urls    = set()

    for result in results:
        # ── Crawler-level failures ──────────────────────────────────────────
        if not result.success:
            failed_pages.append({
                "url":    result.url,
                "error":  result.error_message or "Unknown crawler error",
                "status": "crawler_error",
            })
            continue

        if not result.markdown or not result.markdown.fit_markdown:
            ignored_pages.append({
                "url":    result.url,
                "title":  meta.get("title") or meta.get("og:title") or "Untitled",
                "reason":  "Page returned no content",
            })
            continue

        # ── Filtering ───────────────────────────────────────────────────────
        clean_text = result.markdown.fit_markdown
        meta       = result.metadata or {}
        title      = meta.get("title") or meta.get("og:title") or "Untitled"

        word_count = len(clean_text.split())
        if word_count < config.filtering.word_count_threshold:
            ignored_pages.append({
                "url":    result.url,
                "title":  title,
                "reason":  f"Word count {word_count} is below threshold {config.filtering.word_count_threshold}",
            })
            continue

        detected_lang = get_language_enum(clean_text)
        if config.filtering.languages and detected_lang not in config.filtering.languages:
            ignored_pages.append({
                "url":    result.url,
                "title":  title,
                "reason": f"Language '{detected_lang}' not in allowed list",
            })
            continue

        # ── Duplicate URL within this crawl ────────────────────────────────
        normalized_url = result.url.rstrip('/')
        if normalized_url in queued_urls:
            ignored_pages.append({
                "url":    result.url,
                "title":  title,
                "reason": "Duplicate URL encountered during crawl",
            })
            continue

        # ── Duplicate content already in DB ────────────────────────────────
        content_hash = get_content_hash(clean_text)
        existing_doc = await doc_repo.get_by_url_and_workspace(
            url=normalized_url,
            workspace_id=db_job.workspace_id,
        )

        if existing_doc and existing_doc.content_hash == content_hash:
            ignored_pages.append({
                "url":    result.url,
                "title":  title,
                "reason": "Content unchanged since last crawl",
            })
            continue

        # ── Collect for batching ────────────────────────────────────────────
        queued_urls.add(normalized_url)
        valid_pages.append({
            "url":          result.url,
            "fit_markdown": clean_text,
            "title":        title,
            "lang":         detected_lang,
            "workspace_id": str(db_job.workspace_id),
        })

    # ── Dispatch in batches of BATCH_SIZE ──────────────────────────────────
    handles = [
        await process_and_store_page_task.kiq(pages=batch)
        for batch in _batched(valid_pages, BATCH_SIZE)
    ]

    pages_out = []
    if handles:
        task_results = await asyncio.gather(*[h.wait_result() for h in handles])
        for r in task_results:
            pages_out.extend(r.return_value)

    total_attempted = len(results)

    db_job.status = (
        JobStatus.FAILURE
        if total_attempted > 0 and len(pages_out) == 0
        else JobStatus.SUCCESS
    )

    db_job.result = {
        "pages":        pages_out,
        "failed_pages": failed_pages,
        "ignored_pages": ignored_pages,
        "summary": {
            "total":     total_attempted,
            "succeeded": len(pages_out),
            "failed":    len(failed_pages),
            "ignored":   len(ignored_pages),
        },
    }

    await db.commit()
    return db_job.result