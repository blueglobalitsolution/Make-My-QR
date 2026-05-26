from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from folders.models import Folder
from functools import lru_cache


class GatekeeperConfig(models.Model):
    CATEGORY_CHOICES = [
        ('website', 'Website'),
        ('whatsapp', 'WhatsApp'),
        ('pdf', 'PDF'),
        ('business', 'Business'),
        ('file', 'File'),
        ('default', 'Default'),
    ]

    category = models.CharField(max_length=50, unique=True, choices=CATEGORY_CHOICES)
    password_enabled = models.BooleanField(default=True, help_text="Allow password protection for this category")
    lead_capture_enabled = models.BooleanField(default=True, help_text="Allow lead capture for this category")
    timer_enabled = models.BooleanField(default=False, help_text="Auto-redirect timer for categories without a button")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Gatekeeper Config"
        verbose_name_plural = "Gatekeeper Configs"

    def __str__(self):
        return f"{self.get_category_display()} - Pass:{self.password_enabled} Lead:{self.lead_capture_enabled} Timer:{self.timer_enabled}"

    @classmethod
    @lru_cache(maxsize=32)
    def get_config(cls, category):
        """Get config for a category, returns dict with defaults if not found."""
        try:
            config = cls.objects.get(category=category)
            return {
                'password_enabled': config.password_enabled,
                'lead_capture_enabled': config.lead_capture_enabled,
                'timer_enabled': config.timer_enabled,
            }
        except cls.DoesNotExist:
            return {
                'password_enabled': True,
                'lead_capture_enabled': True,
                'timer_enabled': False,
            }


class QRCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="qrcodes")
    folder = models.ForeignKey(
        Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name="qrcodes"
    )
    type = models.CharField(max_length=20)  # qr, barcode
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    value = models.TextField()
    short_slug = models.CharField(max_length=50, unique=True, null=True, blank=True, db_index=True)
    is_dynamic = models.BooleanField(default=False)
    is_protected = models.BooleanField(default=False)
    is_lead_capture = models.BooleanField(default=False)
    scans = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default="active", db_index=True)
    settings = models.JSONField(null=True, blank=True)
    show_preview = models.BooleanField(default=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return self.name

    def set_password(self, raw_password):
        if raw_password:
            self.password = make_password(raw_password)
        else:
            self.password = None

    def check_password(self, raw_password):
        if not self.password:
            return False
        return check_password(raw_password, self.password)
