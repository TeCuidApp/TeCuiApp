from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer para registro de usuarios"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone', 'birth_date', 'password', 'password_confirm'
        ]
    
    def validate_email(self, value):
        """Validar que el email sea único"""
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado")
        return value
    
    def validate(self, attrs):
        """Validar que las contraseñas coincidan"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs
    
    def create(self, validated_data):
        """Crear usuario con contraseña encriptada"""
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer para login de usuarios"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
                if user.check_password(password):
                    if not user.is_active:
                        raise serializers.ValidationError("Usuario desactivado")
                    attrs['user'] = user
                    return attrs
                else:
                    raise serializers.ValidationError("Credenciales inválidas")
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("Usuario no encontrado")
        else:
            raise serializers.ValidationError("Email y contraseña requeridos")

class UserSerializer(serializers.ModelSerializer):
    """Serializer para información de usuario"""
    full_name = serializers.ReadOnlyField()
    reports_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'birth_date', 'address', 'is_verified',
            'reports_count', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']
    
    def get_reports_count(self, obj):
        """Contar reportes del usuario"""
        return obj.reports.filter(is_active=True).count()