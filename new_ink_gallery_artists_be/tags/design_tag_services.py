from sqlmodel.ext.asyncio.session import AsyncSession
from .models import DesignTag
from sqlmodel import select, desc
from .schemas import CreateDesignTag, UpdateDesignTag


class DesignTagService:
    async def get_all_design_tags(self, design_id: str, session: AsyncSession):
        statement = select(DesignTag).where(DesignTag.design_id == design_id).order_by(desc(DesignTag.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_design_tag(self, design_id: str, tag_id: str, session: AsyncSession):
        statement = select(DesignTag).where((DesignTag.design_id == design_id) & (DesignTag.tag_id == tag_id))
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_design_tag(self, design_tag_data: CreateDesignTag, session: AsyncSession):
        design_tag_dict = design_tag_data.model_dump()
        design_tag_dict = DesignTag(**design_tag_dict)
        session.add(design_tag_dict)
        await session.commit()
        await session.refresh(design_tag_dict)
        return design_tag_dict

    async def update_design_tag(self, design_id: str, tag_id: str, design_tag_data: UpdateDesignTag, session: AsyncSession):
        design_tag_to_update = await self.get_design_tag(tag_id=tag_id, design_id=design_id, session=session)
        if design_tag_to_update:
            design_tag_update_dict = design_tag_data.model_dump(exclude_none=True)

            for k, v in design_tag_update_dict.items():
                setattr(design_tag_to_update, k, v)
            await session.commit()
            await session.refresh(design_tag_to_update)
            return design_tag_to_update
        return None

    async def delete_design_tag(self, tag_id: str, design_id: str, session: AsyncSession):
        design_tag_to_delete = await self.get_design_tag(tag_id=tag_id, design_id=design_id, session=session)

        if design_tag_to_delete:
            await session.delete(design_tag_to_delete)
            await session.commit()
        return None
