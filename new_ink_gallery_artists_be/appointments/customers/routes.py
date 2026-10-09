from .services import CustomerService
from .schemas import Customer, CreateCustomer, UpdateCustomer
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()


service = CustomerService()
router = APIRouter()


@router.post("", response_model=Customer, description="Create customer", status_code=201, dependencies=[Depends(access_token_bearer)])
async def create_customer(data: CreateCustomer, session: AsyncSession = Depends(get_session)):
    res = await service.create_customer(data, session=session)
    return res


@router.get("", status_code=200, description="Get all customers", response_model=List[Customer],  dependencies=[Depends(access_token_bearer)])
async def get_customers(session: AsyncSession = Depends(get_session)):
    res = await service.get_all_customers(session=session)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=Customer, description="Get single customer",  dependencies=[Depends(access_token_bearer)])
async def get_single_customer(id: str, session: AsyncSession = Depends(get_session)):
    res = await service.get_customer(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Customer with this ID does not exist")


@router.patch("/{id}", status_code=201, description="Update customer", response_model=Customer, dependencies=[Depends(access_token_bearer)])
async def update_customer(id: str, data: UpdateCustomer, session: AsyncSession = Depends(get_session)):
    res = await service.update_customer(id=id, data=data, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Customer with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete customer", dependencies=[Depends(access_token_bearer)])
async def remove_customer(id: str, session: AsyncSession = Depends(get_session)):
    await service.delete_customer(id=id, session=session)
    return {}
