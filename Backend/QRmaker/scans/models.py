from django.db import models
from qrcodes.models import QRCode

class Scan(models.Model):
    qrcode = models.ForeignKey(QRCode, on_delete=models.CASCADE, related_name='scan_records')
    device_type = models.CharField(max_length=50, null=True, blank=True) # PC, Mobile, Tablet, Bot
    os_family = models.CharField(max_length=50, null=True, blank=True) # iOS, Android, Windows, Mac
    browser = models.CharField(max_length=50, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    visitor_name = models.CharField(max_length=255, null=True, blank=True)
    visitor_email = models.EmailField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Scan for {self.qrcode.name} at {self.timestamp}"
