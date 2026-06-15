"""
Certificates model — Professional certificates.
"""

from datetime import date
from sqlalchemy import String, Boolean, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Certificate(BaseModel):
    """Professional certificate."""

    __tablename__ = "certificates"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    issuer: Mapped[str] = mapped_column(String(200), nullable=False)
    credential_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    credential_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    issue_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
