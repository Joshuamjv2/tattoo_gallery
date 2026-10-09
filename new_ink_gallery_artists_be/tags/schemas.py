from datetime import datetime
from pydantic import BaseModel
import uuid
from typing import Optional


class ArtistWork(BaseModel):
    id: uuid.UUID
    artist: uuid.UUID
    image: str
    created_at: datetime
    updated_at: datetime


class Tag(BaseModel):
    id: uuid.UUID
    tag: str
    created_at: datetime
    updated_at: datetime


class CreateDesignTag(BaseModel):
    tag_id: uuid.UUID
    design_id: uuid.UUID


class UpdateDesignTag(BaseModel):
    tag_id: Optional[uuid.UUID]
    design_id: Optional[uuid.UUID]


class UpdatePortfolioTag(BaseModel):
    tag_id: Optional[uuid.UUID]
    portfolio_id: Optional[uuid.UUID]


class CreatePortfolioTag(BaseModel):
    tag_id: uuid.UUID
    portfolio_id: uuid.UUID


class DesignTag(BaseModel):
    tag_id: uuid.UUID
    design_id: uuid.UUID


class PortfolioTag(BaseModel):
    tag_id: uuid.UUID
    portfolio_id: uuid.UUID


class CreateTag(BaseModel):
    tag: str


class UpdateTag(BaseModel):
    tag: Optional[str]


class TattooIdeaTag(BaseModel):
    tag_id: uuid.UUID
    tattoo_idea_id: uuid.UUID


class CreateTattooIdeaTag(BaseModel):
    tag_id: uuid.UUID
    tattoo_idea_id: uuid.UUID


class UpdateTattooIdeaTag(BaseModel):
    tag_id: Optional[uuid.UUID]
    portfolio_id: Optional[uuid.UUID]
