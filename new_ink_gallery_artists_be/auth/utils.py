from passlib.context import CryptContext
from fastapi import HTTPException
import logging
from datetime import timedelta, datetime, timezone
import jwt
import uuid
from itsdangerous import URLSafeTimedSerializer


password_context = CryptContext(
    schemes=["bcrypt"]
)


def create_password_hash(password: str) -> str:
    hash = password_context.hash(password)
    return hash


def verify_password(password, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


access_expiry = 3600


def create_access_token(user_data: dict, expiry: timedelta = timedelta(microseconds=access_expiry), refresh: bool = False):
    payload = {}
    payload["user"] = user_data
    payload["exp"] = datetime.now(tz=timezone.utc) + expiry
    payload["jti"] = str(uuid.uuid4())
    payload["refresh"] = refresh
    token = jwt.encode(
        payload=payload,
        key="d456500f8c979efe04a3edd9a185a5f7",
        algorithm="HS256"
    )
    return token


def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(
            jwt=token,
            key="d456500f8c979efe04a3edd9a185a5f7",
            algorithms=["HS256"]
        )
        return token_data
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your token is expired")
    except jwt.PyJWKError as e:
        logging.exception(e)
        return None


serializer = URLSafeTimedSerializer(
        secret_key="d456500f8c979efe04a3edd9a185a5f7"
        )


def create_urlsafe_token(data: dict, salt):
    serializer.salt = salt
    token = serializer.dumps(data)
    return token


def decode_urlsafe_token(token: str, salt: str):
    try:
        token_data = serializer.loads(token, salt=salt)
        return token_data
    except Exception as e:
        logging.error(str(e))
