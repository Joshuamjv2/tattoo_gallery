from sqlmodel.ext.asyncio.session import AsyncSession
from .models import PortfolioTag
from sqlmodel import select, desc
from .schemas import CreatePortfolioTag, UpdatePortfolioTag


class PortfolioTagService:
    async def get_all_portfolio_tags(self, portfolio_id: str, session: AsyncSession):
        statement = select(PortfolioTag).where(PortfolioTag.portfolio_id == portfolio_id).order_by(desc(PortfolioTag.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_portfolio_tag(self, portfolio_id: str, tag_id: str, session: AsyncSession):
        statement = select(PortfolioTag).where((PortfolioTag.portfolio_id == portfolio_id) & (PortfolioTag.tag_id == tag_id))
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_portfolio_tag(self, portfolio_tag_data: CreatePortfolioTag, session: AsyncSession):
        portfolio_tag_dict = portfolio_tag_data.model_dump()
        portfolio_tag_dict = PortfolioTag(**portfolio_tag_dict)
        session.add(portfolio_tag_dict)
        await session.commit()
        await session.refresh(portfolio_tag_dict)
        return portfolio_tag_dict

    async def update_portfolio_tag(self, portfolio_id: str, tag_id: str, portfolio_tag_data: UpdatePortfolioTag, session: AsyncSession):
        portfolio_tag_to_update = await self.get_portfolio_tag(tag_id=tag_id, portfolio_id=portfolio_id, session=session)
        if portfolio_tag_to_update:
            portfolio_tag_update_dict = portfolio_tag_data.model_dump(exclude_none=True)

            for k, v in portfolio_tag_update_dict.items():
                setattr(portfolio_tag_to_update, k, v)
            await session.commit()
            await session.refresh(portfolio_tag_to_update)
            return portfolio_tag_to_update
        return None

    async def delete_portfolio_tag(self, tag_id: str, portfolio_id: str, session: AsyncSession):
        portfolio_tag_to_delete = await self.get_portfolio_tag(tag_id=tag_id, portfolio_id=portfolio_id, session=session)

        if portfolio_tag_to_delete:
            await session.delete(portfolio_tag_to_delete)
            await session.commit()
        return None
