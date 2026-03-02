from rest_framework import viewsets, permissions
from .models import QRCode
from .serializers import QRCodeSerializer
from folders.models import Folder

class QRCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QRCodeSerializer

    def get_queryset(self):
        return QRCode.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        folder = self.request.data.get('folder')
        if not folder:
            root_folder = Folder.objects.filter(user=self.request.user, is_root=True).first()
            if not root_folder:
                root_folder = Folder.objects.create(user=self.request.user, name=self.request.user.username, is_root=True)
            serializer.save(user=self.request.user, folder=root_folder)
        else:
            serializer.save(user=self.request.user)
