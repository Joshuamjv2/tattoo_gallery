import base64
import requests
from dotenv import load_dotenv
import os

load_dotenv()

username = os.getenv("GO_REMINDERS_USERNAME", "").strip()
password = os.getenv("GO_REMINDERS_PASSWORD", "").strip()
base_url = "https://api.goreminders.com/api/v1"


# Create encoded Basic Auth credentials
def get_auth_header():
    credentials = f"vm26pjzLI0svzGtM4Alm4vTAnpPJIgvv:Pe3cI?otk%%b`Jp!d%GZRVmH%IlRR$tZ"
    encoded = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    return f"Basic {encoded}"


# General API request function
def api_request(method, endpoint, data=None, params=None, content_type="application/json", accept="application/json", timeout=60):
    url = f"{base_url}/{endpoint.lstrip('/')}"

    headers = {
        "Authorization": get_auth_header(),
        "Content-Type": content_type,
        "Accept": accept
    }

    response = requests.request(
        method=method.upper(),
        url=url,
        headers=headers,
        json=data if content_type == "application/json" else None,
        data=data if content_type != "application/json" else None,
        params=params,
        timeout=timeout
    )

    # Raise an error for bad responses (optional but recommended)
    response.raise_for_status()

    # Return JSON if possible
    try:
        return response.json()
    except ValueError:
        return response.text
