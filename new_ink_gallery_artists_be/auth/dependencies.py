from fastapi.security import HTTPBearer
from fastapi import Request, Depends
# from fastapi.security.http import HTTPAuthorizationCredentials
from .utils import decode_token
from fastapi.exceptions import HTTPException
from app.redis import token_in_blocklist
from app.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from .services import UserService


user_service = UserService()


class TokenBearer(HTTPBearer):

    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        creds = await super().__call__(request)
        token = creds.credentials
        token_data = decode_token(token)
        token_exists = await token_in_blocklist(token_data["jti"])

        if not self.token_valid(token):
            raise HTTPException(status_code=403, detail={
                "error": "This token is invalid or expired",
                "resolution": "Please get new token."
            })
        self.valid_token_data(token_data)

        if token_exists:
            raise HTTPException(status_code=403, detail={
                "error": "This token is invalid or expired",
                "resolution": "Please get new token."
            })
        return token_data

    def token_valid(self, token: str) -> bool:
        token_data = decode_token(token)
        if token_data:
            return token_data is not None

    def valid_token_data(self, token_data):
        raise NotImplementedError("Please override this method in child classes")


class AccessTokenBearer(TokenBearer):
    def valid_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(status_code=403, detail="Invalid access token")


class RefreshTokenBearer(TokenBearer):
    def valid_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(status_code=403, detail="Invalid refresh token")


async def get_current_user(token_data: dict = Depends(AccessTokenBearer()), session: AsyncSession = Depends(get_session)):
    user_email = token_data["user"]["email"]
    user = await user_service.get_user_by_email(email=user_email, session=session)
    return user
