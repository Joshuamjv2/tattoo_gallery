from .tattoo_idea_tag_services import TattooIdeaTagService
from .schemas import CreateTattooIdeaTag, TattooIdeaTag, UpdateTattooIdeaTag
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()

idea_tag_service = TattooIdeaTagService()
router = APIRouter()


@router.post("", response_model=TattooIdeaTag, description="Create idea tag", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_idea_tag(data: CreateTattooIdeaTag, session: AsyncSession = Depends(get_session)):
    res = await idea_tag_service.create_idea_tag(data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all idea tags", response_model=List[TattooIdeaTag])
async def get_idea_tags(idea_id, session: AsyncSession = Depends(get_session)):
    res = await idea_tag_service.get_all_idea_tags(session=session, idea_id=idea_id)
    if res:
        return res
    return []


@router.get("", status_code=200, response_model=TattooIdeaTag, description="Get all tattoo idea tags")
async def get_single_idea_tag(tag_id: str, idea_id: str, session: AsyncSession = Depends(get_session)):
    res = await idea_tag_service.get_idea_tag(idea_id=idea_id, tag_id=tag_id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Tattoo idea tag with this ID does not exist")


@router.patch("", status_code=201, description="Update idea Tag", response_model=TattooIdeaTag, dependencies=[Depends(access_token_bearer)])
async def update_idea_tag(idea_id: str, tag_id: str, data: UpdateTattooIdeaTag, session: AsyncSession = Depends(get_session)):
    res = await idea_tag_service.update_idea_tag(tag_id=tag_id, idea_id=idea_id, tag_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Idea tag with this ID does not exist!")


@router.delete("", status_code=204, description="Delete idea tag", dependencies=[Depends(access_token_bearer)])
async def remove_idea_tag(tag_id: str, idea_id: str, session: AsyncSession = Depends(get_session)):
    await idea_tag_service.delete_idea_tag(tag_id=tag_id, idea_id=idea_id, session=session)
    return {}
