from django.db import models
from django.contrib.auth.models import User
from folders.models import Folder

class QRCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='qrcodes')
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name='qrcodes')
    type = models.CharField(max_length=20) # qr, barcode
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    value = models.TextField()
    short_slug = models.CharField(max_length=50, unique=True, null=True, blank=True)
    is_dynamic = models.BooleanField(default=False)
    scans = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='active')
    settings = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
