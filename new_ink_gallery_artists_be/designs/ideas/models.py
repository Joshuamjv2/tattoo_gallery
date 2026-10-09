from sqlmodel import SQLModel, Field, Column, Relationship
from typing import List
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from tags.models import TattooIdeaTag


class TattooIdea(SQLModel, table=True):
    __tablename__ = "tattoo_ideas"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )

    image: str = Field(nullable=True)

    tags: List["Tag"] = Relationship(
        link_model=TattooIdeaTag,
        sa_relationship_kwargs={"lazy": "selectin"}
    )

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
        return f"<Idea {self.id}>"
