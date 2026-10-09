from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid
from enum import Enum


class AppointmentType(str, Enum):
    general = "general"
    artist = "artist"
    design = "design"
    idea = "idea"


class RecurringRules(str, Enum):
    DAILY = "RRULE:FREQ=DAILY",
    WEEKLY = "RRULE:FREQ=WEEKLY",
    WEEKLY_2 = "RRULE:FREQ=WEEKLY;INTERVAL=2",
    WEEKLY_3 = "RRULE:FREQ=WEEKLY;INTERVAL=3",
    WEEKLY_4 = "RRULE:FREQ=WEEKLY;INTERVAL=4",
    MONTHLY_1 = "RRULE:FREQ=MONTHLY;INTERVAL=1",
    WEEKLY_5 = "RRULE:FREQ=WEEKLY;INTERVAL=5",
    WEEKLY_6 = "RRULE:FREQ=WEEKLY;INTERVAL=6",
    WEEKLY_7 = "RRULE:FREQ=WEEKLY;INTERVAL=7",
    WEEKLY_8 = "RRULE:FREQ=WEEKLY;INTERVAL=8",
    MONTHLY_2 = "RRULE:FREQ=MONTHLY;INTERVAL=2",
    WEEKLY_9 = "RRULE:FREQ=WEEKLY;INTERVAL=9",
    WEEKLY_10 = "RRULE:FREQ=WEEKLY;INTERVAL=10",
    WEEKLY_11 = "RRULE:FREQ=WEEKLY;INTERVAL=11",
    WEEKLY_12 = "RRULE:FREQ=WEEKLY;INTERVAL=12",
    MONTHLY_3 = "RRULE:FREQ=MONTHLY;INTERVAL=3",
    MONTHLY_4 = "RRULE:FREQ=MONTHLY;INTERVAL=4",
    MONTHLY_6 = "RRULE:FREQ=MONTHLY;INTERVAL=6",
    YEARLY = "RRULE:FREQ=YEARLY;INTERVAL=1",
    MONTHLY_18 = "RRULE:FREQ=MONTHLY;INTERVAL=18",
    YEARLY_2 = "RRULE:FREQ=YEARLY;INTERVAL=2",
    YEARLY_3 = "RRULE:FREQ=YEARLY;INTERVAL=3"


class ContactMethod(str, Enum):
    call = "call"
    email = "email"
    text = "text"


class Customer(BaseModel):
    id: Optional[uuid.UUID]
    last_name: str
    first_name: str
    email: EmailStr
    phone: Optional[str]
    go_reminders_id: Optional[str] = Field(default=None)
    contact_method: Optional[ContactMethod] = Field(default="email")


class CreateCustomer(BaseModel):
    last_name: str
    first_name: str
    email: EmailStr
    phone: Optional[str]
    contact_method: Optional[ContactMethod] = Field(default="email")


class Artist(BaseModel):
    id: uuid.UUID
    name: str
    go_reminders_id: Optional[int] = Field(default=None)


class AppointmentRequest(BaseModel):
    id: uuid.UUID
    customer: uuid.UUID
    artist: Optional[uuid.UUID]
    length: Optional[int]
    idea: Optional[uuid.UUID]
    service: Optional[int]
    go_reminders_id: Optional[int]
    notes: Optional[str]    # extra info about item
    images: List[str]  # could be a link of a design/tattoo idea
    design: Optional[uuid.UUID]  # design ID if it's a design specific appointment
    first_date: datetime
    recurring_rule: Optional[RecurringRules]
    approved: Optional[bool] = Field(default=False)
    approved_date: Optional[datetime] = Field(default=None)
    second_date: datetime
    third_date: datetime
    placement: Optional[str]  # location of tattoo (body part)
    created_at: datetime
    updated_at: datetime


class CreateAppointmentRequest(BaseModel):
    customer_info: CreateCustomer
    customer: Optional[uuid.UUID] = Field(default=None)
    length: Optional[int] = Field(default=30)
    recurring_rule: Optional[RecurringRules] = Field(default=None)
    service: Optional[int] = Field(default=None)
    idea: Optional[uuid.UUID] = Field(default=None)
    artist: Optional[uuid.UUID] = Field(default=None)
    design: Optional[uuid.UUID] = Field(default=None)
    images: List[str] = Field(max_length=1)
    first_date: datetime
    second_date: datetime
    third_date: datetime
    notes: Optional[str] = Field(max_length=500, default=None)  # for general appointment
    placement: Optional[str] = Field(default=None)  # location for all appointment types


class UpdateAppointmentRequest(BaseModel):
    customer_info: Optional[CreateCustomer] = Field(default=None)
    length: Optional[int] = Field(default=None)
    approved: Optional[bool] = Field(default=None)
    go_reminders_id: Optional[int] = Field(default=None)
    artist: Optional[uuid.UUID] = Field(default=None)
    service: Optional[int] = Field(default=None)
    images: Optional[List[str]] = Field(default=None)
    recurring_rule: Optional[RecurringRules] = Field(default=None)
    notes: Optional[str] = Field(max_length=500, default=None)
    approved_date: Optional[datetime] = Field(default=None)


class ApproveAppointmentRequest(BaseModel):
    length:  int
    approved: bool
    customer_info: Optional[CreateCustomer] = Field(default=None)
    artist: Optional[uuid.UUID] = Field(default=None)
    service: Optional[int] = Field(default=None)
    images: Optional[List[str]] = Field(default=None)
    notes: Optional[str] = Field(max_length=500, default=None)
    recurring_rule: Optional[RecurringRules] = Field(default=None)
    approved_date: datetime = Field(default=datetime.now(tz=timezone.utc))


class AppointmentRequestRes(BaseModel):
    id: uuid.UUID
    customer: Optional[uuid.UUID]
    customer_info: Optional[Customer]
    artist_info: Optional[Artist]
    length: Optional[int]
    idea: Optional[uuid.UUID]
    go_reminders_id: Optional[int]
    recurring_rule: Optional[RecurringRules]
    service: Optional[int] = Field(default=None)  # from go reminders for general requests
    notes: Optional[str]    # extra info about item
    images: List[str]  # could be a link of a design/tattoo idea
    design: Optional[uuid.UUID]  # design ID if it's a design specific appointment
    first_date: datetime
    approved: Optional[bool] = Field(default=False)
    approved_date: Optional[datetime] = Field(default=None)
    second_date: datetime
    third_date: datetime
    placement: Optional[str]  # location of tattoo (body part)
    created_at: datetime
    updated_at: datetime


class AppointmentRequestFilter(BaseModel):
    approved: Optional[bool] = Field(default=None)
    approved_date: Optional[datetime] = Field(default=None)
    created_at: Optional[datetime] = Field(default=None)
    artist: Optional[uuid.UUID] = Field(default=None)
    customer: Optional[uuid.UUID] = Field(default=None)


class GoRemindersUpdateAppointment(BaseModel):
    staff: Optional[int] = Field(default=None)
    service: Optional[int] = Field(default=None)
    # customer: Optional[int] = Field(default=None)
    notes: Optional[str] = Field(default=None)
    length: Optional[int] = Field(default=None)
    recurring_rule: Optional[str] = Field(default=None)
    date: Optional[str] = Field(default=None)
