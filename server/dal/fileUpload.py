import boto3
from fastapi import UploadFile
from dal.mysql_connection import get_database_connection 




AWS_ACCESS_KEY_ID = "AKIATCKAO3E54RUT3WWQ"
AWS_SECRET_ACCESS_KEY = "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"
AWS_REGION_NAME = "eu-north-1"
S3_BUCKET_NAME = "file-management-fastapi"

# Initialize S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION_NAME
)




def insert_file_details_to_database(file_name, user_id, folder_id, file_size, upload_date, file_path):
    # Establish a connection to the database
    conn = get_database_connection()  
    cursor = conn.cursor()

    try:
        # Insert file details into the database
        query = """
        INSERT INTO file (name, user_id, folder_id, size, is_deleted, upload_date, path)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (file_name, user_id, folder_id, file_size, False, upload_date, file_path)
        cursor.execute(query, values)
        conn.commit()
    except Exception as e:
        print(f"Error inserting file details into the database: {e}")
    finally:
        # Close cursor and connection
        cursor.close()
        conn.close()








async def save_uploaded_file_to_s3(file: UploadFile, user_id: int):
    # Generate a unique filename including the user ID
    unique_filename = f"user_{user_id}/" + file.filename
    # Upload file to S3 bucket
    try:
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            unique_filename
        )
        file_path = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION_NAME}.amazonaws.com/{unique_filename}"
        return file_path
    except Exception as e:
        print("Error uploading file to S3:", e)
        return None
    







