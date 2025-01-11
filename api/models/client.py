from sqlalchemy import Column, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from api.db.base_class import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    preferences = Column(JSON)  # Client preferences
    saved_psychologists = Column(JSON)  # List of saved psychologist IDs
    saved_institutions = Column(JSON)  # List of saved institution IDs

    user = relationship("User", backref="client_profile")