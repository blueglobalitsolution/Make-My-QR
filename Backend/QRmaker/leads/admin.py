from django.contrib import admin
from .models import WebsiteLead

@admin.register(WebsiteLead)
class WebsiteLeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'qr_type', 'ip_address', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('qr_type', 'created_at')
    readonly_fields = ('created_at', 'ip_address')
