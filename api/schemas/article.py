```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .user import User

class ArticleBase(BaseModel):
    title: str
    preview: Optional[str] = None
    content: str
    image: Optional[str] = None
    tags: List[str] = []
    status: str = "draft"
    institution_id: Optional[str] = None
    psychologist_id: Optional[str] = None

class ArticleCreate(ArticleBase):
    author_id: str

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    preview: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    institution_id: Optional[str] = None
    psychologist_id: Optional[str] = None

class ArticleInDBBase(ArticleBase):
    id: str
    author_id: str
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Article(ArticleInDBBase):
    author: User
```