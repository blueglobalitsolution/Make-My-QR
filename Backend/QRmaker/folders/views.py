from rest_framework import viewsets, permissions
from .models import Folder
from .serializers import FolderSerializer

class FolderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FolderSerializer

    def get_queryset(self):
        from users.subscription_utils import is_subscription_active
        if not is_subscription_active(self.request.user):
            return Folder.objects.none()
        # Users shouldn't see or directly interact with their root folder in lists
        return Folder.objects.filter(user=self.request.user, is_root=False)

    def perform_create(self, serializer):
        from users.subscription_utils import is_subscription_active
        from rest_framework.exceptions import PermissionDenied
        if not is_subscription_active(self.request.user):
             raise PermissionDenied("Trial period expired. Please upgrade to create folders.")

        # Default parent is the user's root folder if none provided
        parent = self.request.data.get('parent')
        if not parent:
            root_folder = Folder.objects.filter(user=self.request.user, is_root=True).first()
            if not root_folder:
                root_folder = Folder.objects.create(user=self.request.user, name=self.request.user.username, is_root=True)
            serializer.save(user=self.request.user, parent=root_folder)
        else:
            serializer.save(user=self.request.user)
