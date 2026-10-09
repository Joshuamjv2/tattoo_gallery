from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from typing import List
from sqlalchemy.sql import func


class Artist(SQLModel, table=True):
    __tablename__ = "artists"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )

    instagram: str = Field(nullable=True)
    name: str = Field(max_length=50, nullable=True)
    email: str = Field(nullable=True, max_length=100)
    image: str = Field(nullable=True)
    go_reminders_id: int = Field(nullable=True)
    work: List["ArtistWork"] = Relationship(
        sa_relationship_kwargs={"lazy": "selectin"},
        cascade_delete="all"
    )
    description: str = Field(default=None, nullable=True, min_length=20)
    style: str = Field(nullable=True, max_length=50)  # could be a literal field

    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now()
    ))

    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    ))

    # style, description/extra info

    def __repr__(self):
        return f"<Artist {self.name}>"
