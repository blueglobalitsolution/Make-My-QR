from django.db import models
from django.contrib.auth.models import User
from folders.models import Folder

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='files', null=True, blank=True)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='user_files/%Y/%m/%d/')
    file_type = models.CharField(max_length=50, blank=True) # e.g., pdf, image
    size = models.BigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
