from fastapi import FastAPI
from app.core.settings import settings
from app.api.router import router
import uvicorn

app = FastAPI(
    openapi_url=f"{settings.API_PREFIX}/openapi.json"
)
app.include_router(router=router, prefix=settings.API_PREFIX)

@app.get("/")
def health_check():
    return {"status": "API is healthy"}


if __name__ == "__main__":    
    uvicorn.run(
        "app.main:app", 
        host=settings.API_HOST, 
        port=settings.API_PORT, 
        reload=True,
        log_level="info",
        access_log=False,
        use_colors=False,
        timeout_graceful_shutdown=1
    )