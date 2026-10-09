from sqlalchemy.ext.asyncio import AsyncEngine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import create_engine, SQLModel
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DB_URL")
db_url = "postgresql+asyncpg://seere_db_owner:6cF2xZEwYqeO@ep-crimson-smoke-a247np7r-pooler.eu-central-1.aws.neon.tech/seere_db"
# print(db_url, "This is the db url")


engine = AsyncEngine(create_engine(
        url=db_url,
        echo=True
    ))


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:

    Session = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

    async with Session() as session:
        yield session
