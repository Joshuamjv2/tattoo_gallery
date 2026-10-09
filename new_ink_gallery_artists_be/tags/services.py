# tags class
# get all tags
# get single tag
# add tag (protected)
# delete tag (protected)
# update tag (protected)

from sqlmodel.ext.asyncio.session import AsyncSession
from .models import Tag
from sqlmodel import select, desc
from .schemas import CreateTag, UpdateTag


class TagService:
    async def get_all_tags(self, session: AsyncSession):
        statement = select(Tag).order_by(desc(Tag.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_tag(self, id: str, session: AsyncSession):
        statement = select(Tag).where(Tag.id == id)
        result = await session.exec(statement)
        print("\n"*5, result, "\n"*5)
        return result.first() if result else None

    async def create_tag(self, tag_data: CreateTag, session: AsyncSession):
        tag_dict = tag_data.model_dump()
        tag_dict = Tag(**tag_dict)
        session.add(tag_dict)
        await session.commit()
        await session.refresh(tag_dict)
        return tag_dict

    async def update_tag(self, id: str, tag_data: UpdateTag, session: AsyncSession):
        tag_to_update = await self.get_tag(id=id, session=session)
        if tag_to_update:
            tag_update_dict = tag_data.model_dump(exclude_none=True)

            for k, v in tag_update_dict.items():
                setattr(tag_to_update, k, v)
            await session.commit()
            await session.refresh(tag_to_update)
            return tag_to_update
        return None

    async def delete_tag(self, id: str, session: AsyncSession):
        tag_to_delete = await self.get_tag(id=id, session=session)

        if tag_to_delete:
            await session.delete(tag_to_delete)
            await session.commit()
        return None
