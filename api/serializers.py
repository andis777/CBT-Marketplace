from rest_framework import serializers
from .models import User, Institution, Psychologist, Client, Article

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'avatar', 'is_verified')

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'

class PsychologistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = Psychologist
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = '__all__'