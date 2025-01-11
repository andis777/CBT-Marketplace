from api.crud.base import CRUDBase
from api.models.client import Client
from api.schemas.client import ClientCreate, ClientUpdate

class CRUDClient(CRUDBase[Client, ClientCreate, ClientUpdate]):
    pass

crud_client = CRUDClient(Client)