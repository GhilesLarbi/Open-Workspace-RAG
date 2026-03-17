"""rename job paylod to config

Revision ID: bffffb7b53ac
Revises: 5a87c631aec9
Create Date: 2026-03-17 06:10:12.294258

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from app.schemas.job import JobConfig, JobResult
import app.models.types

# revision identifiers, used by Alembic.
revision: str = 'bffffb7b53ac'
down_revision: Union[str, Sequence[str], None] = '5a87c631aec9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. RENAME the column so you don't lose data
    op.alter_column('jobs', 'payload', new_column_name='config')
    
    # 2. CHANGE the type to your PydanticType
    # We pass the pydantic_type here so Python knows how to validate it later
    op.alter_column('jobs', 'config',
               type_=app.models.types.PydanticType(pydantic_type=JobConfig),
               existing_type=postgresql.JSONB())
               
    op.alter_column('jobs', 'result',
               type_=app.models.types.PydanticType(pydantic_type=JobResult),
               existing_type=postgresql.JSONB())

def downgrade() -> None:
    # 1. Rename back
    op.alter_column('jobs', 'config', new_column_name='payload')
    
    # 2. Revert types to standard JSONB
    op.alter_column('jobs', 'payload',
               type_=postgresql.JSONB())
               
    op.alter_column('jobs', 'result',
               type_=postgresql.JSONB())