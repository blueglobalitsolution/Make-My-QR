from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import FileResponse, Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import File
from .serializers import FileSerializer
from folders.models import Folder
import os


class FileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def get_permissions(self):
        if self.action in ["retrieve", "download"]:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        from users.subscription_utils import is_subscription_active

        if not is_subscription_active(self.request.user):
            return File.objects.none()
        return File.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        from users.subscription_utils import can_upload_file, is_subscription_active

        uploaded_file = self.request.FILES.get("file")
        if not is_subscription_active(self.request.user):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Trial period expired. Please upgrade your subscription."
            )
        if not can_upload_file(
            self.request.user, uploaded_file.size if uploaded_file else 0
        ):
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "Upload limit reached for your current plan. Please upgrade your subscription."
            )

        file_type = ""
        if uploaded_file:
            # Simple way to get file type from extension
            _, ext = os.path.splitext(uploaded_file.name)
            file_type = ext.replace(".", "").lower()

        # Find or ensure root folder exists
        root_folder, created = Folder.objects.get_or_create(
            user=self.request.user,
            is_root=True,
            defaults={"name": self.request.user.username},
        )

        serializer.save(
            user=self.request.user,
            size=uploaded_file.size if uploaded_file else 0,
            file_type=file_type,
            folder=root_folder,
        )

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        # Return the S3/MinIO URL directly
        return Response({"download_url": file_obj.file.url})


def public_file_view(request, file_id):
    """
    Public endpoint to serve files through a backend proxy.
    This avoids direct exposure of S3/MinIO URLs and handles internal network resolution.
    """
    file_obj = get_object_or_404(File, id=file_id)

    if not file_obj.file:
        raise Http404("File not found")

    # Access Control:
    # 1. Allow if the file is explicitly marked as public
    # 2. Allow if the current requester is the owner of the file
    is_owner = request.user.is_authenticated and request.user == file_obj.user
    
    if not file_obj.is_public and not is_owner:
        raise Http404("File not found")

    # Check if the owner's subscription is still active (only for public access)
    if not is_owner:
        from users.subscription_utils import is_subscription_active
        if not is_subscription_active(file_obj.user):
            raise Http404("Subscription expired or account inactive")

    try:
        return HttpResponseRedirect(file_obj.file.url)
    except Exception as e:
        print(f"Error serving file {file_id}: {e}")
        raise Http404("Unable to serve file")
