from django.db import models

class SiteVisit(models.Model):
    ip_address = models.GenericIPAddressField(db_index=True)
    user_agent = models.TextField(blank=True, default='')
    page_url = models.CharField(max_length=500, blank=True, default='')
    visited_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-visited_at']

    def __str__(self):
        return f"{self.ip_address} - {self.visited_at.strftime('%Y-%m-%d %H:%M')}"
