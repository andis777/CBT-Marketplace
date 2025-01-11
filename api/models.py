from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Администратор'),
        ('psychologist', 'Психолог'),
        ('institute', 'Учебное заведение'),
        ('client', 'Клиент'),
    )

    name = models.CharField('Имя', max_length=255)
    email = models.EmailField('Email', unique=True)
    role = models.CharField('Роль', max_length=20, choices=ROLE_CHOICES)
    avatar = models.URLField('Аватар', blank=True)
    is_active = models.BooleanField('Активен', default=True)
    is_verified = models.BooleanField('Верифицирован', default=False)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.name

class Institution(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='institution')
    name = models.CharField('Название', max_length=255)
    description = models.TextField('Описание')
    avatar = models.URLField('Логотип')
    address = models.TextField('Адрес')
    psychologists_count = models.IntegerField('Количество специалистов', default=0)
    services = models.JSONField('Услуги', default=list)
    contacts = models.JSONField('Контакты', default=dict)
    is_verified = models.BooleanField('Верифицирован', default=False)

    class Meta:
        verbose_name = 'Учебное заведение'
        verbose_name_plural = 'Учебные заведения'

    def __str__(self):
        return self.name

class Psychologist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='psychologist')
    description = models.TextField('Описание')
    experience = models.IntegerField('Опыт работы (лет)')
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True, related_name='psychologists')
    rating = models.FloatField('Рейтинг', validators=[MinValueValidator(0), MaxValueValidator(5)], default=0)
    reviews_count = models.IntegerField('Количество отзывов', default=0)
    specializations = models.JSONField('Специализации', default=list)
    languages = models.JSONField('Языки', default=list)
    memberships = models.JSONField('Членство в организациях', default=list)
    education = models.JSONField('Образование', default=list)
    certifications = models.JSONField('Сертификаты', default=list)
    gallery = models.JSONField('Галерея', default=list)
    location = models.JSONField('Местоположение', default=dict)
    contacts = models.JSONField('Контакты', default=dict)

    class Meta:
        verbose_name = 'Психолог'
        verbose_name_plural = 'Психологи'

    def __str__(self):
        return self.user.name

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client')
    preferences = models.JSONField('Предпочтения', default=dict)
    saved_psychologists = models.JSONField('Сохраненные психологи', default=list)
    saved_institutions = models.JSONField('Сохраненные учреждения', default=list)

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'

    def __str__(self):
        return self.user.name

class Article(models.Model):
    title = models.CharField('Заголовок', max_length=255)
    preview = models.TextField('Превью')
    content = models.TextField('Содержание')
    image = models.URLField('Изображение')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    views = models.IntegerField('Просмотры', default=0)
    tags = models.JSONField('Теги', default=list)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
        ordering = ['-created_at']

    def __str__(self):
        return self.title