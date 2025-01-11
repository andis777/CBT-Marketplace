from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from api.crud import crud_psychologist
from api.schemas.psychologist import Psychologist, PsychologistCreate, PsychologistUpdate
from api.core.deps import get_current_user, get_db

router = APIRouter()

@router.get("/", response_model=List[Psychologist])
async def get_psychologists(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    specialization: Optional[str] = None,
    city: Optional[str] = None,
    min_rating: Optional[float] = None,
) -> Any:
    """
    Retrieve psychologists with optional filtering.
    """
    return crud_psychologist.get_multi(
        db,
        skip=skip,
        limit=limit,
        specialization=specialization,
        city=city,
        min_rating=min_rating
    )

@router.get("/{psychologist_id}", response_model=Psychologist)
async def get_psychologist(
    psychologist_id: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific psychologist by ID.
    """
    psychologist = crud_psychologist.get(db, id=psychologist_id)
    if not psychologist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Psychologist not found"
        )
    return psychologist

@router.post("/", response_model=Psychologist)
async def create_psychologist(
    *,
    db: Session = Depends(get_db),
    psychologist_in: PsychologistCreate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Create new psychologist profile.
    """
    if current_user.role != "admin" and current_user.id != psychologist_in.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_psychologist.create(db, obj_in=psychologist_in)

@router.put("/{psychologist_id}", response_model=Psychologist)
async def update_psychologist(
    *,
    db: Session = Depends(get_db),
    psychologist_id: str,
    psychologist_in: PsychologistUpdate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Update a psychologist profile.
    """
    psychologist = crud_psychologist.get(db, id=psychologist_id)
    if not psychologist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Psychologist not found"
        )
    if current_user.role != "admin" and current_user.id != psychologist.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_psychologist.update(db, db_obj=psychologist, obj_in=psychologist_in)