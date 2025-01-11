```python
"""add article management

Revision ID: add_article_management
Revises: initial_migration
Create Date: 2024-03-16 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = 'add_article_management'
down_revision: Union[str, None] = 'initial_migration'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Update articles table with new fields
    with op.batch_alter_table('articles') as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(), nullable=False, server_default='draft'))
        batch_op.add_column(sa.Column('published_at', sa.DateTime(timezone=True), nullable=True))
        batch_op.add_column(sa.Column('institution_id', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('psychologist_id', sa.String(), nullable=True))
        
        # Add foreign keys
        batch_op.create_foreign_key('fk_articles_institutions', 'institutions', ['institution_id'], ['id'])
        batch_op.create_foreign_key('fk_articles_psychologists', 'psychologists', ['psychologist_id'], ['id'])

def downgrade() -> None:
    with op.batch_alter_table('articles') as batch_op:
        batch_op.drop_constraint('fk_articles_institutions', type_='foreignkey')
        batch_op.drop_constraint('fk_articles_psychologists', type_='foreignkey')
        batch_op.drop_column('status')
        batch_op.drop_column('published_at')
        batch_op.drop_column('institution_id')
        batch_op.drop_column('psychologist_id')
```