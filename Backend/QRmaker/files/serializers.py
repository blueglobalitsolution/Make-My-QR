from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = (
            "id",
            "name",
            "file",
            "file_type",
            "size",
            "created_at",
            "file_url",
            "folder",
        )
        read_only_fields = ("size", "file_type", "user", "created_at")

    def get_file_url(self, obj):
        if obj.file:
            return f"/api/files/public/{obj.id}/"
        return None

    def validate_file(self, file):
        # Define a maximum file size (e.g., 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if file.size > max_size:
            raise serializers.ValidationError(
                f"File size exceeds {max_size} bytes limit"
            )
        return file
