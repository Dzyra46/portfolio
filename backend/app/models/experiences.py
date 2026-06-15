"""
Experiences model — Work experience timeline.
"""

from datetime import date
from sqlalchemy import String, Text, Boolean, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Experience(BaseModel):
    """Work experience entry."""

    __tablename__ = "experiences"

    company: Mapped[str] = mapped_column(String(200), nullable=False)
    position: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
