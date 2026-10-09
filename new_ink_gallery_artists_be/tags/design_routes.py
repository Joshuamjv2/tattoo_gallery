from .design_tag_services import DesignTagService
from .schemas import CreateDesignTag, UpdateDesignTag, DesignTag
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer


access_token_bearer = AccessTokenBearer()
design_tag_service = DesignTagService()
router = APIRouter()


@router.post("", response_model=DesignTag, description="Create design tag", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_design_tag(data: CreateDesignTag, session: AsyncSession = Depends(get_session)):
    res = await design_tag_service.create_design_tag(tag_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all design tags", response_model=List[DesignTag])
async def get_design_tags(design_id, session: AsyncSession = Depends(get_session)):
    res = await design_tag_service.get_all_design_tags(session=session, design_id=design_id)
    if res:
        return res
    return []


@router.get("", status_code=200, response_model=DesignTag, description="Get all design tags")
async def get_single_tag(tag_id: str, design_id: str, session: AsyncSession = Depends(get_session)):
    res = await design_tag_service.get_design_tag(design_id=design_id, tag_id=tag_id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Design tag with this ID does not exist")


@router.patch("", status_code=201, description="Update design Tag", response_model=DesignTag, dependencies=[Depends(access_token_bearer)])
async def update_design_tag(design_id: str, tag_id: str, data: UpdateDesignTag, session: AsyncSession = Depends(get_session)):
    res = await design_tag_service.update_design_tag(tag_id=tag_id, design_id=design_id, tag_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Design tag with this ID does not exist!")


@router.delete("", status_code=204, description="Delete design tag", dependencies=[Depends(access_token_bearer)])
async def remove_design_tag(tag_id: str, design_id: str, session: AsyncSession = Depends(get_session)):
    await design_tag_service.delete_design_tag(tag_id=tag_id, design_id=design_id, session=session)
    return {}
