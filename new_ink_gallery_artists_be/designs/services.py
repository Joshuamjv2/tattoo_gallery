from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, desc, delete
from .models import Design
from tags.models import DesignTag
from .schemas import CreateDesign, UpdateDesign


class DesignService:
    async def get_all_designs(self, session: AsyncSession):
        statement = select(Design).order_by(Design.price).order_by(desc(Design.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_design(self, id: str, session: AsyncSession):
        statement = select(Design).where(Design.id == id)
        result = await session.exec(statement)
        return result.first()

    async def check_if_design_exists(self, id: str, session: AsyncSession):
        return await self.get_design(id, session)

    async def create_design(self, design_data: CreateDesign, session: AsyncSession):
        design_dict = design_data.model_dump(exclude={"tags"}, exclude_none=True)
        new_design = Design(**design_dict)
        session.add(new_design)
        await session.flush()

        if design_data.tags:
            design_tags = [
                DesignTag(design_id=new_design.id, tag_id=tag_id)
                for tag_id in design_data.tags
            ]
            session.add_all(design_tags)

        await session.commit()
        await session.refresh(new_design)
        return new_design

    async def update_design(self, id: str, design_data: UpdateDesign, session: AsyncSession):
        design_to_update = await self.get_design(id, session)
        if not design_to_update:
            return None

        design_update_dict = design_data.model_dump(exclude={"tags"}, exclude_none=True)
        for key, value in design_update_dict.items():
            setattr(design_to_update, key, value)

        await session.flush()

        if design_data.tags is not None:
            await session.exec(
                delete(DesignTag).where(DesignTag.design_id == design_to_update.id)
            )

            if design_data.tags:
                session.add_all(
                    DesignTag(design_id=design_to_update.id, tag_id=tag_id)
                    for tag_id in design_data.tags
                )

        await session.commit()
        await session.refresh(design_to_update)
        return design_to_update

    async def delete_design(self, id: str, session: AsyncSession):
        design_to_delete = await self.get_design(id, session)
        if design_to_delete:
            await session.delete(design_to_delete)
            await session.commit()
        return None
