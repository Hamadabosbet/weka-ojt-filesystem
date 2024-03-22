import os
from email.message import EmailMessage
import ssl
import smtplib
from dal.mysql_connection import get_database_connection
from typing import List
from dal.config import cipher
from common.HTTPExceptions.exceptions import CustomHTTPException
from datetime import datetime
from .models import File,Folder
# witch do encrypt for the mail to send it to the user in the token
def Encrypt_email(email):
   encrypted_email= cipher.encrypt(email.encode())
   return encrypted_email


# check if the owner fo the file in the user who login
def owner_of_file(user_id,file_id):
    conn = get_database_connection()
    cursor = conn.cursor()
    owners_query = "SELECT id FROM file WHERE user_id = %s AND id = %s"
    cursor.execute(owners_query, (user_id, file_id))
    my_folders = cursor.fetchall()
    conn.commit()
    conn.close()

    if my_folders :
      return True 
    else:  
     return False



# send email to the recever_email
def send_email(recever_email,msg,subject):
   email_sender="filesystem2024@gmail.com"
   email_password="ejnw zjwu gmfc jzjt"
   subject=subject
   body=msg
   em =EmailMessage()
   em['From']=email_sender
   em['To']= recever_email
   em['Subject']=subject
   em.set_content(body) 
   context=ssl.create_default_context()
   try:
        with smtplib.SMTP_SSL('smtp.gmail.com',465,context=context)as smtp:
            smtp.login(email_sender,email_password)
            smtp.sendmail(email_sender,recever_email,em.as_string())
        return True
   except Exception as E:
        return False

# Function to retrieve myfiles
def get_myfiles(user_id: int, page: int, sorted_by: str = "upload_date") -> List[File]:
    conn = get_database_connection()
    cursor = conn.cursor()
    # Query to retrieve user's files from MyFile
    my_files_query = "SELECT * FROM file WHERE user_id = %s AND is_deleted = 0"
    # Sorting files by upload_date if requested
    my_files_query += f" ORDER BY {sorted_by} DESC"
    # Calculate the range of files to return based on the page
    start_index = (page - 1) * 20
    # Execute the query with user_id as parameter
    cursor.execute(my_files_query, (user_id,))
    my_files = cursor.fetchall()
    # Return the subset of files based on the page
    files = []
    for file_data in my_files:
        file = File(
            
            id=file_data[0],
            name=file_data[1],
            user_id=file_data[2],
            folder_id=file_data[3],
            size=file_data[4],
            is_deleted=bool(file_data[5]),  # Convert to bool
            upload_date=file_data[6],
            path=file_data[7],
            group_version_id=file_data[8]
        )
        files.append(file)
    if conn:
        conn.close()
    return files[start_index:start_index + 20]

def get_myfolders(user_id: int, page: int, sorted_by: str = "upload_date") -> List[Folder]:
    conn = get_database_connection()
    cursor = conn.cursor()
    # Query to retrieve user's folders from MyFile
    my_folders_query = "SELECT * FROM folder WHERE user_id = %s AND is_deleted = 0"
    # Sorting folders by upload_date if requested
    my_folders_query += f" ORDER BY {sorted_by} DESC"
    # Calculate the range of folders to return based on the page
    start_index = (page - 1) * 20
    # Execute the query with user_id as parameter
    cursor.execute(my_folders_query, (user_id,))
    my_folders = cursor.fetchall()
    folders = []
    for folder_data in my_folders:
        folder = Folder(      
            id=folder_data[0],
            name=folder_data[1],
            user_id=folder_data[2],

            parent_folder=folder_data[3],
            is_deleted=bool(folder_data[4]),  # Convert to bool
            path=folder_data[5],
            upload_date=folder_data[6],
        )
        folders.append(folder)
    # Return the subset of folders based on the page
    if conn:
            conn.close()      
    return folders[start_index:start_index + 20]

def get_deletedfiles(user_id: int, page: int, sorted_by: str = "upload_date") -> List[File]:
    conn = get_database_connection()
    cursor = conn.cursor()
    # Query to retrieve user's deleted files
    deleted_files_query = """
        SELECT * FROM file 
        WHERE user_id = %s AND is_deleted = 1 
        ORDER BY {} DESC
        LIMIT %s OFFSET %s
    """.format(sorted_by)
    # Calculate offset and limit for pagination
    limit = 20
    offset = (page - 1) * limit
    # Execute the query with user_id, limit, and offset as parameters
    cursor.execute(deleted_files_query, (user_id, limit, offset))
    deleted_files = cursor.fetchall()
    files = []
    for file_data in deleted_files:
        file = File(
            id=file_data[0],
            name=file_data[1],
            user_id=file_data[2],
            folder_id=file_data[3],
            size=file_data[4],
            is_deleted=bool(file_data[5]),  # Convert to bool
            path=file_data[6],
            upload_date=file_data[7],
            group_version_id=file_data[8]
        )
        files.append(file)
    if conn:
        conn.close()
    return files

def get_deletedfolders(user_id: int, page: int, sorted_by: str = "upload_date") -> List[dict]:
    conn = get_database_connection()
    cursor = conn.cursor()
    # Query to retrieve user's deleted folders
    deleted_files_query = """
        SELECT * FROM folder 
        WHERE user_id = %s AND is_deleted = 1 
        ORDER BY {} DESC
        LIMIT %s OFFSET %s
    """.format(sorted_by)
    # Calculate offset and limit for pagination
    limit = 20
    offset = (page - 1) * limit
    # Execute the query with user_id, limit, and offset as parameters
    cursor.execute(deleted_files_query, (user_id, limit, offset))
    deleted_files = cursor.fetchall()
    if conn:
            conn.close()
    return deleted_files

# send_email("ekhlass@post.bgu.ac.il","welcome")



def update_Password(email,password):
   
    connection = get_database_connection()
    cursor = connection.cursor()
    # cursor.execute("SET sql_safe_updates=0;")
    update_password = """
       UPDATE users SET password = %s WHERE email = %s LIMIT 1;

    """
    cursor.execute(update_password, (password,email ))
    connection.commit()
    connection.close()

    # update_user = cursor.fetchall()
    return  True

# update_Password("ekhlass@post.bgu.ac.il","12121212")



def  get_file_data(file_id,user_id):

    connection = get_database_connection()
    cursor = connection.cursor()
    get_query = "SELECT * FROM file WHERE id= %s AND user_id= %s;"

    try:
        cursor.execute(get_query, (file_id, user_id))
        file_data = cursor.fetchone()
        return file_data
    except Exception as e:
        connection.rollback()
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    finally:
        cursor.close()


def get_shared_file_data(file_id,user_id):

    connection = get_database_connection()
    cursor = connection.cursor()
    get_query = "Select * From file Where id=? user_id = (SELECT shared_by_user_id FROM SharedFile WHERE file_id=? AND shared_with_user_id=?);"

    try:
        cursor.execute(get_query, (file_id, file_id, user_id))
        file_data = cursor.fetchone()
        return file_data
    except Exception as e:
        connection.rollback()
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    finally:
        cursor.close()

def get_files_infolder(folder_id, user_id):
    conn = get_database_connection()
    cursor = conn.cursor()
    query = "SELECT id, name, size, upload_date FROM file WHERE folder_id = %s AND user_id = %s AND is_deleted = FALSE"
    cursor.execute(query, (folder_id, user_id))
    files = cursor.fetchall()
    cursor.close()
    conn.close()
    return files

# Function to get list of folders in a folder
def get_folders_infolder(folder_id, user_id):
    conn = get_database_connection()
    cursor = conn.cursor()
    query = "SELECT id, name, upload_date FROM folder WHERE parent_folder = %s AND user_id = %s AND is_deleted = FALSE"
    cursor.execute(query, (folder_id, user_id))
    folders = cursor.fetchall()
    cursor.close()
    conn.close()
    return folders

# Function to get data (files and folders) in a folder
def get_folder_data(folder_id, user_id):
    files = get_files_infolder(folder_id, user_id)
    folders = get_folders_infolder(folder_id, user_id)
    return {'files': files, 'folders': folders}
# Function to retrieve myfiles
def get_sharedfiles(user_id: int, page: int, sorted_by: str = "upload_date") -> List[File]:
    conn = get_database_connection()
    cursor = conn.cursor()
    start_index = (page - 1) * 20
    query = """
        SELECT * FROM file
        WHERE id IN (
            SELECT file_id FROM sharedfile
            WHERE shared_with_user_id = %s
        )
        ORDER BY {} DESC
        LIMIT %s OFFSET %s
    """.format(sorted_by)
    cursor.execute(query, (user_id, 20, start_index))
    shared_files_data = cursor.fetchall()
    if shared_files_data is None:
        return []
    shared_files = []
    for file_data in shared_files_data:
        file = File(
            id=file_data[0],
            name=file_data[1],
            user_id=file_data[2],
            folder_id=file_data[3],
            size=file_data[4],
            is_deleted=file_data[5],
            path=file_data[6],
            upload_date=file_data[7],
            group_version_id=file_data[8]
        )
        shared_files.append(file)
    if conn:
            conn.close()
    return shared_files



def get_userid(email):
    with get_database_connection() as conn, conn.cursor() as cursor:
        query = "SELECT id FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
    conn.close()

    return result[0] if result else None

def email_owner(user_id):
    with get_database_connection() as conn, conn.cursor() as cursor:
        query = "SELECT email FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        email = cursor.fetchone()

    conn.close()
    
    return email[0] if email else None

def get_username(user_id):
    conn = get_database_connection()
    cursor = conn.cursor()
    query = "SELECT username FROM users WHERE id = %s "
    cursor.execute(query, (user_id,))  # Pass user_id as a tuple
    result = cursor.fetchone()
    if result:
        return result[0]  # Assuming username is in the first column of the result
    else:
        return None



def do_share(shared_with_id,owner_id,file_id):
    conn = get_database_connection()
    cursor = conn.cursor()
    query = "INSERT INTO sharedfile ( file_id, shared_by_user_id, shared_with_user_id,permission) VALUES (%s,%s,%s,%s) "

    cursor.execute(query, (file_id,owner_id,shared_with_id,"read"))
    conn.commit()
    conn.close()

   



