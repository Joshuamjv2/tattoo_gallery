from sqlmodel.ext.asyncio.session import AsyncSession
from .models import ArtistWork
from sqlmodel import select, desc, delete
from .schemas import CreateArtistWork, UpdateArtistWork
from tags.models import PortfolioTag


class ArtistWorkService:
    async def get_all_work(self, artist_id: str, session: AsyncSession):
        statement = select(ArtistWork).where(ArtistWork.artist == artist_id).order_by(desc(ArtistWork.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_work(self, id: str, session: AsyncSession):
        statement = select(ArtistWork).where(ArtistWork.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_work(self, work_data: CreateArtistWork, session: AsyncSession):
        work_dict = work_data.model_dump(exclude={"tags"}, exclude_none=True)
        new_work = ArtistWork(**work_dict)
        session.add(new_work)
        await session.flush()

        if work_data.tags:
            work_tags = [
                PortfolioTag(portfolio_id=new_work.id, tag_id=tag_id)
                for tag_id in work_data.tags
            ]
            session.add_all(work_tags)
        await session.commit()
        await session.refresh(new_work)
        return new_work

    async def update_work(self, id: str, work_data: UpdateArtistWork, session: AsyncSession):
        work_to_update = await self.get_work(id=id, session=session)
        if work_to_update:
            work_update_dict = work_data.model_dump(exclude={"tags"}, exclude_none=True)

            for k, v in work_update_dict.items():
                setattr(work_to_update, k, v)
            await session.flush()

            if work_data.tags is not None:
                await session.exec(
                    delete(PortfolioTag).where(PortfolioTag.portfolio_id == work_to_update.id)
                )

                if work_data.tags:
                    session.add_all(
                        PortfolioTag(portfolio_id=work_to_update.id, tag_id=tag_id)
                        for tag_id in work_data.tags
                    )
            await session.commit()
            await session.refresh(work_to_update)
            return work_to_update
        return None

    async def delete_work(self, id: str, session: AsyncSession):
        work_to_delete = await self.get_work(id=id, session=session)

        if work_to_delete:
            await session.delete(work_to_delete)
            await session.commit()
        return None
