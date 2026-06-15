"""
Social links model — GitHub, LinkedIn, Twitter, etc.
"""

import uuid
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class SocialLink(BaseModel):
    """Social media links associated with the developer profile."""

    __tablename__ = "social_links"

    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"))
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    profile = relationship("Profile", back_populates="social_links")
