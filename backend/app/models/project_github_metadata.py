"""
Project Github Metadata model — Synced GitHub repo metadata.
"""

import uuid
from datetime import datetime
from sqlalchemy import BigInteger, String, Text, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class ProjectGithubMetadata(BaseModel):
    """Synced GitHub metadata for a project."""

    __tablename__ = "project_github_metadata"

    project_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"), unique=True, nullable=True)
    github_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    full_name: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    homepage: Mapped[str | None] = mapped_column(String(500), nullable=True)
    language: Mapped[str | None] = mapped_column(String(100), nullable=True)
    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    forks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    topics: Mapped[dict | list | None] = mapped_column(JSON().with_variant(JSONB, "postgresql"), nullable=True)
    
    last_pushed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
