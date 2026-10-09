from typing import Optional
from pydantic import Field, BaseModel, field_validator
import uuid
from datetime import datetime
from typing import List


class Tag(BaseModel):
    id: uuid.UUID
    tag: str
    created_at: datetime
    updated_at: datetime


class Design(BaseModel):
    id: uuid.UUID
    name: Optional[str]
    price: Optional[float]
    ready_to_book: Optional[bool]
    precise_length: Optional[int]
    display_length: Optional[str]
    precise_size: Optional[str]
    display_size: Optional[str]
    ai_generated: Optional[bool]
    description: Optional[str]
    tags: Optional[List[Tag]]
    created_at: datetime
    images: Optional[List[str]]
    updated_at: datetime


class CreateDesign(BaseModel):
    name: Optional[str] = Field(max_length=50)
    description: Optional[str] = Field(max_length=500)
    price: Optional[float] = Field(default=None)
    ready_to_book: bool = Field(default=True)
    precise_length: Optional[int] = Field(default=90)
    display_length: Optional[str] = Field(default=None, max_length=100)
    precise_size: Optional[str] = Field(default=None, max_length=5)
    display_size: Optional[str] = Field(default=None, max_length=100)
    tags: Optional[List[uuid.UUID]] = Field(default=[])
    ai_generated: bool = Field(default=False)
    images: List[str] = Field(max_length=5, default=[])

    @field_validator('price')
    def round_price(cls, v):
        if v is not None:
            return round(float(v), 2)
        return v


class UpdateDesign(BaseModel):
    name: Optional[str] = Field(max_length=50, default=None)
    description: Optional[str] = Field(max_length=500, default=None)
    images: List[str] = Field(max_length=5, default=None)
    tags: List[uuid.UUID] = Field(default=None)
    precise_length: Optional[int] = Field(default=None)
    display_length: Optional[str] = Field(default=None)
    precise_size: Optional[str] = Field(default=None, max_length=5)
    display_size: Optional[str] = Field(default=None, max_length=100)
    price: Optional[float] = Field(default=None)
    ready_to_book: Optional[bool] = Field(default=None)
    ai_generated: Optional[bool] = Field(default=None)

    @field_validator('price')
    def round_price(cls, v):
        if v is not None:
            return round(float(v), 2)
        return v
