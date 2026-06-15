"""
Security utilities: password hashing and JWT token management.

Uses bcrypt directly for password hashing and PyJWT for token operations.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import get_settings

settings = get_settings()

# --- Password Hashing ---


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    password_bytes = plain_password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


# --- JWT Tokens ---


def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.

    Args:
        subject: The token subject (e.g. user ID or username).
        expires_delta: Optional custom expiration. Defaults to config value.

    Returns:
        Encoded JWT string.
    """
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.JWT_EXPIRATION_MINUTES))
    payload = {
        "sub": subject,
        "iat": now,
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.

    Args:
        token: The encoded JWT string.

    Returns:
        Decoded payload dict.

    Raises:
        jwt.ExpiredSignatureError: If the token has expired.
        jwt.InvalidTokenError: If the token is invalid.
    """
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )

