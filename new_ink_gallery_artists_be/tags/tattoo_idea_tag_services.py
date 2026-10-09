from sqlmodel.ext.asyncio.session import AsyncSession
from .models import TattooIdeaTag
from sqlmodel import select, desc
from .schemas import CreateTattooIdeaTag, UpdateTattooIdeaTag


class TattooIdeaTagService:
    async def get_all_idea_tags(self, idea_id: str, session: AsyncSession):
        statement = select(TattooIdeaTag).where(TattooIdeaTag.tattoo_idea_id == idea_id).order_by(desc(TattooIdeaTag.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_idea_tag(self, idea_id: str, tag_id: str, session: AsyncSession):
        statement = select(TattooIdeaTag).where((TattooIdeaTag.tattoo_idea_id == idea_id) & (TattooIdeaTag.tag_id == tag_id))
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_idea_tag(self, data: CreateTattooIdeaTag, session: AsyncSession):
        idea_tag_dict = data.model_dump()
        idea_tag_dict = TattooIdeaTag(**idea_tag_dict)
        session.add(idea_tag_dict)
        await session.commit()
        await session.refresh(idea_tag_dict)
        return idea_tag_dict

    async def update_idea_tag(self, idea_id: str, tag_id: str, data: UpdateTattooIdeaTag, session: AsyncSession):
        idea_tag_to_update = await self.get_idea_tag(tag_id=tag_id, idea_id=idea_id, session=session)
        if idea_tag_to_update:
            idea_tag_update_dict = data.model_dump(exclude_none=True)

            for k, v in idea_tag_update_dict.items():
                setattr(idea_tag_to_update, k, v)
            await session.commit()
            await session.refresh(idea_tag_to_update)
            return idea_tag_to_update
        return None

    async def delete_idea_tag(self, tag_id: str, idea_id: str, session: AsyncSession):
        idea_tag_to_delete = await self.get_idea_tag(tag_id=tag_id, idea_id=idea_id, session=session)

        if idea_tag_to_delete:
            await session.delete(idea_tag_to_delete)
            await session.commit()
        return None
