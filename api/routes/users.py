from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from api.crud import crud_user
from api.schemas.user import User, UserCreate, UserUpdate
from api.core.deps import get_current_user, get_db

router = APIRouter()

@router.get("/me", response_model=User)
async def read_current_user(
    current_user = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user = Depends(get_current_user),
) -> Any:
    """
    Update current user.
    """
    return crud_user.update(db, db_obj=current_user, obj_in=user_in)

@router.post("/register", response_model=User)
async def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register new user.
    """
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud_user.create(db, obj_in=user_in)