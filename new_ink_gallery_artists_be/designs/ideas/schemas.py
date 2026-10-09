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


class TattooIdea(BaseModel):
    id: uuid.UUID
    image: Optional[str] = Field(default=None)
    tags: List[Tag]
    created_at: datetime
    updated_at: datetime


class CreateTattooIdea(BaseModel):
    tags: Optional[List[uuid.UUID]] = Field(default=[])


class UpdateTattooIdea(BaseModel):
    image: Optional[str] = Field(default=None)
    tags: List[uuid.UUID] = Field(default=None)
