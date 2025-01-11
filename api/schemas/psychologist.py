from pydantic import BaseModel
from typing import List, Optional, Dict
from .user import User

class PsychologistBase(BaseModel):
    description: str
    experience: int
    institution_id: Optional[str] = None
    specializations: List[str]
    languages: List[str]
    memberships: List[str]
    education: List[Dict[str, str]]
    certifications: List[Dict[str, str]]
    gallery: List[str]
    location: Dict[str, str]
    contacts: Dict[str, str]

class PsychologistCreate(PsychologistBase):
    user_id: str

class PsychologistUpdate(BaseModel):
    description: Optional[str] = None
    experience: Optional[int] = None
    institution_id: Optional[str] = None
    specializations: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    memberships: Optional[List[str]] = None
    education: Optional[List[Dict[str, str]]] = None
    certifications: Optional[List[Dict[str, str]]] = None
    gallery: Optional[List[str]] = None
    location: Optional[Dict[str, str]] = None
    contacts: Optional[Dict[str, str]] = None

class PsychologistInDBBase(PsychologistBase):
    id: str
    user_id: str
    rating: float
    reviews_count: int

    class Config:
        from_attributes = True

class Psychologist(PsychologistInDBBase):
    user: User