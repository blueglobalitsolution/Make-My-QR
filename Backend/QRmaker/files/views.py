from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import File
from .serializers import FileSerializer
from folders.models import Folder
import os

class FileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def get_queryset(self):
        return File.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file')
        file_type = ""
        if uploaded_file:
            # Simple way to get file type from extension
            _, ext = os.path.splitext(uploaded_file.name)
            file_type = ext.replace(".", "").lower()

        # Find or ensure root folder exists
        root_folder = Folder.objects.filter(user=self.request.user, is_root=True).first()
        if not root_folder:
            # Fallback if somehow it doesn't exist
            root_folder = Folder.objects.create(user=self.request.user, name=self.request.user.username, is_root=True)

        serializer.save(
            user=self.request.user,
            size=uploaded_file.size if uploaded_file else 0,
            file_type=file_type,
            folder=root_folder
        )

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        # For simplicity in development, return URL.
        # In production this might be a redirect or a direct file stream
        return Response({'download_url': request.build_absolute_uri(file_obj.file.url)})
