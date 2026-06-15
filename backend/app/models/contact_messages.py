"""
Contact Messages model — Visitor contact form submissions.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class ContactMessage(BaseModel):
    """Message from the contact form."""

    __tablename__ = "contact_messages"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="unread", nullable=False, index=True)

