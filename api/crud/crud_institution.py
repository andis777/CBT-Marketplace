from typing import List, Optional
from sqlalchemy.orm import Session
from api.crud.base import CRUDBase
from api.models.institution import Institution
from api.schemas.institution import InstitutionCreate, InstitutionUpdate

class CRUDInstitution(CRUDBase[Institution, InstitutionCreate, InstitutionUpdate]):
    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        city: Optional[str] = None,
        is_verified: Optional[bool] = None,
    ) -> List[Institution]:
        query = db.query(self.model)
        
        if city:
            query = query.filter(self.model.address.ilike(f'%{city}%'))
        if is_verified is not None:
            query = query.filter(self.model.is_verified == is_verified)
        
        return query.offset(skip).limit(limit).all()

crud_institution = CRUDInstitution(Institution)