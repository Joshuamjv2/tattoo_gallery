from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tags.routes import router as tags
from tags.design_routes import router as design_tags
from tags.portfolio_routes import router as portfolio_tags
from dotenv import load_dotenv
from designs.routes import router as designs
from portfolio.work.routes import router as artist_work
from portfolio.artist.routes import router as artist
from images.routes import router as image_uploads
from auth.routes import router as auth
from appointments.goreminders.routes import router as goreminders
from appointments.routes import router as appointment_requests
from appointments.customers.routes import router as customers
from designs.ideas.routes import router as tattoo_ideas
from tags.tattoo_idea_routes import router as tattoo_idea_tags

# load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", status_code=200)
async def welcome():
    return {"name": "Welcome"}

app.include_router(auth, prefix="/auth", tags=["Auth"])
app.include_router(designs, prefix="/designs", tags=["Designs"])
app.include_router(artist, prefix="/artists", tags=["Artists"])
app.include_router(artist_work, prefix="/artist_work", tags=["Artist Work"])
app.include_router(tags, prefix="/tags", tags=["Tags"])
app.include_router(design_tags, prefix="/design_tags", tags=["Design tags"])
app.include_router(tattoo_idea_tags, prefix="/tattoo_idea_tags", tags=["Tattoo Idea tags"])
app.include_router(portfolio_tags, prefix="/portfolio_tags", tags=["Portfolio tags"])
app.include_router(image_uploads, prefix="/image_uploads", tags=["Image Uploads"])
app.include_router(goreminders, prefix="/goreminders", tags=["Go reminders"])
app.include_router(customers, prefix="/customers", tags=["Customers"])
app.include_router(tattoo_ideas, prefix="/tattoo_ideas", tags=["Tattoo ideas"])
app.include_router(appointment_requests, prefix="/appointment_requests", tags=["Appointment requests"])

# device
# team member
# training session
# activity
# exercise
