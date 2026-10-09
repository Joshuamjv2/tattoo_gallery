from fastapi import APIRouter, Depends, Request
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import User, UserLogin, PasswordResetRequest, ResetPassword, UpdateUser, ChangePassword, CreateUser
from .services import UserService
from app.database import get_session
from .utils import create_access_token, verify_password, create_urlsafe_token, decode_urlsafe_token, create_password_hash
from datetime import timedelta, datetime
from .dependencies import RefreshTokenBearer, AccessTokenBearer, get_current_user
from app.redis import add_jti_to_blocklist
from mail import create_message, mail
from typing import List


router = APIRouter()
user_service = UserService()
refresh_token_bearer = RefreshTokenBearer()
access_token_bearer = AccessTokenBearer()


@router.post("/signup", status_code=201)
async def create_user(user: CreateUser, request: Request, session: AsyncSession = Depends(get_session)) -> dict:
    email = user.email
    user_exists = await user_service.check_user_exists(email, session=session)
    if user_exists:
        raise HTTPException(status_code=403, detail="User with email already exists.")
    new_user = await user_service.create_user(user_data=user, session=session)
    return {"message": "Account created. Check your email to verify your account.", "user": new_user}


@router.post("/login", status_code=200)
async def login_users(login_data: UserLogin, session: AsyncSession = Depends(get_session)):
    email = login_data.email
    password = login_data.password

    user = await user_service.get_user_by_email(email=email, session=session)
    if user:
        password_valid = verify_password(password, user.password_hash)
        if password_valid:
            expiry = timedelta(hours=1)
            access_token = create_access_token(user_data={"email": email, "id": str(user.id)}, expiry=expiry)
            expiry = timedelta(days=2)
            refresh_token = create_access_token(user_data={"email": email, "id": str(user.id)}, refresh=True, expiry=expiry)
            return JSONResponse(
                content={
                    "message": "Login SuccessFull",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "id": str(user.id),
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }
                }
            )
    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("", status_code=200, dependencies=[Depends(access_token_bearer)], response_model=List[User])
async def get_all_users(session: AsyncSession = Depends(get_session)):
    users = await user_service.get_all_users(session=session, filter=filter)
    return users


@router.get("/refresh_token", status_code=200)
async def refresh_access_token(token_details: dict = Depends(refresh_token_bearer)):
    expiry_time_stamp = token_details["exp"]
    if datetime.fromtimestamp(expiry_time_stamp) > datetime.now():
        expiry = timedelta(hours=1)
        new_access_token = create_access_token(user_data=token_details["user"], expiry=expiry)
        return JSONResponse(
            {"access_token": new_access_token}
        )
    raise HTTPException(status_code=403, detail="Invalid or expired token")


@router.get("/logout", status_code=200)
async def revoke_token(token_details: dict = Depends(AccessTokenBearer())):
    jti = token_details["jti"]
    await add_jti_to_blocklist(jti)
    return JSONResponse(content={"message": "Logged out successfully!"})


@router.get("/me", status_code=200, response_model=User)
async def get_current_logged_user(user=Depends(get_current_user)):
    return user


@router.delete("/{id}", status_code=204)
async def delete_user(id: str, session: AsyncSession = Depends(get_session), token_details: dict = Depends(AccessTokenBearer())) -> None:
    await user_service.delete_user(id=id, session=session)
    return {}


@router.get("/verify_email", status_code=200)
async def verify_email(token: str, session: AsyncSession = Depends(get_session)):
    token_data = decode_urlsafe_token(token, salt="email-verification")
    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid verification link. Try again")
    user_email = token_data.get("email")
    if user_email:
        user = await user_service.get_user_by_email(email=user_email, session=session)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid verification link")
        await user_service.update_user(user=user, user_data={"is_verified": True, "is_active": True}, session=session)
        return JSONResponse(
            content={"message": "Account verified successfully."}
        )
    return JSONResponse(content={"message": "There was a problem verifying your account. Request for new link"}, status_code=500)

# forgot password
"""
1.Provide email - request
2.Send link
3.Reset password - password reset
"""


@router.post("/password_reset_request", status_code=200)
async def password_reset_request(email: PasswordResetRequest, request: Request, session: AsyncSession = Depends(get_session)):
    user_exists = await user_service.check_user_exists(email.email, session=session)
    if not user_exists:
        raise HTTPException(status_code=403, detail="Unable to reset password for this email.")
    token = create_urlsafe_token(salt="password-reset", data={"email": email.email})
    verification_link = f"{email.redirect_url}?token={token}"

    html_message = f"""
    <h1>Password reset request</h1>
    <p>Please click this <a href="{verification_link}">link</a> to reset your password.</p>
    """
    message = create_message(recipients=[email.email], subject="New Ink Gallery: Password reset request.", body=html_message)
    await mail.send_message(message)
    return {"message": "Check your email for instructions to reset your password."}


@router.post("/password_reset_confirm")
async def password_reset_confirm(token: str, password: ResetPassword, session: AsyncSession = Depends(get_session)):
    token_data = decode_urlsafe_token(token, salt="password-reset")

    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid reset link. Try again")
    user_email = token_data.get("email")

    if user_email:
        user = await user_service.get_user_by_email(email=user_email, session=session)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid reset link")

        new_password = password.password
        confirm_password = password.confirm_password
        if new_password != confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        password_hash = create_password_hash(new_password)
        await user_service.update_user(user=user, user_data={"password_hash": password_hash}, session=session)
        return JSONResponse(
            content={"message": "Password reset successfully."}
        )
    return JSONResponse(content={"message": "There was a problem resetting your password. Request for new reset link"}, status_code=500)


@router.patch("", status_code=200)
async def update_user_profile(user_data: UpdateUser, session: AsyncSession = Depends(get_session), user: dict = Depends(AccessTokenBearer())):
    saved_user = await user_service.get_user_by_id(id=user["user"]["id"], session=session)
    user_data = user_data.model_dump(exclude_none=True)
    user = await user_service.update_user(user=saved_user, user_data=user_data, session=session)
    return user


@router.patch("/change_password", status_code=200, dependencies=[Depends(AccessTokenBearer)])
async def change_password(data: ChangePassword, session: AsyncSession = Depends(get_session), token_details: dict = Depends(AccessTokenBearer())):
    user_id = token_details["user"]["id"]
    user = await user_service.get_user_by_id(user_id, session=session)
    password_valid = verify_password(data.old_password, user.password_hash)
    if password_valid:
        user = await user_service.change_password(user_id, data, session)
        if user:
            return {"message": "Password changed successfully"}
        else:
            raise HTTPException(status_code=500, detail="There was a problem updating password")
    else:
        raise HTTPException(status_code=400, detail="Please make sure that you provide your correct current password")
