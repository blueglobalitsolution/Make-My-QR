from django.db import models
from django.contrib.auth.models import User
from qrcodes.models import QRCode

class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans', null=True, blank=True)
    qrcode = models.ForeignKey(QRCode, on_delete=models.SET_NULL, null=True, blank=True, related_name='scan_records')
    device_type = models.CharField(max_length=50, null=True, blank=True) # PC, Mobile, Tablet, Bot
    os_family = models.CharField(max_length=50, null=True, blank=True) # iOS, Android, Windows, Mac
    browser = models.CharField(max_length=50, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    country = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    visitor_name = models.CharField(max_length=255, null=True, blank=True)
    visitor_email = models.EmailField(null=True, blank=True, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        qr_name = self.qrcode.name if self.qrcode else "Deleted QR"
        return f"Scan for {qr_name} at {self.timestamp}"
