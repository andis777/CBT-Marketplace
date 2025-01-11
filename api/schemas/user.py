from pydantic import BaseModel, EmailStr
from typing import Optional
from api.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    avatar: Optional[str] = None
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str