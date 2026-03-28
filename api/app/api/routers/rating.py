from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query
from app.api.dependencies.repositories import RatingRepositoryDep, SessionRepositoryDep
from app.api.dependencies.auth import CurrentOrgDep, CurrentWorkspaceDep, PublicWorkspaceDep
from app.schemas.rating import RateRequest, RatingResponse, PaginatedRatingResponse
from app.schemas.chat import SessionDebug

admin_rating_router = APIRouter()
public_rating_router = APIRouter()


###################################################################################################
###################################################################################################
@public_rating_router.post("/", response_model=RatingResponse)
async def create_rating(
    db_workspace: PublicWorkspaceDep,
    request: RateRequest,
    rating_repo: RatingRepositoryDep,
    session_repo: SessionRepositoryDep,
):
    turns = await session_repo.get_turns(
        workspace_id=db_workspace.id,
        session_id=str(request.session_id),
        skip=0,
        limit=100,
    )

    session = SessionDebug(
        session_id=request.session_id,
        workspace_id=db_workspace.id,
        turns=turns,
    )

    db_rating = rating_repo.create(
        workspace_id=db_workspace.id,
        is_helpful=request.is_helpful,
        session=session,
    )
    await rating_repo.db.commit()
    await rating_repo.db.refresh(db_rating)

    return db_rating


###################################################################################################
###################################################################################################
@admin_rating_router.get("/{slug}", response_model=PaginatedRatingResponse)
async def get_workspace_ratings(
    db_org: CurrentOrgDep,
    db_workspace: CurrentWorkspaceDep,
    rating_repo: RatingRepositoryDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    is_helpful: Optional[bool] = Query(None),
    created_at_from: Optional[datetime] = Query(None),
    created_at_to: Optional[datetime] = Query(None),
):
    db_ratings, total = await rating_repo.get_by_workspace(
        workspace_id=db_workspace.id,
        skip=skip,
        limit=limit,
        is_helpful=is_helpful,
        created_at_from=created_at_from,
        created_at_to=created_at_to,
    )
    return PaginatedRatingResponse(items=db_ratings, total=total, skip=skip, limit=limit)
