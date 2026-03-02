from rest_framework import viewsets, permissions
from .models import Folder
from .serializers import FolderSerializer

class FolderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FolderSerializer

    def get_queryset(self):
        # Users shouldn't see or directly interact with their root folder in lists
        return Folder.objects.filter(user=self.request.user, is_root=False)

    def perform_create(self, serializer):
        # Default parent is the user's root folder if none provided
        parent = self.request.data.get('parent')
        if not parent:
            root_folder = Folder.objects.filter(user=self.request.user, is_root=True).first()
            if not root_folder:
                root_folder = Folder.objects.create(user=self.request.user, name=self.request.user.username, is_root=True)
            serializer.save(user=self.request.user, parent=root_folder)
        else:
            serializer.save(user=self.request.user)
