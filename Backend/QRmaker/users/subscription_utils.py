from django.utils import timezone
from payments.models import UserSubscription


def get_subscription(user):
    # Superadmin: assign/return Godmode plan
    if user.is_superuser:
        from payments.models import SubscriptionPlan

        godmode = SubscriptionPlan.objects.filter(name="Godmode").first()
        if godmode:
            sub, _ = UserSubscription.objects.get_or_create(
                user=user,
                defaults={
                    "plan": godmode,
                    "expiry_date": None,
                    "is_active": True,
                    "status": "paid_active",
                },
            )
            if sub.plan != godmode:
                sub.plan = godmode
                sub.save(update_fields=["plan"])
            return sub
    try:
        return UserSubscription.objects.get(user=user)
    except UserSubscription.DoesNotExist:
        return None


def is_subscription_active(user):
    if user.is_superuser:
        return True
    if not user.is_authenticated:
        return False

    sub = get_subscription(user)
    if not sub:
        # Auto-grant trial for normal users without subscription
        from payments.models import SubscriptionPlan

        trial_plan = SubscriptionPlan.objects.filter(name="Trial").first()
        if trial_plan:
            UserSubscription.objects.create(
                user=user,
                plan=trial_plan,
                expiry_date=timezone.now() + timezone.timedelta(days=7),
                is_active=True,
            )
            return True
        return False

    # Refresh status dynamically
    sub.refresh_status()

    # If it is explicitly inactive or expired
    if not sub.is_active or sub.status in ["trial_expired"]:
        return False

    return True


def can_create_qr(user):
    if user.is_superuser:
        return True

    if not is_subscription_active(user):
        return False
    sub = get_subscription(user)
    if not sub or not sub.plan:
        return False
    from qrcodes.models import QRCode

    current_count = QRCode.objects.filter(user=user).count()
    if current_count >= sub.plan.qr_limit:
        return False
    return True


def can_upload_file(user, file_size_bytes):
    if user.is_superuser:
        return True

    if not is_subscription_active(user):
        return False
    sub = get_subscription(user)
    if not sub or not sub.plan:
        return False
    limit_bytes = sub.plan.upload_limit_mb * 1024 * 1024
    if file_size_bytes > limit_bytes:
        return False
    return True
