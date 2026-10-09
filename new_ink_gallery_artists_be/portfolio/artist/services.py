# get all artists
# get single artist (comes with their work)
# add artist (protected route)
# delete design (protected route)
# update design (protected route)
from sqlmodel.ext.asyncio.session import AsyncSession
from .models import Artist
from sqlmodel import select, desc
from .schemas import CreateArtist, UpdateArtist


class ArtistService:
    async def get_all_artists(self, session: AsyncSession):
        statement = select(Artist).order_by(desc(Artist.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_artist(self, id: str, session: AsyncSession):
        statement = select(Artist).where(Artist.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def check_if_artist_exists(self, id: str, session: AsyncSession):
        statement = select(Artist).where(Artist.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_artist(self, artist_data: CreateArtist, session: AsyncSession):
        artist_dict = artist_data.model_dump()
        new_artist = Artist(**artist_dict)
        session.add(new_artist)
        await session.commit()
        await session.refresh(new_artist)
        return new_artist

    async def update_artist(self, id: str, artist_data: UpdateArtist, session: AsyncSession):
        artist_to_update = await self.get_artist(id=id, session=session)
        if artist_to_update:
            artist_update_dict = artist_data.model_dump(exclude_none=True)

            for k, v in artist_update_dict.items():
                setattr(artist_to_update, k, v)
            await session.commit()
            await session.refresh(artist_to_update)
            return artist_to_update
        return None

    async def delete_artist(self, id: str, session: AsyncSession):
        artist_to_delete = await self.get_artist(id=id, session=session)

        if artist_to_delete:
            await session.delete(artist_to_delete)
            await session.commit()
        return None
