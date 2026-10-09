from datetime import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


class Tag(BaseModel):
    id: uuid.UUID
    tag: str
    created_at: datetime
    updated_at: datetime


class ArtistWork(BaseModel):
    id: uuid.UUID
    artist: uuid.UUID
    tags: List[Tag]
    created_at: datetime
    updated_at: datetime


class Artist(BaseModel):
    id: uuid.UUID
    instagram: str
    name: str
    email: Optional[str]
    style: Optional[str]
    description: Optional[str]
    go_reminders_id: Optional[int]
    work: List[ArtistWork]
    image: Optional[str]
    created_at: datetime
    updated_at: datetime


class CreateArtist(BaseModel):
    instagram: Optional[str]
    name: str
    image: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    style: Optional[str] = Field(max_length=50, default=None)
    description: str = Field(min_length=50)
    go_reminders_id: int


class UpdateArtist(BaseModel):
    instagram: Optional[str] = Field(default=None)
    name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    image: Optional[str] = Field(default=None)
    go_reminders_id: Optional[int] = Field(default=None)
