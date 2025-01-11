from pydantic import BaseModel
from typing import List, Optional, Dict
from .user import User

class InstitutionBase(BaseModel):
    description: str
    address: str
    services: List[Dict[str, str]]
    contacts: Dict[str, str]

class InstitutionCreate(InstitutionBase):
    user_id: str

class InstitutionUpdate(BaseModel):
    description: Optional[str] = None
    address: Optional[str] = None
    services: Optional[List[Dict[str, str]]] = None
    contacts: Optional[Dict[str, str]] = None

class InstitutionInDBBase(InstitutionBase):
    id: str
    user_id: str
    psychologists_count: int
    is_verified: bool

    class Config:
        from_attributes = True

class Institution(InstitutionInDBBase):
    user: User