import sys
import os
import subprocess

with open("alembic/versions/xxxx_ai_layer_upgrade.py", "w") as f:
    f.write("""\"\"\"AI layer upgrade

Revision ID: yyyy
Revises: xxxx
Create Date: 2026-05-03

\"\"\"
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'yyyy'
down_revision: Union[str, None] = 'xxxx'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('document_chunks', sa.Column('section', sa.String(), nullable=True))
    op.add_column('chat_messages', sa.Column('token_usage', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('chat_messages', sa.Column('model_used', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('chat_messages', 'model_used')
    op.drop_column('chat_messages', 'token_usage')
    op.drop_column('document_chunks', 'section')
""")
