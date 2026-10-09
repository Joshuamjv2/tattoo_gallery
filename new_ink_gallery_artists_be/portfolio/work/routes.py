from .services import ArtistWorkService
from .schemas import ArtistWork, CreateArtistWork, UpdateArtistWork
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()


artist_service = ArtistWorkService()
router = APIRouter()


@router.post("", response_model=ArtistWork, description="Create Artist Work", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_artist_work(data: CreateArtistWork, session: AsyncSession = Depends(get_session)):
    res = await artist_service.create_work(work_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all artist works", response_model=List[ArtistWork])
async def get_artist_works(artist_id: str, session: AsyncSession = Depends(get_session)):
    res = await artist_service.get_all_work(artist_id=artist_id, session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=ArtistWork, description="Get all artist works")
async def get_single_artist_work(id: str, session: AsyncSession = Depends(get_session)):
    res = await artist_service.get_work(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Work with this ID does not exist")


@router.patch("/{id}", status_code=201, description="Update artist work", response_model=ArtistWork, dependencies=[Depends(access_token_bearer)])
async def update_artist_work(id: str, data: UpdateArtistWork, session: AsyncSession = Depends(get_session)):
    res = await artist_service.update_work(id=id, work_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Artist with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete work", dependencies=[Depends(access_token_bearer)])
async def remove_work(id: str, session: AsyncSession = Depends(get_session)):
    await artist_service.delete_work(id=id, session=session)
    return {}
