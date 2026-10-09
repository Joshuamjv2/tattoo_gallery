from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from typing import Optional


class User(BaseModel):
    id: uuid.UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class BaseUser(BaseModel):
    id: uuid.UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CreateUser(BaseModel):
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(max_length=50)
    password: str = Field(min_length=8)
    is_verified: bool = True
    is_active: bool = True


class UpdateUser(BaseModel):
    first_name: str = Field(max_length=50, default=None)
    last_name: str = Field(max_length=50, default=None)


class UserLogin(BaseModel):
    email: str
    password: str


class PasswordResetRequest(BaseModel):
    email: str
    redirect_url: str


class ResetPassword(BaseModel):
    password: str
    confirm_password: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8)
