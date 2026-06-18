from django.contrib import admin
from .models import SiteVisit

@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'page_url', 'visited_at')
    list_filter = ('visited_at',)
    search_fields = ('ip_address', 'page_url')
