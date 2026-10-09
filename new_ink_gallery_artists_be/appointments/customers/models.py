from sqlmodel import SQLModel, Field, Column
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from sqlalchemy.sql import func
from typing import List
from sqlalchemy import String
from typing import Optional


class Customer(SQLModel, table=True):
    __tablename__ = "customers"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    go_reminders_id: Optional[str]
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(max_length=50)
    contact_method: str = Field(nullable=True, default="email")
    phone: Optional[str] = Field(max_length=15, nullable=True, default=None)

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
        return f"<Appointment {self.created_at}>"
