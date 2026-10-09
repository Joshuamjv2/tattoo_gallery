from sqlmodel.ext.asyncio.session import AsyncSession
from .models import TattooIdea
from sqlmodel import select, desc, delete
from .schemas import CreateTattooIdea, UpdateTattooIdea
from tags.models import TattooIdeaTag


class TattooIdeaService:
    async def get_all_ideas(self, session: AsyncSession):
        statement = select(TattooIdea).order_by(desc(TattooIdea.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_idea(self, id: str, session: AsyncSession):
        statement = select(TattooIdea).where(TattooIdea.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_idea(self, data: CreateTattooIdea, session: AsyncSession):
        data_dict = data.model_dump(exclude={"tags"}, exclude_none=True)
        new_idea = TattooIdea(**data_dict)
        session.add(new_idea)
        await session.flush()

        if data.tags:
            idea_tags = [
                TattooIdeaTag(tattoo_idea_id=new_idea.id, tag_id=tag_id)
                for tag_id in data.tags
            ]
            print("\n\n\n\n", idea_tags, "new tags", "\n\n\n\n")
            session.add_all(idea_tags)
        await session.commit()
        await session.refresh(new_idea)
        return new_idea

    async def update_idea(self, id: str, data: UpdateTattooIdea, session: AsyncSession):
        data_to_update = await self.get_idea(id=id, session=session)
        if data_to_update:
            data_update_dict = data.model_dump(exclude={"tags"}, exclude_none=True)

            for k, v in data_update_dict.items():
                setattr(data_to_update, k, v)
            await session.flush()

            if data.tags is not None:
                await session.exec(
                    delete(TattooIdeaTag).where(TattooIdeaTag.tattoo_idea_id == data_to_update.id)
                )

                if data.tags:
                    session.add_all(
                        TattooIdeaTag(tattoo_idea_id=data_to_update.id, tag_id=tag_id)
                        for tag_id in data.tags
                    )
            await session.commit()
            await session.refresh(data_to_update)
            return data_to_update
        return None

    async def delete_idea(self, id: str, session: AsyncSession):
        data_to_delete = await self.get_idea(id=id, session=session)

        if data_to_delete:
            await session.delete(data_to_delete)
            await session.commit()
        return None
