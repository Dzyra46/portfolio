"""
Testimonials model — Testimonials/recommendations.
"""

from sqlalchemy import String, Text, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Testimonial(BaseModel):
    """Testimonial or recommendation."""

    __tablename__ = "testimonials"

    author_name: Mapped[str] = mapped_column(String(200), nullable=False)
    author_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    author_company: Mapped[str | None] = mapped_column(String(200), nullable=True)
    author_avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
