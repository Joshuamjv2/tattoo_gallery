"""change models

Revision ID: 920ddb7fd258
Revises: 3e2a7645836f
Create Date: 2025-05-27 15:01:59.234999

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '920ddb7fd258'
down_revision: Union[str, None] = '3e2a7645836f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Replace with your table name
table_name = "tattooideatag"


def upgrade():
    # Drop the existing table
    op.drop_table(table_name)

    # Recreate the table with correct primary key definition
    op.create_table(
        table_name,
        sa.Column("tag_id", sa.UUID(), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("tattoo_idea_id", sa.UUID(), sa.ForeignKey("tattoo_ideas.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now())
    )


def downgrade():
    op.drop_table(table_name)  # Only drops it in downgrade — no recreation
