"""add job table

Revision ID: b79bc0f71a3c
Revises: 4565d123c9c7
Create Date: 2026-03-12 19:47:39.265912

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b79bc0f71a3c'
down_revision: Union[str, Sequence[str], None] = '4565d123c9c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. THIS IS THE FIX: Destroy the leftover ENUM from the previous failed crash
    # This resets the database state so Alembic can proceed cleanly.
    op.execute("DROP TYPE IF EXISTS job_status_enum;")

    # 2. Create the table. SQLAlchemy will automatically (and successfully) 
    # run the CREATE TYPE command for the ENUM right before creating the table.
    op.create_table('jobs',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('task_id', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('PENDING', 'STARTED', 'SUCCESS', 'FAILURE', name='job_status_enum'), nullable=False),
    sa.Column('payload', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('workspace_id', sa.UUID(), nullable=False),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_id'), 'jobs', ['id'], unique=False)
    op.create_index(op.f('ix_jobs_workspace_id'), 'jobs', ['workspace_id'], unique=False)
    op.drop_index(op.f('idx_documents_tags_gist'), table_name='documents', postgresql_using='gist')
    op.create_index('idx_documents_tags', 'documents', ['tags'], unique=False, postgresql_using='gin')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('idx_documents_tags', table_name='documents', postgresql_using='gin')
    op.create_index(op.f('idx_documents_tags_gist'), 'documents', ['tags'], unique=False, postgresql_using='gist')
    op.drop_index(op.f('ix_jobs_workspace_id'), table_name='jobs')
    op.drop_index(op.f('ix_jobs_id'), table_name='jobs')
    op.drop_table('jobs')
    
    # Clean up the ENUM properly on downgrade
    op.execute("DROP TYPE IF EXISTS job_status_enum;")