from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from typing import List
from tags.models import DesignTag
from sqlalchemy import String
from typing import Optional


class Design(SQLModel, table=True):
    __tablename__ = "designs"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )

    name: str = Field(nullable=True, max_length=50)
    description: str = Field(nullable=True, max_length=500)
    price: Optional[float] = Field(nullable=True, decimal_places=2)
    precise_length: Optional[int] = Field(nullable=True, default=90)
    display_length: Optional[str] = Field(nullable=True, default=None)
    precise_size: Optional[str] = Field(nullable=True, default=None)
    display_size: Optional[str] = Field(nullable=True, default=None)
    ready_to_book: bool = Field(default=True, nullable=True)
    ai_generated: bool = Field(default=False, nullable=True)
    images: List[str] = Field(
        default_factory=list,
        sa_column=Column(pg.ARRAY(String), nullable=True)
    )
    tags: List["Tag"] = Relationship(
        link_model=DesignTag,
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

    # new fields, cta options
    def __repr__(self):
        return f"<Design {self.name}>"


# actual size, range of size