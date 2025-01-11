from django.contrib import admin
from .models import User, Institution, Psychologist, Client, Article

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'role', 'is_active', 'is_verified')
    list_filter = ('role', 'is_active', 'is_verified')
    search_fields = ('name', 'email')

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'psychologists_count', 'is_verified')
    list_filter = ('is_verified',)
    search_fields = ('name', 'address')

@admin.register(Psychologist)
class PsychologistAdmin(admin.ModelAdmin):
    list_display = ('name', 'experience', 'rating', 'reviews_count', 'institution')
    list_filter = ('institution',)
    search_fields = ('name',)

    def name(self, obj):
        return obj.user.name if obj.user else ''

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')
    search_fields = ('user__name', 'user__email')

    def name(self, obj):
        return obj.user.name if obj.user else ''
    
    def email(self, obj):
        return obj.user.email if obj.user else ''

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'views', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'content')
    readonly_fields = ('views',)