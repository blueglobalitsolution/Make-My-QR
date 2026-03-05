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
        # Always use backend port 8010 for the redirect URL
        return f"http://192.168.1.208:8010/r/{obj.short_slug}"

    def get_file_url(self, obj):
        """Get direct file URL for file-type QR codes"""
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
                    return f"http://192.168.1.208:8010{file_obj.file.url}"
            except File.DoesNotExist:
                pass

        # Use stored URL
        if file_url:
            if file_url.startswith("/media/"):
                return f"http://192.168.1.208:8010{file_url}"
            return file_url

        return None

    def get_file_url(self, obj):
        """Get direct file URL for file-type QR codes"""
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
                    return f"http://192.168.1.208:8010{file_obj.file.url}"
            except File.DoesNotExist:
                pass

        # Use stored URL
        if file_url:
            if file_url.startswith("/media/"):
                return f"http://192.168.1.208:8010{file_url}"
            return file_url

        return None
