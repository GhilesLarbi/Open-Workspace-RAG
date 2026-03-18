from fastapi import APIRouter
from app.api.routers import organization, workspace, tags, document, chat, job, test

router = APIRouter()

router.include_router(organization.router, prefix="/organizations", tags=["Organizations"])
router.include_router(workspace.router, prefix="/workspaces", tags=["Workspaces"])
router.include_router(document.router, prefix="/documents", tags=["Documents"])
router.include_router(job.router, prefix="/jobs", tags=["Jobs"])
router.include_router(tags.router, prefix="/tags", tags=["Tags"])
router.include_router(chat.router, prefix="/chat", tags=["Chat"])
router.include_router(test.router, prefix="/tests", tags=["Tests"])
