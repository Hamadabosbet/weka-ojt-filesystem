from fastapi import  APIRouter,HTTPException, Cookie,Request
from  dal.threeDots import get_versions_for_file,delete_file,delete_folder, rename_file, download_file
from common.HTTPExceptions.exceptions import CustomHTTPException
from dal.config import cipher
from dal.validation import validate_email_format
from dal.authentication import check_email_exist
from dal.dalFuction import get_myfolders
from dal.threeDots import update_file_parent
from dal.config import get_user_id

router = APIRouter()



@router.get("/versions/{file_id}")
async def show_versions(file_id: int):
    versions = get_versions_for_file(file_id)
    if versions:
        return {"status": "success", "versions": versions}
    else:
        raise CustomHTTPException(status_code=404, detail="File not found")
    


@router.delete("/file/{file_id}")
def folder_delete(request:Request,file_id: int):
    try:
        user_id = get_user_id(request)
        # Check if file restored
        result = delete_file( file_id,user_id)
        return result
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    


@router.delete("/folder/{folder_id}")
def folder_delete(request:Request,folder_id: int):
    try:
        user_id = get_user_id(request)
        # Check if folder restored
        result = delete_folder( folder_id,user_id)
        return result
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    



@router.post("/share/{file_id}")
def share_file(file_id: int,email:str,user_id: Annotated[str | None, Cookie()] = None):
    #check if formate email is write 
    if not validate_email_format(email):
        raise HTTPException(status_code=400, detail="Invalid Email format")
    # check if the email in db
    if not check_email_exist(email):
        raise HTTPException(status_code=400, detail="email not in database")
    # check if the owner of the file is the user that loged in
    user=cipher.decrypt(eval(user_id)).decode()
    

    now i do share with file 


@router.put("/file/rename/{file_id}")
def rename_file_route(file_id: int, new_name: str, user_id: Annotated[str | None, Cookie()] = None):
    user_id = cipher.decrypt(eval(user_id)).decode()
    try:
        result = rename_file(file_id, new_name, user_id)
        return result
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/file/download/{file_id}")
def download_file_route(file_id: int):
    try:
        # Get file download logic here
        result = download_file(file_id)
        return result
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.get("/move")
def get_all_folders(request:Request,folder_id:int,file_id: int):
    try:
        user_id = get_user_id(request)
        folders = get_myfolders(user_id,1)
        return folders
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



@router.put("/move/{file_id}/{target_folder_id}")
def move_file(request:Request,file_id: int,target_folder_id:int):
    try:
        user_id = get_user_id(request)
        result = update_file_parent(file_id,target_folder_id,user_id)
        return result
    except CustomHTTPException as e:
        return e
    except Exception as e:
        raise CustomHTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



