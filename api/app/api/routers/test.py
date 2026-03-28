from fastapi import APIRouter
import pymupdf4llm
router = APIRouter()

#############################################################################
# Test Endpoints
#############################################################################
@router.post("/test", response_model=None)
async def testing_(
):
    md_text = pymupdf4llm.to_markdown("input.pdf")
    return md_text