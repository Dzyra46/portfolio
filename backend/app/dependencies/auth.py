"""
Authentication dependencies.
"""

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.admin_user import AdminUser
from app.core.errors import UnauthorizedException

# Note: The tokenUrl should match the path where the client sends the login payload
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AdminUser:
    """
    Dependency to get the current authenticated admin user from JWT.
    
    Validates the token, extracts the subject (user ID), and fetches
    the active admin user from the database.
    """
    try:
        payload = decode_access_token(token)
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException(detail="Could not validate credentials")
    except jwt.ExpiredSignatureError as err:
        raise UnauthorizedException(detail="Token has expired") from err
    except jwt.InvalidTokenError as err:
        raise UnauthorizedException(detail="Could not validate credentials") from err

    admin_user = db.query(AdminUser).filter(AdminUser.id == user_id, AdminUser.is_active == True).first()
    if admin_user is None:
        raise UnauthorizedException(detail="User not found or inactive")
        
    return admin_user
