from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from api.models import User, Institution, Psychologist, Article
import json

class Command(BaseCommand):
    help = 'Load test data into the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading test data...')

        # Load data from fixture
        with open('api/fixtures/initial_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Create users
        for user_data in data['users']:
            fields = user_data['fields']
            fields['password'] = make_password('password123')  # Set a default password
            User.objects.create(**fields)

        # Create institutions
        for inst_data in data['institutions']:
            fields = inst_data['fields']
            fields['user'] = User.objects.get(pk=fields['user'])
            Institution.objects.create(**fields)

        # Create psychologists
        for psych_data in data['psychologists']:
            fields = psych_data['fields']
            fields['user'] = User.objects.get(pk=fields['user'])
            fields['institution'] = Institution.objects.get(pk=fields['institution'])
            Psychologist.objects.create(**fields)

        # Create articles
        for article_data in data['articles']:
            fields = article_data['fields']
            fields['author'] = User.objects.get(pk=fields['author'])
            Article.objects.create(**fields)

        self.stdout.write(self.style.SUCCESS('Successfully loaded test data'))