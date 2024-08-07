"""db migration

Revision ID: 7adca27ca5d1
Revises: 577f2f99aa3c
Create Date: 2024-07-17 11:14:37.082639

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7adca27ca5d1'
down_revision = '577f2f99aa3c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('completion_date', sa.Date(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.drop_column('completion_date')

    # ### end Alembic commands ###
