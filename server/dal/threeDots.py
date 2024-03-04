from dal.mysql_connection import get_database_connection
from dal.mysql_connection import get_database_connection
from exceptions import CustomHTTPException

connection = get_database_connection()

def get_versions_for_file(file_id):
    conn = get_database_connection()  
    cursor = conn.cursor()

    # Fetch versions for the given file_id using a single query
    cursor.execute("""
        SELECT fv.id, fv.name, fv.upload_date 
        FROM FileVersion fv 
        INNER JOIN file f ON fv.id = f.group_version_id 
        WHERE f.id = ?
    """, (file_id,))
    versions = cursor.fetchall()

    conn.close()

    return versions



def delete_file(file_id,user_id):

    connection = get_database_connection()
    cursor = connection.cursor()
    delete_query = update_is_deleted_file()

    try:
        cursor.execute(delete_query, ("1",file_id, user_id))
        connection.commit()

        return {
            "status": "success",
            "msg": f"File with ID {file_id} deleted successfully."
        }
    except Exception as e:
        connection.rollback()
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    finally:
        cursor.close()


def delete_folder(folder_id,user_id):

    connection = get_database_connection()
    cursor = connection.cursor()
    delete_query = update_is_deleted_folder()

    try:
        cursor.execute(delete_query, ("1",folder_id, user_id))
        connection.commit()

        return {
            "status": "success",
            "msg": f"Folder with ID {folder_id} deleted successfully."
        }
    except Exception as e:
        connection.rollback()
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    finally:
        cursor.close()




def update_is_deleted_file():
    restore_query = "UPDATE files SET is_deleted = %s WHERE id = %sAND user_id=?;"
    return restore_query       

def update_is_deleted_folder():
    restore_query = "UPDATE folders SET is_deleted = %s WHERE id = %sAND user_id=?;"
    return restore_query