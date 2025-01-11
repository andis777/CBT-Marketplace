from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from api.crud import crud_client
from api.schemas.client import Client, ClientCreate, ClientUpdate
from api.core.deps import get_current_user, get_db

router = APIRouter()

@router.get("/me", response_model=Client)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
) -> Any:
    """
    Get current client profile.
    """
    if current_user.role != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a client user"
        )
    client = crud_client.get_by_user_id(db, user_id=current_user.id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client profile not found"
        )
    return client

@router.put("/me", response_model=Client)
async def update_my_profile(
    *,
    db: Session = Depends(get_db),
    client_in: ClientUpdate,
    current_user = Depends(get_current_user),
) -> Any:
    """
    Update current client profile.
    """
    if current_user.role != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a client user"
        )
    client = crud_client.get_by_user_id(db, user_id=current_user.id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client profile not found"
        )
    return crud_client.update(db, db_obj=client, obj_in=client_in)