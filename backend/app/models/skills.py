"""
Skills model — Tech stack with categories and sort order.
"""

from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Skill(BaseModel):
    """Tech stack skill."""

    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    proficiency_level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
