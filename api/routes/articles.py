```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from datetime import datetime
from api.crud import crud_article
from api.schemas.article import Article, ArticleCreate, ArticleUpdate
from api.core.deps import get_current_user, get_db
from api.models.article import ArticleStatus

router = APIRouter()

@router.get("/", response_model=List[Article])
async def get_articles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    tag: Optional[str] = None,
    author_id: Optional[str] = None,
    institution_id: Optional[str] = None,
    psychologist_id: Optional[str] = None,
    status: Optional[str] = ArticleStatus.PUBLISHED
) -> Any:
    """
    Retrieve articles with optional filtering.
    """
    return crud_article.get_multi(
        db,
        skip=skip,
        limit=limit,
        tag=tag,
        author_id=author_id,
        institution_id=institution_id,
        psychologist_id=psychologist_id,
        status=status
    )

@router.post("/", response_model=Article)
async def create_article(
    *,
    db: Session = Depends(get_db),
    article_in: ArticleCreate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Create new article.
    """
    if current_user.role not in ["admin", "psychologist", "institute"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_article.create(db, obj_in=article_in)

@router.put("/{article_id}", response_model=Article)
async def update_article(
    *,
    db: Session = Depends(get_db),
    article_id: str,
    article_in: ArticleUpdate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Update an article.
    """
    article = crud_article.get(db, id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    if current_user.role != "admin" and current_user.id != article.author_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_article.update(db, db_obj=article, obj_in=article_in)

@router.post("/{article_id}/publish", response_model=Article)
async def publish_article(
    *,
    db: Session = Depends(get_db),
    article_id: str,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Publish an article.
    """
    article = crud_article.get(db, id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    if current_user.role != "admin" and current_user.id != article.author_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_article.publish(db, db_obj=article)

@router.post("/{article_id}/archive", response_model=Article)
async def archive_article(
    *,
    db: Session = Depends(get_db),
    article_id: str,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Archive an article.
    """
    article = crud_article.get(db, id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    if current_user.role != "admin" and current_user.id != article.author_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_article.archive(db, db_obj=article)
```