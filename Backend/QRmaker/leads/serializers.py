from rest_framework import serializers
from .models import WebsiteLead

class WebsiteLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteLead
        fields = '__all__'
        read_only_fields = ('ip_address', 'created_at')

class WebsiteLeadCaptureSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=255)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True, max_length=50)
    qr_type = serializers.CharField(required=False, allow_blank=True, default='', max_length=50)
    qr_value = serializers.CharField(required=False, allow_blank=True, default='')
