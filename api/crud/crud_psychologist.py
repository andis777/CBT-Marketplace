from typing import List, Optional
from sqlalchemy.orm import Session
from api.crud.base import CRUDBase
from api.models.psychologist import Psychologist
from api.schemas.psychologist import PsychologistCreate, PsychologistUpdate

class CRUDPsychologist(CRUDBase[Psychologist, PsychologistCreate, PsychologistUpdate]):
    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        specialization: Optional[str] = None,
        city: Optional[str] = None,
        min_rating: Optional[float] = None,
    ) -> List[Psychologist]:
        query = db.query(self.model)
        
        if specialization:
            query = query.filter(self.model.specializations.contains([specialization]))
        if city:
            query = query.filter(self.model.location['city'].astext == city)
        if min_rating is not None:
            query = query.filter(self.model.rating >= min_rating)
        
        return query.offset(skip).limit(limit).all()

crud_psychologist = CRUDPsychologist(Psychologist)