from .models import User
from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import CreateUser, ChangePassword
from sqlmodel import select, desc
from .utils import create_password_hash


class UserService:
    async def get_all_users(self, session: AsyncSession):
        statement = select(User)
        statement = statement.order_by(desc(User.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_user_by_email(self, email: str, session: AsyncSession):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        user = result.first()
        return user

    async def get_user_by_id(self, id: str, session: AsyncSession):
        statement = select(User).where(User.id == id)
        result = await session.exec(statement)
        user = result.first()
        return user

    async def check_user_exists(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email=email, session=session)
        return True if user else False

    async def create_user(self, user_data: CreateUser, session: AsyncSession):
        user_data_dict = user_data.model_dump()
        new_user = User(**user_data_dict)
        new_user.password_hash = create_password_hash(user_data_dict["password"])
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

    async def delete_user(self, id: str, session: AsyncSession):
        user_to_delete = await self.get_user_by_id(id=id, session=session)

        if user_to_delete:
            await session.delete(user_to_delete)
            await session.commit()
        return None

    async def update_user(self, user: User, user_data: dict, session: AsyncSession):
        for k, v in user_data.items():
            setattr(user, k, v)
        await session.commit()
        return user

    async def change_password(self, id: str, data: ChangePassword, session: AsyncSession):
        user = await self.get_user_by_id(id=id, session=session)
        password_hash = create_password_hash(data.new_password)
        user.password_hash = password_hash
        await session.commit()
        await session.refresh(user)
        return user
