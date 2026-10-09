from sqlmodel import SQLModel, Field, Column
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(
        sa_column=Column(
                pg.UUID,
                nullable=False,
                primary_key=True,
                default=uuid.uuid4
            )
        )
    password_hash: str = Field(exclude=True)
    email: str
    is_verified: bool = False
    birth_date: Optional[datetime] = Field(default=None)
    first_name: str = Field(max_length=50, nullable=True, default=None)
    last_name: str = Field(max_length=50, nullable=True, default=None)
    is_active: bool = False
    is_staff: bool = Field(default=False, nullable=True)
    created_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP,
        default=datetime.now
    ))
    updated_at: datetime = Field(sa_column=Column(
        pg.TIMESTAMP,
        default=datetime.now
    ))

    def __repr__(self):
        return f"<User {self.first_name} {self.email}>"
