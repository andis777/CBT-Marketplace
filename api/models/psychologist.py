from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from api.db.base_class import Base

class Psychologist(Base):
    __tablename__ = "psychologists"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    description = Column(Text)
    experience = Column(Integer)
    institution_id = Column(String, ForeignKey("institutions.id"))
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    specializations = Column(JSON)  # List of specializations
    languages = Column(JSON)  # List of languages
    memberships = Column(JSON)  # List of professional memberships
    education = Column(JSON)  # List of education details
    certifications = Column(JSON)  # List of certifications
    gallery = Column(JSON)  # List of image URLs
    location = Column(JSON)  # {country: str, city: str}
    contacts = Column(JSON)  # Contact information

    user = relationship("User", backref="psychologist_profile")
    institution = relationship("Institution", backref="psychologists")