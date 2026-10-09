from sqlmodel import SQLModel, Field, Column
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func


class Tag(SQLModel, table=True):
    __tablename__ = "tags"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    tag: str = Field(nullable=True, max_length=50)

    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now()
    ))

    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ))

    def __repr__(self):
        return f"<Design {self.tag}>"


class DesignTag(SQLModel, table=True):
    tag_id: uuid.UUID = Field(foreign_key="tags.id", ondelete="CASCADE", primary_key=True)
    design_id: uuid.UUID = Field(foreign_key="designs.id", ondelete="CASCADE", primary_key=True)
    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now()
    ))

    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ))


class PortfolioTag(SQLModel, table=True):
    tag_id: uuid.UUID = Field(foreign_key="tags.id", ondelete="CASCADE", primary_key=True)
    portfolio_id: uuid.UUID = Field(foreign_key="artist_work.id", ondelete="CASCADE", primary_key=True)
    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now()
    ))

    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ))


class TattooIdeaTag(SQLModel, table=True):
    tag_id: uuid.UUID = Field(foreign_key="tags.id", ondelete="CASCADE", primary_key=True)
    tattoo_idea_id: uuid.UUID = Field(foreign_key="tattoo_ideas.id", ondelete="CASCADE", primary_key=True)
    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now()
    ))

    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ))
