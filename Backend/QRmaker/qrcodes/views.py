from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import QRCode
from .serializers import QRCodeSerializer
from folders.models import Folder
from files.models import File
from hashids import Hashids
from django.conf import settings
import json


class QRCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QRCodeSerializer

    def get_queryset(self):
        return QRCode.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        folder = self.request.data.get("folder")
        if not folder:
            root_folder = Folder.objects.filter(
                user=self.request.user, is_root=True
            ).first()
            if not root_folder:
                root_folder = Folder.objects.create(
                    user=self.request.user,
                    name=self.request.user.username,
                    is_root=True,
                )
            instance = serializer.save(user=self.request.user, folder=root_folder)
        else:
            instance = serializer.save(user=self.request.user)

        # Generate short_slug using Hashids
        hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
        instance.short_slug = hashids.encode(instance.id)
        instance.save(update_fields=["short_slug"])

    def create(self, request, *args, **kwargs):
        # Override create to ensure response has the slug
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Refresh data from instance
        instance = serializer.instance
        result_serializer = self.get_serializer(instance)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def create_for_file(self, request):
        """Create a QR code for an existing file."""
        file_id = request.data.get("file_id")
        if not file_id:
            return Response(
                {"error": "file_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            file_obj = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response(
                {"error": "File not found"}, status=status.HTTP_404_NOT_FOUND
            )

        folder_id = request.data.get("folder")
        if folder_id:
            folder = Folder.objects.filter(id=folder_id, user=request.user).first()
        else:
            folder = Folder.objects.filter(user=request.user, is_root=True).first()
            if not folder:
                folder = Folder.objects.create(
                    user=request.user, name=request.user.username, is_root=True
                )

        # Create QR code with file reference
        qr_code = QRCode.objects.create(
            user=request.user,
            folder=folder,
            type="qr",
            category="file",
            name=request.data.get("name", file_obj.name),
            value=json.dumps(
                {
                    "file_id": file_obj.id,
                    "file_name": file_obj.name,
                    "file_type": file_obj.file_type,
                }
            ),
            is_dynamic=True,
            status="active",
        )

        # Generate short_slug
        hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
        qr_code.short_slug = hashids.encode(qr_code.id)
        qr_code.save(update_fields=["short_slug"])

        serializer = self.get_serializer(qr_code)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PublicQRCodeView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = QRCodeSerializer
    lookup_field = "short_slug"
    queryset = QRCode.objects.filter(status="active")
