from enum import Enum
from pydantic import BaseModel
from typing import List


class ImageType(str, Enum):
    design = "design"
    idea = "idea"
    artist_profile = "artist"
    artist_work = "artist_work"
    appointment_requests = "appointment_request"


class Image(BaseModel):
    images: List[str]
    entity: str


class DeleteImages(BaseModel):
    images: List[str]
