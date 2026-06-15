"""Add missing indexes for content filtering and ordering

Revision ID: a3b4c5d6e7f8
Revises: 9a6107482869
Create Date: 2026-06-05 04:45:00.000000+00:00
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a3b4c5d6e7f8'
down_revision: Union[str, None] = '9a6107482869'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add missing is_published indexes (projects already has one)
    op.create_index(op.f('ix_skills_is_published'), 'skills', ['is_published'], unique=False)
    op.create_index(op.f('ix_certificates_is_published'), 'certificates', ['is_published'], unique=False)
    op.create_index(op.f('ix_testimonials_is_published'), 'testimonials', ['is_published'], unique=False)
    op.create_index(op.f('ix_educations_is_published'), 'educations', ['is_published'], unique=False)
    op.create_index(op.f('ix_experiences_is_published'), 'experiences', ['is_published'], unique=False)

    # Add missing sort_order index on educations
    op.create_index(op.f('ix_educations_sort_order'), 'educations', ['sort_order'], unique=False)

    # Add created_at index on contact_messages for time-based pagination
    op.create_index(op.f('ix_contact_messages_created_at'), 'contact_messages', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_contact_messages_created_at'), table_name='contact_messages')
    op.drop_index(op.f('ix_educations_sort_order'), table_name='educations')
    op.drop_index(op.f('ix_experiences_is_published'), table_name='experiences')
    op.drop_index(op.f('ix_educations_is_published'), table_name='educations')
    op.drop_index(op.f('ix_testimonials_is_published'), table_name='testimonials')
    op.drop_index(op.f('ix_certificates_is_published'), table_name='certificates')
    op.drop_index(op.f('ix_skills_is_published'), table_name='skills')
