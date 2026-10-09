from .api_setup import api_request
from urllib.parse import urlencode


def get_customers():
    res = api_request(method="GET", endpoint="/customers")
    return res


def customer_exists(email):
    customers = get_customers()
    customer = [res_item for res_item in customers if res_item["email"] == email]
    return customer or []


def delete_customer(id):
    response = api_request(
        method="DELETE",
        endpoint="/customers/"+id
    )
    return response


def create_customer(data):
    encoded_data = urlencode(data)
    response = api_request(
        method="POST",
        endpoint="/customers",
        data=encoded_data,
        content_type="application/x-www-form-urlencoded",
        accept="multipart"
    )
    return response


def update_go_reminders_customer(data, id):
    encoded_data = urlencode(data)
    response = api_request(
        method="PATCH",
        endpoint="/customers/"+id,
        data=encoded_data,
        content_type="application/x-www-form-urlencoded",
        accept="multipart"
    )
    return response


def create_appointment(data):
    encoded_data = urlencode(data)
    response = api_request(
        method="POST",
        endpoint="/appointments",
        data=encoded_data,
        content_type="application/x-www-form-urlencoded",
        accept="multipart"
    )
    return response


def update_appointment(data, id):
    response = api_request(
        method="PATCH",
        endpoint="/appointments/"+id,
        data=data
    )
    print("\n\n\n", response, "Thats the res you get", "\n\n\n\n")
    return response


def delete_appointment(id):
    print("Deleting from go reminders as well", id)
    response = api_request(
        method="DELETE",
        endpoint="/appointments/"+id
    )
    return response
