from fastapi import APIRouter
from dal.dalFuction import get_myfiles

router = APIRouter()

@router.get("/my_files")
async def my_files():
    return """123"""