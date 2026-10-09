from .services import AppointmentRequestService
from .schemas import CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentRequest, AppointmentRequestRes, ApproveAppointmentRequest, AppointmentRequestFilter, GoRemindersUpdateAppointment
from fastapi import APIRouter, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from auth.dependencies import AccessTokenBearer
from .goreminders.helpers import create_appointment, update_appointment
from dateutil import tz
from mail import mail, create_message

access_token_bearer = AccessTokenBearer()


service = AppointmentRequestService()
router = APIRouter()


@router.post("", response_model=AppointmentRequest, description="Create appointment request", status_code=201)
async def create_appointment_request(data: CreateAppointmentRequest, session: AsyncSession = Depends(get_session)):
    res = await service.create_appointment_request(data, session=session)
    print("\n\n\n", res, "\n\n\n")
    artist = res.artist_info
    if artist:
        artist = artist.name
    else:
        artist = "Available artist"
    message = create_message(recipients=["inkgalleryNJ@gmail.com"], subject="New appointment request", context={
        "name": data.customer_info.first_name,
        "phone": data.customer_info.phone,
        "email": data.customer_info.email,
        "artist": artist,
        "contact_method": str(data.customer_info.contact_method.value).capitalize(),
        "notes": data.notes or ""
        }, template_name="appointment_request.html")
    try:
        await mail.send_message(message=message["message"], template_name=message["template_name"])
    except Exception:
        pass
    return res


@router.get("", status_code=200, description="Get all appointment requests", response_model=List[AppointmentRequestRes],  dependencies=[Depends(access_token_bearer)])
async def get_appointment_requests(filter: AppointmentRequestFilter = Depends(), session: AsyncSession = Depends(get_session)):
    res = await service.get_all_appointment_request(session=session, filter=filter)
    if res:
        return res
    return []


@router.get("/{id}", status_code=200, response_model=AppointmentRequest, description="Get single appointment request", dependencies=[Depends(access_token_bearer)])
async def get_single_appointment_request(id: str, session: AsyncSession = Depends(get_session)):
    res = await service.get_appointment_request(id=id, session=session)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Appointment with this ID does not exist")


@router.post("/{id}", status_code=201, description="Approve appointment")
async def approve_appointment(id: str, data: ApproveAppointmentRequest, session: AsyncSession = Depends(get_session)):
    res = await service.update_appointment_request(id=id, data=data, session=session)
    if res:
        local_tz = tz.tzlocal()
        utc_dt = res.approved_date
        local_dt = utc_dt.astimezone(local_tz)
        formatted_date = local_dt.strftime('%m/%d/%Y %H:%M')
        if data.approved:
            payload = {
                    "location": 17628,
                    "staff": res.artist_info.go_reminders_id,
                    "service": int(res.service),
                    "customer": res.customer_info.go_reminders_id,
                    "notes": res.notes,
                    "template": 39617,
                    "length": res.length,
                    "date": formatted_date,
                    "external_source_id": id
                }
            if res.recurring_rule:
                payload["recurring_rule"] = res.recurring_rule
            apt = create_appointment(
                payload
            )
            print(apt)
            go_reminders_id = apt["id"]
            await service.update_appointment_request(data=UpdateAppointmentRequest(go_reminders_id=go_reminders_id), session=session, id=str(id))
        else:
            pass
    else:
        raise HTTPException(status_code=404, detail="Appointment with this ID does not exist.")
    return {"message": "Appointment request approved!"}


@router.patch("/{id}", status_code=201, description="Update appointment request", response_model=AppointmentRequest, dependencies=[Depends(access_token_bearer)])
async def update_appointment_request(id: str, data: UpdateAppointmentRequest, session: AsyncSession = Depends(get_session)):
    res = await service.update_appointment_request(id=id, data=data, session=session)
    if res:
        # update go reminders side
        date = None
        if data.approved_date:
            local_tz = tz.tzlocal()
            utc_dt = data.approved_date
            local_dt = utc_dt.astimezone(local_tz)
            formatted_date = local_dt.strftime('%m/%d/%Y %H:%M')
            date = formatted_date
        staff = None
        if data.artist:
            staff = res.artist_info.go_reminders_id

        payload = GoRemindersUpdateAppointment(
            length=data.length,
            staff=staff,
            date=date,
            recurring_rule=data.recurring_rule,
            notes=data.notes,
            service=data.service
        )
        payload = payload.model_dump(exclude_none=True)
        if payload:
            update_appointment(data=payload, id=str(res.go_reminders_id))
        return res
    raise HTTPException(status_code=404, detail="Appointment request with this ID does not exist!")


@router.delete("/{id}", status_code=204, description="Delete appointment request", dependencies=[Depends(access_token_bearer)])
async def remove_appointment_request(id: str, session: AsyncSession = Depends(get_session)):
    await service.delete_appointment_request(id=id, session=session)
    return {}
