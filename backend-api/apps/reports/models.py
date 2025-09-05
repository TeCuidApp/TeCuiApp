from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator

class Report(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('submitted', 'Enviado'),
        ('in_review', 'En Revisión'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
    ]
    
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('financial', 'Financiero'),
        ('maintenance', 'Mantenimiento'),
        ('security', 'Seguridad'),
        ('complaint', 'Queja'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Reporte'
        verbose_name_plural = 'Reportes'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title