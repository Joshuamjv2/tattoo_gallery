from sqlmodel import SQLModel, Field, Column, Relationship
from typing import List
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from tags.models import PortfolioTag


class ArtistWork(SQLModel, table=True):
    __tablename__ = "artist_work"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )

    artist: uuid.UUID = Field(foreign_key="artists.id")
    image: str = Field(nullable=True)

    tags: List["Tag"] = Relationship(
        link_model=PortfolioTag,
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
        return f"<Artist {self.artist} Image {self.id}>"
