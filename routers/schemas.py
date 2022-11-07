from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: str
    password: str


class UserDisplay(BaseModel):
    username: str
    email: str
    class Config():
        orm_mode = True


class PostBase(BaseModel):
    image_url: str
    image_url_type: str
    image_url: str
    caption: str
    creator_id: int


class User(BaseModel): #For post display
    username: str
    class Config():
        orm_mode = True

class PostDisplay(BaseModel):
    id: int
    image_url: str
    image_url_type: str
    caption: str
    time_stamp: datetime
    user: User
    class Config():
        orm_mode = True


class UserAuth(BaseModel):
    id: int
    username: str
    email: str
