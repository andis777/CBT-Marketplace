from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, InstitutionViewSet, PsychologistViewSet,
    ClientViewSet, ArticleViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'institutions', InstitutionViewSet)
router.register(r'psychologists', PsychologistViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]