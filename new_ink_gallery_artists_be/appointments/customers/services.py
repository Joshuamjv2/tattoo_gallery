from sqlmodel.ext.asyncio.session import AsyncSession
from .models import Customer
from sqlmodel import select, desc, delete
from .schemas import CreateCustomer, UpdateCustomer
from appointments.goreminders.helpers import create_customer as create_go_reminders_customer, customer_exists, update_go_reminders_customer, delete_customer as delete_go_reminders_customer


class CustomerService:
    async def get_all_customers(self, session: AsyncSession):
        statement = select(Customer).order_by(desc(Customer.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_customer(self, id: str, session: AsyncSession):
        statement = select(Customer).where(Customer.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def get_customer_by_email(self, email: str, session: AsyncSession):
        statement = select(Customer).where(Customer.email == email)
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_customer(self, data: CreateCustomer, session: AsyncSession):
        # check go reminders and if they don't exist there, create one and use the id for go-reminders ID field
        see_customer_exists = customer_exists(data.email)
        go_reminders_id = None
        use_sms = {
                "email": 0,
                "text": 1,
                "call": 3
            }
        if len(see_customer_exists) < 1:
            go_data = {"first_name": data.first_name, "last_name": data.last_name, "email": data.email, "phone": data.phone, "use_sms": use_sms[data.contact_method]}
            new_customer = create_go_reminders_customer(go_data)
            go_reminders_id = str(new_customer["id"])
        else:
            go_reminders_id = str(see_customer_exists[0]["id"])

        data.go_reminders_id = go_reminders_id

        # check if customer with email exists locally and if yes, just update new info
        customer_saved_locally = await self.get_customer_by_email(email=data.email, session=session)
        if customer_saved_locally:
            new_info = UpdateCustomer(first_name=data.first_name, last_name=data.last_name, phone=data.phone or None, contact_method=data.contact_method or None)
            res = await self.update_customer(id=customer_saved_locally.id, data=new_info, session=session)
            return res

        # if they don,t, go ahead and create
        data_dict = data.model_dump(exclude_none=True)
        new_customer = Customer(**data_dict)
        session.add(new_customer)

        await session.commit()
        await session.refresh(new_customer)
        return new_customer

    async def update_customer(self, id: str, data: UpdateCustomer, session: AsyncSession):
        contact_method = data.contact_method
        data_to_update = await self.get_customer(id=id, session=session)
        if data_to_update:
            data_update_dict = data.model_dump(exclude_none=True)
            use_sms = {
                "email": 0,
                "text": 1,
                "call": 3
            }
            go_reminders_update_dict = data_update_dict.copy()
            if contact_method:
                go_reminders_update_dict["use_sms"] = use_sms[contact_method]
                go_reminders_update_dict.pop("contact_method")
            update_go_reminders_customer(go_reminders_update_dict, data_to_update.go_reminders_id)

            for k, v in data_update_dict.items():
                setattr(data_to_update, k, v)
            await session.commit()
            await session.refresh(data_to_update)
            return data_to_update
        return None

    async def delete_customer(self, id: str, session: AsyncSession):
        data_to_delete = await self.get_customer(id=id, session=session)

        if data_to_delete:
            await session.delete(data_to_delete)
            await session.commit()
            go_reminders_id = data_to_delete.go_reminders_id
            delete_go_reminders_customer(id=go_reminders_id)

        return None
