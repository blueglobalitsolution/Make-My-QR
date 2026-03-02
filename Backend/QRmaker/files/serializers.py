from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ('id', 'name', 'file', 'file_type', 'size', 'created_at', 'file_url', 'folder')
        read_only_fields = ('size', 'file_type', 'user', 'created_at')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
