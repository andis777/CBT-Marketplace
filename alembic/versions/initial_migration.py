"""initial migration

Revision ID: initial_migration
Revises: 
Create Date: 2024-03-15 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = 'initial_migration'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('avatar', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create institutions table
    op.create_table(
        'institutions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('psychologists_count', sa.Integer(), nullable=True),
        sa.Column('services', sqlite.JSON(), nullable=True),
        sa.Column('contacts', sqlite.JSON(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_institutions_id'), 'institutions', ['id'], unique=False)

    # Create psychologists table
    op.create_table(
        'psychologists',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('experience', sa.Integer(), nullable=True),
        sa.Column('institution_id', sa.String(), nullable=True),
        sa.Column('rating', sa.Float(), nullable=True),
        sa.Column('reviews_count', sa.Integer(), nullable=True),
        sa.Column('specializations', sqlite.JSON(), nullable=True),
        sa.Column('languages', sqlite.JSON(), nullable=True),
        sa.Column('memberships', sqlite.JSON(), nullable=True),
        sa.Column('education', sqlite.JSON(), nullable=True),
        sa.Column('certifications', sqlite.JSON(), nullable=True),
        sa.Column('gallery', sqlite.JSON(), nullable=True),
        sa.Column('location', sqlite.JSON(), nullable=True),
        sa.Column('contacts', sqlite.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['institution_id'], ['institutions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_psychologists_id'), 'psychologists', ['id'], unique=False)

    # Create clients table
    op.create_table(
        'clients',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('preferences', sqlite.JSON(), nullable=True),
        sa.Column('saved_psychologists', sqlite.JSON(), nullable=True),
        sa.Column('saved_institutions', sqlite.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_clients_id'), 'clients', ['id'], unique=False)

    # Create articles table
    op.create_table(
        'articles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('preview', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('image', sa.String(), nullable=True),
        sa.Column('author_id', sa.String(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('tags', sqlite.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_articles_id'), 'articles', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_articles_id'), table_name='articles')
    op.drop_table('articles')
    op.drop_index(op.f('ix_clients_id'), table_name='clients')
    op.drop_table('clients')
    op.drop_index(op.f('ix_psychologists_id'), table_name='psychologists')
    op.drop_table('psychologists')
    op.drop_index(op.f('ix_institutions_id'), table_name='institutions')
    op.drop_table('institutions')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')