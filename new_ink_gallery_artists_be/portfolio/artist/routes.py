from .services import ArtistService
from .schemas import Artist, CreateArtist, UpdateArtist
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()

artist_service = ArtistService()
router = APIRouter()


@router.post("", response_model=Artist, description="Create Artist", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_artist(data: CreateArtist, session: AsyncSession = Depends(get_session)):
    data.instagram = data.instagram.strip("@")
    res = await artist_service.create_artist(artist_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all artists", response_model=List[Artist])
async def get_artists(session: AsyncSession = Depends(get_session)):
    res = await artist_service.get_all_artists(session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=Artist, description="Get all artist")
async def get_single_artist(id: str, session: AsyncSession = Depends(get_session)):
    res = await artist_service.get_artist(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Artist with this ID does not exist")


@router.patch("/{id}", status_code=200, description="Update artist", response_model=Artist, dependencies=[Depends(access_token_bearer)])
async def update_artist(id: str, data: UpdateArtist, session: AsyncSession = Depends(get_session)):
    res = await artist_service.update_artist(id=id, artist_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Artist with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete artist", dependencies=[Depends(access_token_bearer)])
async def remove_artist(id: str, session: AsyncSession = Depends(get_session)):
    await artist_service.delete_artist(id=id, session=session)
    return {}
