from fastapi import APIRouter, Depends
from .api_setup import api_request
from auth.dependencies import AccessTokenBearer

access_token_bearer = AccessTokenBearer()


router = APIRouter()


@router.get("/go_reminders_artists", status_code=200, description="Get artists from goreminders", dependencies=[Depends(access_token_bearer)])
async def get_go_reminders_artists():
    res = api_request(method="GET", endpoint="/staff")
    return res


@router.get("/go_reminders_services", status_code=200, description="Get services from goreminders")
async def get_go_reminders_services():
    res = api_request(method="GET", endpoint="/services")
    return res


@router.get("/go_reminders_artist_appointments", status_code=200, description="Get artists from goreminders")
async def get_go_reminders_artist_appointments(artist_id: str):
    res = api_request(method="GET", endpoint="/appointments")
    if res:
        new_res = [res_item for res_item in res if res_item["staff"] == artist_id]
    return new_res or []
