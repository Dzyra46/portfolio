"""
Projects model — Curated portfolio projects.
"""

from sqlalchemy import String, Text, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Project(BaseModel):
    """Portfolio project."""

    __tablename__ = "projects"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    case_study: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
