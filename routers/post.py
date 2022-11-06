from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from routers.schemas import PostBase, PostDisplay
from db.database import get_db
from fastapi.exceptions import HTTPException
from db import db_post
from typing import List

router = APIRouter(
    prefix = '/post',
    tags = ['post']
)

img_url_types = ['absolute', 'relative']

@router.post('')
def create_post(request: PostBase, db: Session = Depends(get_db)):
    if not request.image_url_type in img_url_types:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
        detail="Parameter image_url_type can only take values 'absolute' or 'relative'")
    return db_post.create(db, request)

@router.get('/all')
def posts(db: Session = Depends(get_db)):
    return db_post.get_all(db)
    

