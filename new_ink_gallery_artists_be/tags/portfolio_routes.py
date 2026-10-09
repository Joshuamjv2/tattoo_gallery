from .portfolio_tag_services import PortfolioTagService
from .schemas import CreatePortfolioTag, UpdatePortfolioTag, PortfolioTag
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()

portfolio_tag_service = PortfolioTagService()
router = APIRouter()


@router.post("", response_model=PortfolioTag, description="Create portfolio tag", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_portfolio_tag(data: CreatePortfolioTag, session: AsyncSession = Depends(get_session)):
    res = await portfolio_tag_service.create_portfolio_tag(tag_data=data, session=session)
    return res


@router.get("", status_code=200, description="Get all portfolio tags", response_model=List[PortfolioTag])
async def get_portfolio_tags(portfolio_id, session: AsyncSession = Depends(get_session)):
    res = await portfolio_tag_service.get_all_portfolio_tags(session=session, portfolio_id=portfolio_id)
    if res:
        return res
    return []


@router.get("", status_code=200, response_model=PortfolioTag, description="Get all portfolio tags")
async def get_single_portfolio_tag(tag_id: str, portfolio_id: str, session: AsyncSession = Depends(get_session)):
    res = await portfolio_tag_service.get_portfolio_tag(portfolio_id=portfolio_id, tag_id=tag_id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Portfolio tag with this ID does not exist")


@router.patch("", status_code=201, description="Update portfolio Tag", response_model=PortfolioTag, dependencies=[Depends(access_token_bearer)])
async def update_portfolio_tag(portfolio_id: str, tag_id: str, data: UpdatePortfolioTag, session: AsyncSession = Depends(get_session)):
    res = await portfolio_tag_service.update_portfolio_tag(tag_id=tag_id, portfolio_id=portfolio_id, tag_data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Portfolio tag with this ID does not exist!")


@router.delete("", status_code=204, description="Delete portfolio tag", dependencies=[Depends(access_token_bearer)])
async def remove_portfolio_tag(tag_id: str, portfolio_id: str, session: AsyncSession = Depends(get_session)):
    await portfolio_tag_service.delete_portfolio_tag(tag_id=tag_id, portfolio_id=portfolio_id, session=session)
    return {}
