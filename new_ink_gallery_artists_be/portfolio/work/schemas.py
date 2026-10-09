from typing import Optional
import uuid
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class Tag(BaseModel):
    id: uuid.UUID
    tag: str
    created_at: datetime
    updated_at: datetime


class ArtistWork(BaseModel):
    id: uuid.UUID
    artist: uuid.UUID
    image: Optional[str] = Field(default=None)
    tags: List[Tag]
    created_at: datetime
    updated_at: datetime


class CreateArtistWork(BaseModel):
    artist: uuid.UUID
    tags: Optional[List[uuid.UUID]] = Field(default=[])


class UpdateArtistWork(BaseModel):
    artist: Optional[uuid.UUID] = Field(default=None)
    image: Optional[str] = Field(default=None)
    tags: List[uuid.UUID] = Field(default=None)
