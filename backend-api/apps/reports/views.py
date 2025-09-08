from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Report
from .serializers import ReportSerializer, ReportCreateSerializer

class ReportListCreateView(generics.ListCreateAPIView):
    """
    API para listar y crear reportes
    GET /api/reports/ - Listar reportes
    POST /api/reports/ - Crear reporte
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReportCreateSerializer
        return ReportSerializer
    
    def get_queryset(self):
        """Filtrar reportes según el rol del usuario"""
        user = self.request.user
        queryset = Report.objects.select_related('author')
        
        if user.role == 'admin':
            # Admin ve todos los reportes
            return queryset
        elif user.role == 'member':
            # Miembros ven sus reportes + reportes públicos
            return queryset.filter(
                Q(author=user) | Q(status__in=['approved', 'in_review'])
            )
        else:  # guest
            # Invitados solo ven reportes aprobados
            return queryset.filter(status='approved')
    
    def perform_create(self, serializer):
        """Asignar autor al crear reporte"""
        serializer.save(author=self.request.user)

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API para ver, editar y eliminar reporte específico
    GET /api/reports/{id}/ - Ver reporte
    PUT /api/reports/{id}/ - Editar reporte
    DELETE /api/reports/{id}/ - Eliminar reporte
    """
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Report.objects.select_related('author')
        
        if user.role == 'admin':
            return queryset
        elif user.role == 'member':
            return queryset.filter(
                Q(author=user) | Q(status__in=['approved', 'in_review'])
            )
        else:
            return queryset.filter(status='approved')
    
    def perform_update(self, serializer):
        """Solo el autor o admin puede editar"""
        report = self.get_object()
        user = self.request.user
        
        if user != report.author and user.role != 'admin':
            raise permissions.PermissionDenied("No tienes permisos para editar este reporte")
        
        serializer.save()
    
    def perform_destroy(self, serializer):
        """Solo el autor o admin puede eliminar"""
        report = self.get_object()
        user = self.request.user
        
        if user != report.author and user.role != 'admin':
            raise permissions.PermissionDenied("No tienes permisos para eliminar este reporte")
        
        # En lugar de eliminar, marcar como inactivo
        report.is_active = False
        report.save()

class MyReportsView(generics.ListAPIView):
    """
    API para ver reportes del usuario actual
    GET /api/reports/my/
    """
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Report.objects.filter(
            author=self.request.user,
            is_active=True
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_stats(request):
    """
    API para estadísticas de reportes
    GET /api/reports/stats/
    """
    user = request.user
    
    if user.role == 'admin':
        # Stats globales para admin
        total_reports = Report.objects.filter(is_active=True).count()
        pending_reports = Report.objects.filter(status='submitted', is_active=True).count()
        approved_reports = Report.objects.filter(status='approved', is_active=True).count()
        my_reports = Report.objects.filter(author=user, is_active=True).count()
    else:
        # Stats personales para usuarios normales
        my_reports = Report.objects.filter(author=user, is_active=True).count()
        total_reports = my_reports
        pending_reports = Report.objects.filter(author=user, status='submitted', is_active=True).count()
        approved_reports = Report.objects.filter(author=user, status='approved', is_active=True).count()
    
    return Response({
        'total_reports': total_reports,
        'my_reports': my_reports,
        'pending_reports': pending_reports,
        'approved_reports': approved_reports,
        'user_role': user.role,
    })