from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from auth.oauth2 import get_current_user
from routers.schemas import PostBase, UserAuth
from db.database import get_db
from fastapi.exceptions import HTTPException
from db import db_post
import random
import string
import shutil

router = APIRouter(
    prefix = '/post',
    tags = ['post']
)

img_url_types = ['absolute', 'relative']

@router.post('')
def create_post(request: PostBase, db: Session = Depends(get_db), 
                current_user: UserAuth = Depends(get_current_user)):
    if not request.image_url_type in img_url_types:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
        detail="Parameter image_url_type can only take values 'absolute' or 'relative'")
    return db_post.create(db, request)

@router.get('/all')
def posts(db: Session = Depends(get_db)):
    return db_post.get_all(db)
    
@router.post('/image')
def upload_image(image: UploadFile=File(...),
                 current_user: UserAuth = Depends(get_current_user)):
    letters = string.ascii_letters
    rand_str = ''.join(random.choice(letters) for i in range(6))
    new = f'_{rand_str}.'
    filename = new.join(image.filename.rsplit('.', 1))
    path = f'images/{filename}'

    with open(path, "w+b") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {"filename": path} 


@router.get('/delete/{id}')
def delete(id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_post.delete_post(id, db, current_user.id)
    
