"""
Project Skills model — Join table for projects and skills.
"""

import uuid
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import UUIDPrimaryKeyMixin, Base


class ProjectSkill(UUIDPrimaryKeyMixin, Base):
    """Join table linking projects and skills."""

    __tablename__ = "project_skills"
    __table_args__ = (
        UniqueConstraint("project_id", "skill_id", name="uq_project_skill"),
    )

    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)

