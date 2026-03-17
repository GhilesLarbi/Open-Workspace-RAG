import asyncio, json, uuid
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.api.dependencies.repositories import WorkspaceRepositoryDep, JobRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep, CurrentWorkspaceDep
from app.schemas.job import JobConfig, PaginatedJobResponse, JobResponse
from app.background_tasks.sync import sync_site_task
from app.schemas.enums import JobStatus
from typing import List, Optional
from crawl4ai.models import CrawlResultContainer, CrawlResult, MarkdownGenerationResult

router = APIRouter()



###################################################################################################
###################################################################################################
@router.get("/{slug}", response_model=PaginatedJobResponse)
async def get_workspace_jobs(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    job_repo: JobRepositoryDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[List[JobStatus]] = Query(None)
):
    db_jobs, total = await job_repo.get_by_workspace(
        workspace_id=db_workspace.id,
        skip=skip,
        limit=limit,
        statuses=status
    )
    return PaginatedJobResponse(items=db_jobs, total=total, skip=skip, limit=limit)

###################################################################################################
###################################################################################################
@router.get("/{slug}/{job_id}", response_model=JobResponse)
async def get_workspace_jobs(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    job_repo: JobRepositoryDep,
    job_id: uuid.UUID
):
    db_job = await job_repo.get_by_id(job_id)
    if not db_job or db_job.workspace_id != db_workspace.id:
        raise HTTPException(404, "Job not found in this workspace")

    return db_job

###################################################################################################
###################################################################################################
def clean_crawlresults(results: List[CrawlResult]) -> List[CrawlResult] : 
    for result in results : 
        result.html = ""
        result.fit_html = ""
        result.cleaned_html = ""
        result.media = {}
        result.links = {}
        result.response_headers = {}
        if result._markdown : 
            result._markdown.raw_markdown = ""
            result._markdown.markdown_with_citations = ""
            result._markdown.references_markdown = ""
            result._markdown.fit_html = ""
    return results

###################################################################################################
###################################################################################################
@router.post("/{slug}")
async def create_and_sync_workspace(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    config: JobConfig,
    job_repo: JobRepositoryDep
):
    # TEST LOGIC 
    # from app.utils.scraper import scrape_deep_crawl
    # results = await scrape_deep_crawl(config=config)
    # results: CrawlResultContainer = results[0]
    # return clean_crawlresults(results._results)

    db_job = job_repo.create(
        workspace_id=db_workspace.id,
        config=config
    )
    await job_repo.db.commit()

    task = await sync_site_task.kiq(job_id=str(db_job.id))

    db_job.task_id = task.task_id
    db_job.status = JobStatus.PENDING
    
    await job_repo.db.commit()
    return db_job



###################################################################################################
###################################################################################################
@router.patch("/{slug}/{job_id}")
async def update_and_resync_job(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    job_id: uuid.UUID,
    config: JobConfig,
    workspace_repo: WorkspaceRepositoryDep,
    job_repo: JobRepositoryDep
):

    db_job = await job_repo.get_by_id(job_id)
    if not db_job or db_job.workspace_id != db_workspace.id:
        raise HTTPException(404, "Job not found in this workspace")

    if db_job.status == JobStatus.STARTED:
        raise HTTPException(400, "Cannot update a job while it is actively running")

    db_job.config = config
    await job_repo.db.commit()

    return db_job



###################################################################################################
###################################################################################################
@router.post("/{slug}/run", response_model=List[JobResponse])
async def update_and_resync_job(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    job_ids: List[uuid.UUID],
    workspace_repo: WorkspaceRepositoryDep,
    job_repo: JobRepositoryDep
):

    db_jobs = []
    for job_id in job_ids:
        db_job = await job_repo.get_by_id(job_id)
        if not db_job or db_job.workspace_id != db_workspace.id:
            raise HTTPException(404, "Job not found in this workspace")
        if db_job.status == JobStatus.STARTED:
            raise HTTPException(400, f"Cannot update job {job_id} while it is actively running")
        db_jobs.append(db_job)

    db_refresh_jobs = []
    for db_job in db_jobs:
        db_job.status = JobStatus.PENDING
        task = await sync_site_task.kiq(job_id=str(db_job.id))
        db_job.task_id = task.task_id
        await job_repo.db.commit()
        await job_repo.db.refresh(db_job)
        db_refresh_jobs.append(db_job)
    
    return db_refresh_jobs

###################################################################################################
###################################################################################################
@router.delete("/{slug}")
async def delete_jobs(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    job_ids: List[uuid.UUID],
    job_repo: JobRepositoryDep
):
    deleted = await job_repo.delete_many(job_ids=job_ids, workspace_id=db_workspace.id)
    await job_repo.db.commit()

    return {"detail": f"{deleted} jobs deleted successfully"}

###################################################################################################
###################################################################################################
@router.get("/{slug}/{job_id}/progress")
async def sync_progress(
    # db_org: CurrentOrgDep,
    # db_workspace: CurrentWorkspaceDep,
    slug: str,
    job_id: uuid.UUID, 
    job_repo: JobRepositoryDep
):
    async def event_stream():
        while True:
            db_job = await job_repo.get_by_id(job_id)
            
            if not db_job:
                yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
                break

            await job_repo.db.refresh(db_job)

            data = {
                "status": db_job.status, 
                "task_id": db_job.task_id,
                "result": db_job.result 
            }
            yield f"data: {json.dumps(data)}\n\n"

            if db_job.status in [JobStatus.SUCCESS, JobStatus.FAILURE]:
                break
                
            await asyncio.sleep(1)

    return StreamingResponse(
        event_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )