"""single tag on document

Revision ID: a1b2c3d4e5f6
Revises: 91958da000e9
Create Date: 2026-03-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '91958da000e9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old multi-tag index and columns
    op.execute("DROP INDEX IF EXISTS idx_documents_tags")
    op.execute("DROP INDEX IF EXISTS idx_documents_tags_gist")
    op.drop_column('documents', 'tags')
    op.drop_column('documents', 'suggestions')

    # Add single nullable ltree tag column
    op.add_column('documents', sa.Column(
        'tag',
        sqlalchemy_utils.types.ltree.LtreeType(),
        nullable=True
    ))


def downgrade() -> None:
    op.drop_column('documents', 'tag')

    op.add_column('documents', sa.Column(
        'suggestions',
        sa.ARRAY(sa.String()),
        server_default=sa.text("'{}'::text[]"),
        nullable=False
    ))
    op.add_column('documents', sa.Column(
        'tags',
        sa.ARRAY(sqlalchemy_utils.types.ltree.LtreeType()),
        server_default=sa.text("'{}'::ltree[]"),
        nullable=False
    ))
    op.create_index('idx_documents_tags_gist', 'documents', ['tags'], unique=False, postgresql_using='gist')
