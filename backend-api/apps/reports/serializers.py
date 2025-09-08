from rest_framework import serializers
from .models import Report
from apps.users.serializers import UserSerializer

class ReportSerializer(serializers.ModelSerializer):
    """Serializer para reportes"""
    author = UserSerializer(read_only=True)
    author_name = serializers.ReadOnlyField(source='author.full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    category_display = serializers.ReadOnlyField(source='get_category_display')
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'description', 'category', 'category_display',
            'status', 'status_display', 'author', 'author_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def validate_title(self, value):
        """Validar título mínimo"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("El título debe tener al menos 5 caracteres")
        return value.strip()
    
    def validate_description(self, value):
        """Validar descripción mínima"""
        if len(value.strip()) < 20:
            raise serializers.ValidationError("La descripción debe tener al menos 20 caracteres")
        return value.strip()

class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para crear reportes"""
    class Meta:
        model = Report
        fields = ['title', 'description', 'category']
    
    def create(self, validated_data):
        """Crear reporte con autor actual"""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)