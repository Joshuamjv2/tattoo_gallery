from sqlmodel.ext.asyncio.session import AsyncSession
from .models import AppointmentRequest
from sqlmodel import select, desc
from .schemas import CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentRequestFilter
from .customers.services import CustomerService
from .customers.schemas import CreateCustomer
from .goreminders.helpers import delete_appointment

customer_service = CustomerService()


class AppointmentRequestService:
    async def get_all_appointment_request(self, session: AsyncSession, filter: AppointmentRequestFilter):
        statement = select(AppointmentRequest)
        for field, value in filter.model_dump(exclude_none=True).items():
            statement = statement.where(getattr(AppointmentRequest, field) == value)
        statement = statement.order_by(desc(AppointmentRequest.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_appointment_request(self, id: str, session: AsyncSession):
        statement = select(AppointmentRequest).where(AppointmentRequest.id == id)
        result = await session.exec(statement)
        return result.first() if result else None

    async def create_appointment_request(self, data: CreateAppointmentRequest, session: AsyncSession):
        new_customer_data = CreateCustomer(
            first_name=data.customer_info.first_name,
            last_name=data.customer_info.last_name,
            phone=data.customer_info.phone,
            email=data.customer_info.email,
            contact_method=data.customer_info.contact_method
            )
        new_customer = await customer_service.create_customer(new_customer_data, session=session)
        customer_id = new_customer.id
        data.customer = customer_id
        data_dict = data.model_dump(exclude={"customer_info"}, exclude_none=True)
        new_appointment_request = AppointmentRequest(**data_dict)
        session.add(new_appointment_request)

        await session.commit()
        await session.refresh(new_appointment_request)
        return new_appointment_request

    async def update_appointment_request(self, id: str, data: UpdateAppointmentRequest, session: AsyncSession):
        data_to_update = await self.get_appointment_request(id=id, session=session)
        if data.customer_info:
            await customer_service.update_customer(id=data_to_update.customer, data=data.customer_info, session=session)
        if data_to_update:
            data_update_dict = data.model_dump(exclude={"customer_info"}, exclude_none=True)

            for k, v in data_update_dict.items():
                setattr(data_to_update, k, v)
            await session.commit()
            await session.refresh(data_to_update)
            return data_to_update
        return None

    async def delete_appointment_request(self, id: str, session: AsyncSession):
        data_to_delete = await self.get_appointment_request(id=id, session=session)

        if data_to_delete:
            if data_to_delete.go_reminders_id:
                delete_appointment(str(data_to_delete.go_reminders_id))
            await session.delete(data_to_delete)
            await session.commit()
        return None
