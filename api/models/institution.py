from sqlalchemy import Column, String, Integer, Boolean, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from api.db.base_class import Base

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    description = Column(Text)
    address = Column(String)
    psychologists_count = Column(Integer, default=0)
    services = Column(JSON)  # List of services/programs
    contacts = Column(JSON)  # Contact information
    is_verified = Column(Boolean, default=False)

    user = relationship("User", backref="institution_profile")