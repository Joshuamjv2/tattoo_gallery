from .services import TagService
from .schemas import Tag, CreateTag, UpdateTag
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer


tag_service = TagService()
router = APIRouter()


@router.post("", response_model=Tag, description="Create Tag", status_code=201, dependencies=[Depends(AccessTokenBearer())])
async def create_tag(data: CreateTag, session: AsyncSession = Depends(get_session)):
    res = await tag_service.create_tag(tag_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all tags", response_model=List[Tag])
async def get_tags(session: AsyncSession = Depends(get_session)):
    res = await tag_service.get_all_tags(session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=Tag, description="Get single tag")
async def get_single_tag(id: str, session: AsyncSession = Depends(get_session)):
    res = await tag_service.get_tag(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Tag with this ID does not exist")


@router.patch("/{id}", status_code=201, description="Update Tag", response_model=Tag, dependencies=[Depends(AccessTokenBearer())])
async def update_tag(id: str, data: UpdateTag, session: AsyncSession = Depends(get_session)):
    res = await tag_service.update_tag(id=id, tag_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Tag with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete Tag", dependencies=[Depends(AccessTokenBearer())])
async def remove_tag(id: str, session: AsyncSession = Depends(get_session)):
    await tag_service.delete_tag(id=id, session=session)
    return {}
