"""Fix portfoliotag primary key

Revision ID: be31f3af04db
Revises: 1c3f71afad30
Create Date: 2025-06-20 04:45:09.106824

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'be31f3af04db'
down_revision: Union[str, None] = '1c3f71afad30'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add composite primary key on (tag_id, portfolio_id)
    # op.create_primary_key(
    #     'portfoliotag_pkey',
    #     'portfoliotag',
    #     ['tag_id', 'portfolio_id']
    # )
    pass


def downgrade():
    # Drop composite primary key
    op.drop_constraint('portfoliotag_pkey', 'portfoliotag', type_='primary')