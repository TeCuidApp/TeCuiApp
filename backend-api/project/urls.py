from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Aquí agregaremos las URLs de las APIs después
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Personalizar admin
admin.site.site_header = 'Sociedad App Admin'
admin.site.site_title = 'Sociedad App'
admin.site.index_title = 'Panel de Administración'