from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from api.crud import crud_user, crud_psychologist, crud_institution
from api.schemas.user import User
from api.core.deps import get_current_user, get_db

router = APIRouter()

@router.get("/users", response_model=List[User])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all users. Only for admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_user.get_multi(db, skip=skip, limit=limit)

@router.post("/verify-psychologist/{psychologist_id}")
async def verify_psychologist(
    psychologist_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> Any:
    """
    Verify a psychologist. Only for admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    psychologist = crud_psychologist.get(db, id=psychologist_id)
    if not psychologist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Psychologist not found"
        )
    user = crud_user.get(db, id=psychologist.user_id)
    return crud_user.update(db, db_obj=user, obj_in={"is_verified": True})

@router.post("/verify-institution/{institution_id}")
async def verify_institution(
    institution_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> Any:
    """
    Verify an institution. Only for admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    institution = crud_institution.get(db, id=institution_id)
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    return crud_institution.update(db, db_obj=institution, obj_in={"is_verified": True})