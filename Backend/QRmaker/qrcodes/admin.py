from django.contrib import admin
from .models import QRCode, GatekeeperConfig


class GatekeeperConfigAdmin(admin.ModelAdmin):
    list_display = ['category', 'password_enabled', 'lead_capture_enabled', 'timer_enabled', 'updated_at']
    list_editable = ['password_enabled', 'lead_capture_enabled', 'timer_enabled']
    list_display_links = ['category']


admin.site.register(QRCode)
admin.site.register(GatekeeperConfig, GatekeeperConfigAdmin)
