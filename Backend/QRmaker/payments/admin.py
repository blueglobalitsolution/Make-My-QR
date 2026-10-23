from django.contrib import admin

from .models import CurrencyRate


@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "symbol", "rate", "rounding", "is_active", "updated_at")
    list_editable = ("rate", "rounding", "is_active")
    search_fields = ("code", "name")
    readonly_fields = ("updated_at",)
