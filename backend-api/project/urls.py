from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # APIs
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/', include('apps.reports.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Personalización del admin
admin.site.site_header = 'TeCuiApp Administración'
admin.site.site_title = 'TeCuiApp'
admin.site.index_title = 'Panel de Administración'
