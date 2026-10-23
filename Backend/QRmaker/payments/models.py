from django.db import models
from django.contrib.auth.models import User


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_months = models.IntegerField()
    features = models.JSONField(default=list)
    qr_limit = models.IntegerField(default=5)
    can_create_dynamic = models.BooleanField(default=False)
    can_create_pdf = models.BooleanField(default=False)
    can_create_business = models.BooleanField(default=False)
    can_password_protect = models.BooleanField(default=False)
    can_lead_capture = models.BooleanField(default=False)
    can_set_access_limit = models.BooleanField(default=False, help_text="Allow setting max unique user access limit")
    can_access_analytics = models.BooleanField(default=False)
    can_bulk_create = models.BooleanField(
        default=False, help_text="Allow creating many QR codes at once from a CSV or JSON payload"
    )
    bulk_limit = models.IntegerField(
        default=0, help_text="Max QR codes per bulk request (0 = use the plan's qr_limit)"
    )
    can_use_api = models.BooleanField(
        default=False, help_text="Allow programmatic access to the /api/v1/ endpoints with a token"
    )
    api_monthly_quota = models.IntegerField(
        default=0, help_text="API calls allowed per calendar month (0 = API not usable)"
    )
    api_rate_limit = models.IntegerField(
        default=0, help_text="API requests per minute (0 = platform default)"
    )
    upload_limit_mb = models.IntegerField(default=5)  # Default 5MB for free
    is_lifetime = models.BooleanField(default=False)
    is_trial = models.BooleanField(default=False)  # Dedicated flag for trial logic

    def __str__(self):
        return self.name


class CurrencyRate(models.Model):
    """Display-only currency conversion for prices.

    Razorpay settles in INR, so local prices are an approximation of the INR
    charge, not a separate price point. ``rate`` is the number of units of this
    currency per 1 INR.
    """

    ROUNDING_CHOICES = [
        ("nearest_1", "Round to nearest whole number"),
        ("nearest_99", "Round up to .99"),
        ("nearest_5", "Round up to multiple of 5"),
        ("nearest_10", "Round up to multiple of 10"),
        ("exact", "Exact conversion (2 decimals)"),
    ]

    code = models.CharField(max_length=3, unique=True, help_text="ISO 4217 code, e.g. USD")
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=8, default="")
    rate = models.DecimalField(
        max_digits=14,
        decimal_places=6,
        default=0,
        help_text="Units of this currency per 1 INR (INR itself is 1)",
    )
    rounding = models.CharField(max_length=16, choices=ROUNDING_CHOICES, default="nearest_1")
    countries = models.JSONField(
        default=list,
        blank=True,
        help_text="ISO 3166-1 alpha-2 country codes shown this currency",
    )
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code"]
        verbose_name = "Currency rate"
        verbose_name_plural = "Currency rates"

    def __str__(self):
        return f"{self.code} ({self.symbol})"


class PaymentOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="payment_orders"
    )
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=255, unique=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.razorpay_order_id} - {self.status}"


class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ("trial_active", "Trial Active"),
        ("trial_expired", "Trial Expired"),
        ("grace_period", "Grace Period"),
        ("payment_pending", "Payment Pending"),
        ("paid_active", "Paid Active"),
    ]

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="subscription"
    )
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="trial_active"
    )
    start_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    purchase_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name if self.plan else 'No Plan'} ({self.status})"

    def log_transition(self, old_status, new_status):
        if old_status != new_status:
            SubscriptionAuditLog.objects.create(
                user=self.user,
                old_status=old_status,
                new_status=new_status,
                plan=self.plan,
            )

    def refresh_status(self, force=False):
        """Update status based on current time, expiry date, and grace period.

        `force=True` re-evaluates a subscription that is parked in
        `payment_pending`, which is how failed/abandoned checkouts are put back
        into whatever state they were in before the purchase attempt.
        """
        if self.status == "payment_pending" and not force:
            return

        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        old_status = self.status

        # 24-hour Grace Period logic
        grace_expiry = None
        if self.expiry_date:
            grace_expiry = self.expiry_date + timedelta(hours=24)

        if self.plan and self.plan.is_trial:
            if self.expiry_date and self.expiry_date < now:
                if grace_expiry and now < grace_expiry:
                    self.status = "grace_period"
                    self.is_active = True
                else:
                    self.status = "trial_expired"
                    self.is_active = False
            else:
                self.status = "trial_active"
                self.is_active = True
        elif self.plan:
            # Paid plans also get a 24h grace period if they expire (re-subscription gap)
            if (
                self.expiry_date
                and self.expiry_date < now
                and not self.plan.is_lifetime
            ):
                if grace_expiry and now < grace_expiry:
                    self.status = "grace_period"
                    self.is_active = True
                else:
                    self.status = "trial_expired"  # Generic lock
                    self.is_active = False
            else:
                self.status = "paid_active"
                self.is_active = True

        if self.status != old_status:
            self.log_transition(old_status, self.status)
            self.save()

    def update_subscription(self, plan):
        from django.utils import timezone
        from datetime import timedelta

        old_status = self.status
        self.plan = plan
        current_now = timezone.now()

        # Handle lifetime plans
        if plan.is_lifetime:
            self.expiry_date = None
            self.status = "paid_active"
        else:
            # If already active and not expired, extend from expiry date, otherwise from now
            if self.expiry_date and self.expiry_date > current_now:
                self.expiry_date = self.expiry_date + timedelta(
                    days=plan.duration_months * 30
                )
            else:
                self.expiry_date = current_now + timedelta(
                    days=plan.duration_months * 30
                )

            self.status = "paid_active"

        self.is_active = True
        self.purchase_count += 1
        self.log_transition(old_status, self.status)
        self.save()

        # Notify user of subscription update
        try:
            from users.email_utils import send_subscription_notification

            send_subscription_notification(
                to_email=self.user.email,
                name=f"{self.user.first_name} {self.user.last_name}".strip()
                or self.user.username,
                plan_name=self.plan.name,
                status=self.status,
                expiry_date=self.expiry_date,
            )
        except Exception as e:
            print(f"Failed to send subscription notification: {e}")


class SubscriptionAuditLog(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="subscription_logs"
    )
    old_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.old_status} -> {self.new_status} at {self.timestamp}"
