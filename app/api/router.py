from fastapi import APIRouter
from app.api.routers import datasets

router = APIRouter()

router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])