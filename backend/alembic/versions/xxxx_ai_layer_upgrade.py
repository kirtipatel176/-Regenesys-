"""Fold AI columns into initial schema (no-op tombstone)

This migration previously added columns to the `document_chunks` table and
`chat_messages`.  The `document_chunks` table has been removed as part of
the Neo4j migration.  The `token_usage` and `model_used` columns on
`chat_messages` are now included directly in the initial schema (revision
xxxx).  This revision is kept purely to preserve the revision chain.

Revision ID: yyyy
Revises: xxxx
Create Date: 2026-05-04

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'yyyy'
down_revision: Union[str, None] = 'xxxx'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # No-op: all changes from this migration have been folded into xxxx.
    pass


def downgrade() -> None:
    # No-op.
    pass

