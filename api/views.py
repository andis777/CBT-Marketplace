from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import User, Institution, Psychologist, Client, Article
from .serializers import (
    UserSerializer, InstitutionSerializer, PsychologistSerializer,
    ClientSerializer, ArticleSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Institution.objects.all()
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(address__icontains=city)
        return queryset

class PsychologistViewSet(viewsets.ModelViewSet):
    queryset = Psychologist.objects.all()
    serializer_class = PsychologistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Psychologist.objects.all()
        specialization = self.request.query_params.get('specialization', None)
        city = self.request.query_params.get('city', None)
        min_rating = self.request.query_params.get('min_rating', None)

        if specialization:
            queryset = queryset.filter(specializations__contains=[specialization])
        if city:
            queryset = queryset.filter(location__city=city)
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        return queryset

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Article.objects.all()
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__contains=[tag])
        return queryset