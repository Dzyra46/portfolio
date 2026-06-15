"""
Analytics Events model — Tracked user interaction events.
"""

from datetime import datetime, timezone
from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import UUIDPrimaryKeyMixin, Base


class AnalyticsEvent(UUIDPrimaryKeyMixin, Base):
    """User interaction event tracking."""

    __tablename__ = "analytics_events"

    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    page_path: Mapped[str] = mapped_column(String(500), nullable=False)
    target_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    referrer: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    metadata_json: Mapped[dict | list | None] = mapped_column("metadata", JSON().with_variant(JSONB, "postgresql"), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )
