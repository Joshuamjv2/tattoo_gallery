from .services import TattooIdeaService
from .schemas import TattooIdea, CreateTattooIdea, UpdateTattooIdea
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()


service = TattooIdeaService()
router = APIRouter()


@router.post("", response_model=TattooIdea, description="Create Tattoo Idea", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_idea(data: CreateTattooIdea, session: AsyncSession = Depends(get_session)):
    res = await service.create_idea(data, session=session)
    return res


@router.get("", status_code=200, description="Get all tattoo ideas", response_model=List[TattooIdea])
async def get_ideas(session: AsyncSession = Depends(get_session)):
    res = await service.get_all_ideas(session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=TattooIdea, description="Get single tattoo idea")
async def get_single_idea(id: str, session: AsyncSession = Depends(get_session)):
    res = await service.get_idea(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Tattoo idea with this ID does not exist")


@router.patch("/{id}", status_code=201, description="Update tattoo idea", response_model=TattooIdea, dependencies=[Depends(access_token_bearer)])
async def update_tattoo_idea(id: str, data: UpdateTattooIdea, session: AsyncSession = Depends(get_session)):
    res = await service.update_idea(id=id, data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Idea with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete tattoo idea", dependencies=[Depends(access_token_bearer)])
async def remove_idea(id: str, session: AsyncSession = Depends(get_session)):
    await service.delete_idea(id=id, session=session)
    return {}
