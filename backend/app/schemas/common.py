"""
Common response shapes used across endpoints.
"""

from typing import Any

from pydantic import BaseModel


class MessageResponse(BaseModel):
    """Simple message response."""

    message: str


class DataResponse(BaseModel):
    """Standard data wrapper response."""

    data: Any
    message: str = "Success"


class PaginatedResponse(BaseModel):
    """Paginated list response."""

    data: list[Any]
    total: int
    page: int
    page_size: int
