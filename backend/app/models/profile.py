"""
Profile model — developer profile information.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Profile(BaseModel):
    """Developer profile (singleton-like — typically one row)."""

    __tablename__ = "profiles"

    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)

    social_links = relationship("SocialLink", back_populates="profile", cascade="all, delete-orphan")
