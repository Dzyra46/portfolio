"""
Auth-related Pydantic schemas.
"""

from uuid import UUID
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Admin login request payload."""

    username: str
    password: str


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    """Public-facing admin user info (never includes password)."""

    id: UUID
    username: str
    email: EmailStr
    is_active: bool

    model_config = {"from_attributes": True}

