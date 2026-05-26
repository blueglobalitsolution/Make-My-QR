from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payments'

    def ready(self):
        from .models import SubscriptionPlan
        # Cleanup old seed plans (IDs 1-9, 101 — from the deleted seed_plans.py)
        old_seed_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 101]
        SubscriptionPlan.objects.filter(id__in=old_seed_ids).delete()

        # Trial Plan — for new customer users
        SubscriptionPlan.objects.get_or_create(
            name="Trial",
            defaults={
                "price": 0,
                "duration_months": 0,
                "is_trial": True,
                "is_lifetime": False,
                "qr_limit": 100,
                "upload_limit_mb": 50,
                "can_create_dynamic": True,
                "can_create_pdf": True,
                "can_create_business": True,
                "can_password_protect": True,
                "can_lead_capture": True,
                "can_access_analytics": True,
            }
        )
        # Godmode Plan — for superadmin only
        SubscriptionPlan.objects.get_or_create(
            name="Godmode",
            defaults={
                "price": 0,
                "duration_months": 0,
                "is_trial": False,
                "is_lifetime": True,
                "qr_limit": 999999,
                "upload_limit_mb": 999,
                "can_create_dynamic": True,
                "can_create_pdf": True,
                "can_create_business": True,
                "can_password_protect": True,
                "can_lead_capture": True,
                "can_access_analytics": True,
            }
        )
