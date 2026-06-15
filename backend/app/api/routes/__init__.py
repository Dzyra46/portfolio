"""
Router aggregation — registers all sub-routers.
"""

from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.public import router as public_router

api_router = APIRouter()

# Health checks at root level
api_router.include_router(health_router, tags=["Health"])

# Auth routes
api_router.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

# Public routes
api_router.include_router(public_router, prefix="/api/v1/public", tags=["Public"])

# Admin routes
from app.api.routes.admin import router as admin_router
api_router.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])

# Admin Github Sync routes
from app.api.routes.github import router as github_router
api_router.include_router(github_router, prefix="/api/v1/admin/github", tags=["Admin Github"])
