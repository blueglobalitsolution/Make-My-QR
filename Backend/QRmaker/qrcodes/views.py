from rest_framework import viewsets, permissions
from .models import QRCode
from .serializers import QRCodeSerializer

class QRCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QRCodeSerializer

    def get_queryset(self):
        return QRCode.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
