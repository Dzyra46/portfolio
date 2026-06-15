"""
SEO Settings model — Per-page SEO overrides.
"""

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class SeoSetting(BaseModel):
    """SEO configuration for a specific page."""

    __tablename__ = "seo_settings"

    page_key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    og_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    og_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    og_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    canonical_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    structured_data: Mapped[dict | list | None] = mapped_column(JSON().with_variant(JSONB, "postgresql"), nullable=True)
