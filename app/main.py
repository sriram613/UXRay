import uvicorn
import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(title="AI Audit Service")
    app.include_router(router)
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
