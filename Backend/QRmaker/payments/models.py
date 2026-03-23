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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    purchase_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name if self.plan else 'No Plan'}"

    def update_subscription(self, plan):
        from django.utils import timezone
        from datetime import timedelta
        
        self.plan = plan
        current_now = timezone.now()
        
        # If already active and not expired, extend from expiry date, otherwise from now
        if self.expiry_date and self.expiry_date > current_now:
            self.expiry_date = self.expiry_date + timedelta(days=plan.duration_months * 30)
        else:
            self.expiry_date = current_now + timedelta(days=plan.duration_months * 30)
            
        self.is_active = True
        self.purchase_count += 1
        self.save()
