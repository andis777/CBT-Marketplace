```python
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from api.db.base_class import Base

class ArticleStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    preview = Column(Text)
    content = Column(Text, nullable=False)
    image = Column(String)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    views = Column(Integer, default=0)
    tags = Column(JSON)  # List of tags
    status = Column(String, nullable=False, default=ArticleStatus.DRAFT)
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # New relationships
    institution_id = Column(String, ForeignKey("institutions.id"))
    psychologist_id = Column(String, ForeignKey("psychologists.id"))

    author = relationship("User", backref="articles")
    institution = relationship("Institution", backref="articles")
    psychologist = relationship("Psychologist", backref="articles")
```