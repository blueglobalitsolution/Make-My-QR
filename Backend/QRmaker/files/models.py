from django.db import models
from django.contrib.auth.models import User
from folders.models import Folder

from django.db.models.signals import post_delete
from django.dispatch import receiver


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="files")
    folder = models.ForeignKey(
        Folder, on_delete=models.SET_NULL, related_name="files", null=True, blank=True
    )
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="user_files/%Y/%m/%d/")
    file_type = models.CharField(max_length=50, blank=True)  # e.g., pdf, image
    size = models.BigIntegerField(default=0)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


@receiver(post_delete, sender=File)
def delete_file_from_storage(sender, instance, **kwargs):
    """Delete actual file from storage when File record is deleted."""
    if instance.file:
        instance.file.delete(save=False)
