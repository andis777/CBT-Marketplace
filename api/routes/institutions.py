from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from api.crud import crud_institution
from api.schemas.institution import Institution, InstitutionCreate, InstitutionUpdate
from api.core.deps import get_current_user, get_db

router = APIRouter()

@router.get("/", response_model=List[Institution])
async def get_institutions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    is_verified: Optional[bool] = None,
) -> Any:
    """
    Retrieve institutions with optional filtering.
    """
    return crud_institution.get_multi(
        db,
        skip=skip,
        limit=limit,
        city=city,
        is_verified=is_verified
    )

@router.get("/{institution_id}", response_model=Institution)
async def get_institution(
    institution_id: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific institution by ID.
    """
    institution = crud_institution.get(db, id=institution_id)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    return institution

@router.post("/", response_model=Institution)
async def create_institution(
    *,
    db: Session = Depends(get_db),
    institution_in: InstitutionCreate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Create new institution profile.
    """
    if current_user.role != "admin" and current_user.id != institution_in.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_institution.create(db, obj_in=institution_in)

@router.put("/{institution_id}", response_model=Institution)
async def update_institution(
    *,
    db: Session = Depends(get_db),
    institution_id: str,
    institution_in: InstitutionUpdate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    Update an institution profile.
    """
    institution = crud_institution.get(db, id=institution_id)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    if current_user.role != "admin" and current_user.id != institution.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_institution.update(db, db_obj=institution, obj_in=institution_in)