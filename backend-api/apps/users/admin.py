from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Info Adicional', {
            'fields': ('phone', 'birth_date', 'address', 'role', 'is_verified')
        }),
    )