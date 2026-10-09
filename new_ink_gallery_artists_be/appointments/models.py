from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from typing import List
from sqlalchemy import String
from typing import Optional


class AppointmentRequest(SQLModel, table=True):
    __tablename__ = "appointment_requests"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    design: Optional[uuid.UUID] = Field(foreign_key="designs.id", nullable=True, ondelete="CASCADE")
    artist: Optional[uuid.UUID] = Field(foreign_key="artists.id", nullable=True, ondelete="CASCADE")
    idea: Optional[uuid.UUID] = Field(foreign_key="tattoo_ideas.id", nullable=True, ondelete="CASCADE")
    customer: Optional[uuid.UUID] = Field(foreign_key="customers.id", nullable=True, ondelete="CASCADE")
    approved: Optional[bool] = Field(default=False)
    go_reminders_id: Optional[int] = Field(default=None, nullable=True)
    approved_date: Optional[datetime] = Field(sa_column=Column(pg.TIMESTAMP(timezone=True)))
    notes: str = Field(nullable=True, max_length=500)
    placement: Optional[str] = Field(nullable=True)
    recurring_rule: Optional[str] = Field(nullable=True, default=None)
    length: Optional[int] = Field(nullable=True)
    service: Optional[int] = Field(nullable=True, default=None)
    first_date: datetime = Field(sa_column=Column(pg.TIMESTAMP(timezone=True)))
    second_date: datetime = Field(sa_column=Column(pg.TIMESTAMP(timezone=True)))
    third_date: datetime = Field(sa_column=Column(pg.TIMESTAMP(timezone=True)))
    customer_info: Optional["Customer"] = Relationship(sa_relationship_kwargs={"lazy": "selectin"})
    artist_info: Optional["Artist"] = Relationship(sa_relationship_kwargs={"lazy": "selectin"})
    idea_info: Optional["TattooIdea"] = Relationship(sa_relationship_kwargs={"lazy": "selectin"})
    design_info: Optional["Design"] = Relationship(sa_relationship_kwargs={"lazy": "selectin"})
    images: List[str] = Field(
        default_factory=list,
        sa_column=Column(pg.ARRAY(String), nullable=True)
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
        return f"<Appointment {self.created_at}>"
