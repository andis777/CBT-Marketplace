from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.orm import relationship
from api.db.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PSYCHOLOGIST = "psychologist"
    INSTITUTION = "institution"
    CLIENT = "client"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    role = Column(Enum(UserRole), nullable=False)
    avatar = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)