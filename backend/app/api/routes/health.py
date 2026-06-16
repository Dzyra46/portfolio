"""
Health check endpoints.

GET /health — application health status.
GET /health/db — database connectivity check.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.health import HealthDBResponse, HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse)
def health_check() -> dict:
    """Basic application health check."""
    return {"status": "ok"}


@router.get("/health/db", response_model=HealthDBResponse)
def health_check_db(db: Session = Depends(get_db)) -> dict:
    """
    Database connectivity health check.

    Executes a simple SELECT 1 query to verify the database is reachable.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "error", "database": "unreachable"}
