from django.db import models

class WebsiteLead(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    qr_type = models.CharField(max_length=50, blank=True, default='')
    qr_value = models.TextField(blank=True, default='')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
