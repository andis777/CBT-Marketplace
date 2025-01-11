from sqlalchemy.orm import Session
from api.core.config import settings
from api.crud import crud_user
from api.schemas.user import UserCreate
from api.models.user import UserRole

def init_db(db: Session) -> None:
    # Create initial admin user
    admin = crud_user.get_by_email(db, email="admin@кпт.рф")
    if not admin:
        user_in = UserCreate(
            email="admin@kpt.ru",
            password="admin123",
            name="Администратор",
            role=UserRole.ADMIN,
            is_verified=True
        )
        crud_user.create(db, obj_in=user_in)