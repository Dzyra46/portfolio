"""
FastAPI application entry point.

Configures CORS, registers routers, and sets up error handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.routes import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers

settings = get_settings()

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
    )

    # --- CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Error Handlers ---
    register_exception_handlers(app)

    # --- Routers ---
    app.include_router(api_router)

    # --- Static Files ---
    os.makedirs("uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    return app


app = create_app()
