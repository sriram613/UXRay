import uvicorn
import sys
import asyncio
from backend.core.config import settings

if __name__ == "__main__":
    # Set the event loop policy to WindowsProactorEventLoopPolicy on Windows
    # This is required for Playwright to work with asyncio subprocesses
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

    print(f"🚀 Starting server on port {settings.PORT}...")
    
    # Run Uvicorn without reload to ensure the event loop policy is respected
    # and to avoid subprocess spawning issues on Windows
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=False)
