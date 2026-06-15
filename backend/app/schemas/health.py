"""
Health check response schemas.
"""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response for the basic health check."""

    status: str


class HealthDBResponse(BaseModel):
    """Response for the database health check."""

    status: str
    database: str
