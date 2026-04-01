from django.db import models
from django.contrib.auth.models import User

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_months = models.IntegerField()
    features = models.JSONField(default=list)
    qr_limit = models.IntegerField(default=5)
    can_create_dynamic = models.BooleanField(default=False)
    can_create_pdf = models.BooleanField(default=False)
    can_create_business = models.BooleanField(default=False)
    can_password_protect = models.BooleanField(default=False)
    can_lead_capture = models.BooleanField(default=False)
    can_access_analytics = models.BooleanField(default=False)
    upload_limit_mb = models.IntegerField(default=5)  # Default 5MB for free
    is_lifetime = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class PaymentOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_orders')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=255, unique=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.razorpay_order_id} - {self.status}"

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('trial_active', 'Trial Active'),
        ('trial_expired', 'Trial Expired'),
        ('grace_period', 'Grace Period'),
        ('payment_pending', 'Payment Pending'),
        ('paid_active', 'Paid Active'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial_active')
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
                plan=self.plan
            )

    def refresh_status(self):
        """Update status based on current time, expiry date, and grace period."""
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        old_status = self.status
        
        # 24-hour Grace Period logic
        grace_expiry = None
        if self.expiry_date:
            grace_expiry = self.expiry_date + timedelta(hours=24)

        if self.plan and 'trial' in self.plan.name.lower():
            if self.expiry_date and self.expiry_date < now:
                if grace_expiry and now < grace_expiry:
                    self.status = 'grace_period'
                    self.is_active = True
                else:
                    self.status = 'trial_expired'
                    self.is_active = False
            else:
                self.status = 'trial_active'
                self.is_active = True
        elif self.plan:
             # Paid plans also get a 24h grace period if they expire (re-subscription gap)
             if self.expiry_date and self.expiry_date < now and not self.plan.is_lifetime:
                if grace_expiry and now < grace_expiry:
                    self.status = 'grace_period'
                    self.is_active = True
                else:
                    self.status = 'trial_expired' # Generic lock
                    self.is_active = False
             else:
                self.status = 'paid_active'
                self.is_active = True
        
        if self.status != old_status:
            self.log_transition(old_status, self.status)
            self.save()
        else:
            self.save(update_fields=['is_active']) # Always ensure activity bit is synced

    def update_subscription(self, plan):
        from django.utils import timezone
        from datetime import timedelta
        
        old_status = self.status
        self.plan = plan
        current_now = timezone.now()
        
        # Handle lifetime plans
        if plan.is_lifetime:
            self.expiry_date = None
            self.status = 'paid_active'
        else:
            # If already active and not expired, extend from expiry date, otherwise from now
            if self.expiry_date and self.expiry_date > current_now:
                self.expiry_date = self.expiry_date + timedelta(days=plan.duration_months * 30)
            else:
                self.expiry_date = current_now + timedelta(days=plan.duration_months * 30)
            
            self.status = 'paid_active'
            
        self.is_active = True
        self.purchase_count += 1
        self.log_transition(old_status, self.status)
        self.save()

class SubscriptionAuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_logs')
    old_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.old_status} -> {self.new_status} at {self.timestamp}"
