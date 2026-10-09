from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum


class ContactMethod(str, Enum):
    text = "text"
    call = "call"
    email = "email"


class Customer(BaseModel):
    id: UUID
    go_reminders_id: str
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(max_length=50)
    phone: Optional[str] = Field(max_length=15)
    contact_method: Optional[ContactMethod] = Field(default="email")
    created_at: datetime
    updated_at: datetime


class CreateCustomer(BaseModel):
    go_reminders_id: Optional[str] = Field(default=None)
    first_name: str = Field(max_length=50)
    phone: Optional[str] = Field(max_length=15, default=None)
    last_name: str = Field(max_length=50)
    contact_method: Optional[ContactMethod] = Field(default="email")
    email: str = Field(max_length=50)


class UpdateCustomer(BaseModel):
    first_name: Optional[str] = Field(max_length=50, default=None)
    last_name: Optional[str] = Field(max_length=50, default=None)
    phone: Optional[str] = Field(max_length=15, default=None)
    contact_method: Optional[ContactMethod] = Field(default=None)
