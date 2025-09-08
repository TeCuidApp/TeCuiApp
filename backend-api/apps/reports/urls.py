from django.urls import path
from . import views

app_name = 'reports'

urlpatterns = [
    # CRUD de reportes
    path('reports/', views.ReportListCreateView.as_view(), name='report-list-create'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    
    # Vistas específicas
    path('reports/my/', views.MyReportsView.as_view(), name='my-reports'),
    path('reports/stats/', views.report_stats, name='report-stats'),
]