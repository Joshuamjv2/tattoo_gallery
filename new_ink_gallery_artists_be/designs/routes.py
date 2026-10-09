from .services import DesignService
from .schemas import Design, CreateDesign, UpdateDesign
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()


design_service = DesignService()
router = APIRouter()


@router.post("", response_model=Design, description="Create Design", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_design(data: CreateDesign, session: AsyncSession = Depends(get_session)):
    res = await design_service.create_design(design_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all designs", response_model=List[Design])
async def get_designs(session: AsyncSession = Depends(get_session)):
    res = await design_service.get_all_designs(session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=Design, description="Get all designs")
async def get_single_design(id: str, session: AsyncSession = Depends(get_session)):
    res = await design_service.get_design(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Design with this ID does not exist")


@router.patch("/{id}", status_code=201, description="Update Design", response_model=Design, dependencies=[Depends(access_token_bearer)])
async def update_design(id: str, data: UpdateDesign, session: AsyncSession = Depends(get_session)):
    res = await design_service.update_design(id=id, design_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Design with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete Design", dependencies=[Depends(access_token_bearer)])
async def remove_design(id: str, session: AsyncSession = Depends(get_session)):
    await design_service.delete_design(id=id, session=session)
    return {}
