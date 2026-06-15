"""
FastAPI dependencies.

Provides injectable dependencies for routes (e.g. database sessions).
"""

# Re-export get_db from core.database — single source of truth.
from app.core.database import get_db  # noqa: F401

__all__ = ["get_db"]
