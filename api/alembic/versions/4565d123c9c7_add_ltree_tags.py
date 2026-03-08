"""add ltree tags

Revision ID: 4565d123c9c7
Revises: 89bd52984d8c
Create Date: 2026-03-08 03:04:17.464966

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlalchemy_utils

revision: str = '4565d123c9c7'
down_revision: Union[str, Sequence[str], None] = '89bd52984d8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS ltree")
    op.execute("DROP INDEX IF EXISTS idx_documents_tags")
    op.execute("ALTER TABLE documents ALTER COLUMN tags TYPE ltree[] USING tags::ltree[]")
    op.create_index('idx_documents_tags_gist', 'documents', ['tags'], unique=False, postgresql_using='gist')
    op.add_column('workspaces', sa.Column(
        'tags', 
        postgresql.ARRAY(sqlalchemy_utils.types.ltree.LtreeType()), 
        server_default=sa.text("'{}'::ltree[]"), 
        nullable=False
    ))
    
    op.create_index('idx_workspaces_tags_gist', 'workspaces', ['tags'], unique=False, postgresql_using='gist')


def downgrade() -> None:
    op.drop_index('idx_workspaces_tags_gist', table_name='workspaces', postgresql_using='gist')
    op.drop_column('workspaces', 'tags')
    op.drop_index('idx_documents_tags_gist', table_name='documents', postgresql_using='gist')
    op.execute("ALTER TABLE documents ALTER COLUMN tags TYPE varchar[] USING tags::text[]")
    op.create_index('idx_documents_tags', 'documents', ['tags'], unique=False, postgresql_using='gin')