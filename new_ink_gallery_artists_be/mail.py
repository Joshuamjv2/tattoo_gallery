from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from pathlib import Path
from typing import List, Dict

BASE_DIR = Path(__file__).resolve().parent

MAIL_USERNAME = "joshuamjv22@gmail.com"
MAIL_PASSWORD = "wsff pjlq ywoa muar"
MAIL_FROM = "joshuamjv22@gmail.com"
MAIL_PORT = "587"
MAIL_SERVER = "smtp.gmail.com"
MAIL_FROM_NAME = "Ink Gallery Tattoo Studio"

mail_config = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    VALIDATE_CERTS=True,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=Path(BASE_DIR, "templates"),
    TIMEOUT=60
)

mail = FastMail(
    config=mail_config
)


def create_message(recipients: List[str], subject: str, context: Dict[str, str], template_name: str):

    message = MessageSchema(
        recipients=recipients,
        subject=subject,
        template_body=context,
        subtype=MessageType.html
    )
    return {"message": message, "template_name": template_name}
