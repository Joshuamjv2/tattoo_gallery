from google.cloud import storage
import os
from uuid import uuid4

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "booking-app-462323-3ceba51dbfd5.json"

storage_client = storage.Client()


# creating bucket
# bucket_name = "ink-gallery-images"
# bucket = storage_client.bucket(bucket_name)
# storage_client.create_bucket(bucket, location="US")


# accessing bucket

# bucket = storage_client.get_bucket('ink-gallery-images')


# upload files
def upload_to_bucket(file, bucket_name="ink-gallery-images"):
    try:
        file.file.seek(0)
        file_name = file.filename
        blob_name = f"{str(uuid4())}_{file_name}"
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)

        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(e)
        return False


from google.cloud import storage
import os
from uuid import uuid4
from urllib.parse import urlparse

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "booking-app-462323-3ceba51dbfd5.json"

storage_client = storage.Client()
bucket_name = "ink-gallery-images"
bucket = storage_client.get_bucket(bucket_name)

# Upload files
def upload_to_bucket(file, bucket_name=bucket_name):
    try:
        file.file.seek(0)
        file_name = file.filename
        blob_name = f"{str(uuid4())}_{file_name}"
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)

        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print("Upload error:", e)
        return False


# Delete file using its public URL
def delete_from_bucket_by_url(public_url, bucket_name=bucket_name):
    try:
        parsed_url = urlparse(public_url)
        blob_name = parsed_url.path.lstrip('/')  # remove leading slash
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.delete()
        print(f"Deleted {blob_name} from {bucket_name}")
        return True
    except Exception as e:
        print("Delete error:", e)
        return False


# file_path = r"C:\Users\Joshua\Downloads"
# upload_to_bucket("test_file", os.path.join(file_path, "AC200168 (2).jpeg"), 'ink-gallery-images')
# upload_to_bucket("documents/test_file", os.path.join(file_path, "AC200168 (2).jpeg"), 'ink-gallery-images')
