# push entity and get response (most likely entity ID)
# call images endpoint with entity type, and ID
from fastapi import APIRouter, Form, UploadFile, Depends, HTTPException
from app.database import AsyncSession, get_session
from typing import List
from .models import ImageType, DeleteImages
from .helpers import upload_to_bucket, delete_from_bucket_by_url
from portfolio.artist.services import ArtistService, UpdateArtist
from portfolio.work.services import ArtistWorkService, UpdateArtistWork
from designs.ideas.services import TattooIdeaService, UpdateTattooIdea
from designs.services import DesignService, UpdateDesign
from appointments.services import AppointmentRequestService, UpdateAppointmentRequest

router = APIRouter()

content_types = ["image/jpg", "image/jpeg", "image/png"]


@router.post("", status_code=201)
async def upload_images(images: List[UploadFile], entity: ImageType = Form(), session: AsyncSession = Depends(get_session), id: str = None):
    item_exists = None
    if entity == "artist":
        item_exists = await ArtistService().get_artist(id=id, session=session)
    elif entity == "artist_work":
        item_exists = await ArtistWorkService().get_work(id=id, session=session)
    elif entity == "idea":
        item_exists = await TattooIdeaService().get_idea(id=id, session=session)
    elif entity == "appointment_request":
        item_exists = await AppointmentRequestService().get_appointment_request(id=id, session=session)
    else:
        item_exists = await DesignService().get_design(id=id, session=session)
    if id and not item_exists:
        raise HTTPException(status_code=404, detail="Item with this ID does not exist")

    print("\n\n\n\n", len(images), "\n\n\n\n")
    for file in images:
        content_type = file.content_type
        if content_type not in content_types:
            raise HTTPException(status_code=400, detail="Unsupported file type. Check your files and try again")
        file_size = len(await file.read())

        if file_size >= 10388608:
            raise HTTPException(status_code=400, detail="One of your images is too large. Upload file less than 10mb")

    urls = []
    res = None

    for file in images:
        url = upload_to_bucket(file=file)
        urls.append(url)

    if entity == "artist":
        res = await ArtistService().update_artist(artist_data=UpdateArtist(image=urls[0]), id=id, session=session)
    elif entity == "artist_work":
        res = await ArtistWorkService().update_work(id=id, work_data=UpdateArtistWork(image=urls[0]), session=session)
    elif entity == "idea":
        res = await TattooIdeaService().update_idea(id=id, data=UpdateTattooIdea(image=urls[0]), session=session)
    elif entity == "appointment_request":
        res = await AppointmentRequestService().update_appointment_request(id=id, data=UpdateAppointmentRequest(images=urls), session=session)
    else:
        res = await DesignService().update_design(id=id, design_data=UpdateDesign(images=urls), session=session)
    if res:
        return res
    raise HTTPException(status_code=500, detail="There was a problem uploading the images")


@router.post("/delete", status_code=204)
async def delete_images(data: DeleteImages):
    urls = data.images
    for url in urls:
        delete_from_bucket_by_url(url)
    return
