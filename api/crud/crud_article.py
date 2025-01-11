```python
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from api.crud.base import CRUDBase
from api.models.article import Article, ArticleStatus
from api.schemas.article import ArticleCreate, ArticleUpdate

class CRUDArticle(CRUDBase[Article, ArticleCreate, ArticleUpdate]):
    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        tag: Optional[str] = None,
        author_id: Optional[str] = None,
        institution_id: Optional[str] = None,
        psychologist_id: Optional[str] = None,
        status: Optional[str] = ArticleStatus.PUBLISHED
    ) -> List[Article]:
        query = db.query(self.model)
        
        if tag:
            query = query.filter(self.model.tags.contains([tag]))
        
        if author_id:
            query = query.filter(self.model.author_id == author_id)
            
        if institution_id:
            query = query.filter(self.model.institution_id == institution_id)
            
        if psychologist_id:
            query = query.filter(self.model.psychologist_id == psychologist_id)
            
        if status:
            query = query.filter(self.model.status == status)
        
        return query.offset(skip).limit(limit).all()

    def publish(
        self,
        db: Session,
        *,
        db_obj: Article,
    ) -> Article:
        db_obj.status = ArticleStatus.PUBLISHED
        db_obj.published_at = datetime.utcnow()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def archive(
        self,
        db: Session,
        *,
        db_obj: Article,
    ) -> Article:
        db_obj.status = ArticleStatus.ARCHIVED
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_article = CRUDArticle(Article)
```