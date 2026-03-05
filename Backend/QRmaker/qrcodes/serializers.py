from rest_framework import serializers
from .models import QRCode
from files.models import File
from django.conf import settings
import json
import os


class QRCodeSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = QRCode
        fields = "__all__"
        read_only_fields = ("user", "scans", "created_at")

    def get_short_url(self, obj):
        # Use BACKEND_URL from settings
        # If BACKEND_URL starts with http, use it. Otherwise, return relative.
        base = getattr(settings, 'BACKEND_URL', '')
        if not base.startswith('http'):
            return f"/r/{obj.short_slug}"
        return f"{base.rstrip('/')}/r/{obj.short_slug}"

    def get_file_url(self, obj):
        """Get relative file URL for file-type QR codes to work via proxy/same-origin"""
        if obj.category not in ["file", "pdf", "document"]:
            return None

        # Try to get file ID from value
        file_id = None
        file_url = None

        try:
            value_data = json.loads(obj.value)
            if isinstance(value_data, dict):
                file_id = value_data.get("file_id")
        except (json.JSONDecodeError, TypeError):
            if obj.value and obj.value.isdigit():
                file_id = int(obj.value)
            elif obj.value and ("/media/" in obj.value or obj.value.startswith("http")):
                file_url = obj.value

        # Get file by ID
        if file_id:
            try:
                file_obj = File.objects.get(id=file_id)
                if file_obj.file:
                    return file_obj.file.url # This is relative /media/...
            except File.DoesNotExist:
                pass

        # Use stored URL
        if file_url:
            return file_url

        return None
