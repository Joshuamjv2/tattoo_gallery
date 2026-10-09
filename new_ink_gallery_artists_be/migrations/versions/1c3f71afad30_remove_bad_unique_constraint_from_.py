"""Remove bad unique constraint from PortfolioTag

Revision ID: 1c3f71afad30
Revises: 769c94333c9d
Create Date: 2025-06-20 04:27:31.144747

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '1c3f71afad30'
down_revision: Union[str, None] = '769c94333c9d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop existing single-column PK
    op.drop_constraint('portfoliotag_pkey', 'portfoliotag', type_='primary')

    # Create composite PK on tag_id and portfolio_id
    op.create_primary_key(
        'portfoliotag_pkey',
        'portfoliotag',
        ['tag_id', 'portfolio_id']
    )


def downgrade():
    # Reverse changes in downgrade
    op.drop_constraint('portfoliotag_pkey', 'portfoliotag', type_='primary')
    op.create_primary_key(
        'portfoliotag_pkey',
        'portfoliotag',
        ['portfolio_id']
    )
