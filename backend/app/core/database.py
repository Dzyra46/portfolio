"""
Database connection and session management.

Uses SQLAlchemy 2.x with synchronous sessions. Provides the engine,
session factory, and declarative Base for models.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,
    max_overflow=10,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass

def get_db():
    """Dependency to get a database session for a request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
