"""
Auth routes.

Provides login, logout, and current user info.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.errors import UnauthorizedException
from app.dependencies.auth import get_current_admin
from app.models.admin_user import AdminUser
from app.schemas.auth import LoginRequest, TokenResponse, AdminUserResponse
from app.schemas.common import MessageResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    """
    Admin login endpoint.
    
    Authenticates username/password against the database and returns a JWT.
    """
    admin_user = db.query(AdminUser).filter(
        AdminUser.username == payload.username,
        AdminUser.is_active == True
    ).first()

    if not admin_user or not verify_password(payload.password, admin_user.hashed_password):
        raise UnauthorizedException(detail="Incorrect username or password")

    # Generate token using user ID as subject
    token = create_access_token(subject=str(admin_user.id))
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/logout", response_model=MessageResponse)
def logout() -> dict:
    """
    Admin logout endpoint.
    
    Since we are using JWT, actual invalidation happens client-side by dropping the token.
    If using HTTP-only cookies in the future, this would clear the cookie.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=AdminUserResponse)
def get_current_user(current_admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    """
    Get current authenticated admin user.
    """
    return current_admin
