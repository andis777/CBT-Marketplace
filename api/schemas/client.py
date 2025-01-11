from pydantic import BaseModel
from typing import List, Optional, Dict
from .user import User

class ClientBase(BaseModel):
    preferences: Dict[str, str]
    saved_psychologists: List[str]
    saved_institutions: List[str]

class ClientCreate(ClientBase):
    user_id: str

class ClientUpdate(BaseModel):
    preferences: Optional[Dict[str, str]] = None
    saved_psychologists: Optional[List[str]] = None
    saved_institutions: Optional[List[str]] = None

class ClientInDBBase(ClientBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class Client(ClientInDBBase):
    user: User