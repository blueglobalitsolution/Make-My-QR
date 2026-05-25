# Subscription & Razorpay Bugs & Errors

This document documents all bugs, errors, and issues found in the subscription and Razorpay payment integration.

---

## CRITICAL BUGS

### 1. Payment Signature Bypass in DEBUG Mode
**Severity:** CRITICAL | **Location:** `payments/views.py:70-76`

**Issue:** Payment signature verification is completely bypassed when `settings.DEBUG=True`, allowing fake payments to succeed.

```python
# Current code (INSECURE!)
if settings.DEBUG:
    print("DEBUG: Bypassing signature verification for testing")
else:
    client.utility.verify_payment_signature(params_dict)
```

**Problem:** 
- Anyone can send fake payment data in DEBUG mode
- No way to test with real payments in development
- Accidentally deployed DEBUG=True will expose vulnerability

**Fix:**
```python
# Use separate setting for test payments
ALLOW_TEST_PAYMENTS = getattr(settings, 'ALLOW_TEST_PAYMENTS', False)

if settings.DEBUG and ALLOW_TEST_PAYMENTS:
    # Allow test with specific test keys only
    client.utility.verify_payment_signature(params_dict)
else:
    client.utility.verify_payment_signature(params_dict)
```

Or use environment-specific logic:
```python
import os
ENV = os.getenv('DJANGO_ENV', 'production')

if ENV == 'development':
    # Use Razorpay test keys but still verify
    pass
    
client.utility.verify_payment_signature(params_dict)
```

---

### 2. Webhook Signature Not Verified
**Severity:** CRITICAL | **Location:** `payments/views.py:124-126`

**Issue:** Razorpay webhook signature is not verified, allowing fake webhook events.

```python
# Current code (INSECURE!)
if not settings.DEBUG and webhook_signature:
    client.utility.verify_webhook_signature(payload, webhook_signature, webhook_secret)
# In DEBUG mode, skips completely!
```

**Fix:**
```python
# Always verify unless explicitly disabled
DISABLE_WEBHOOK_VERIFY = getattr(settings, 'DISABLE_WEBHOOK_VERIFY', False)

if not DISABLE_WEBHOOK_VERIFY:
    try:
        client.utility.verify_webhook_signature(payload, webhook_signature, webhook_secret)
    except razorpay.errors.SignatureVerificationError:
        return Response({"error": "Invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)
```

---

### 3. No Idempotency - Duplicate Orders Possible
**Severity:** HIGH | **Location:** `payments/views.py:25-39`

**Issue:** Creating order twice creates duplicate PaymentOrder records.

```python
razorpay_order = client.order.create({
    "amount": amount,
    "currency": currency,
    "payment_capture": "1"
})
# Same request can create multiple orders if retried
```

**Fix:** Use idempotency key:
```python
from django.utils import timezone

idempotency_key = f"create_order_{request.user.id}_{plan_id}_{timezone.now().date().isoformat()}"

razorpay_order = client.order.create({
    "amount": amount,
    "currency": currency,
    "payment_capture": "1",
    "idempotency_key": idempotency_key
})
```

Also check for existing pending order:
```python
existing_order = PaymentOrder.objects.filter(
    user=request.user,
    plan=plan,
    status='pending'
).first()

if existing_order:
    return Response({
        "order_id": existing_order.razorpay_order_id,
        "amount": existing_order.amount * 100,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    })
```

---

### 4. SubscriptionPlan Name Not Unique
**Severity:** HIGH | **Location:** `payments/models.py:5`

**Issue:** Multiple plans with same name can be created.

```python
name = models.CharField(max_length=100)  # No unique=True!
```

**Fix:**
```python
name = models.CharField(max_length=100, unique=True)
```

---

## HIGH SEVERITY BUGS

### 5. Race Condition on Scan Count
**Severity:** HIGH | **Location:** `payments/views.py:79-83`

**Issue:** Payment verification and order update not atomic.

```python
order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
order.status = 'success'
order.save()
# If fails here, payment verified but order not updated!
user_sub.update_subscription(order.plan)
```

**Fix:** Use database transaction:
```python
from django.db import transaction

with transaction.atomic():
    order = PaymentOrder.objects.select_for_update().get(razorpay_order_id=razorpay_order_id)
    order.status = 'success'
    order.razorpay_payment_id = razorpay_payment_id
    order.save()
    
    user_sub.update_subscription(order.plan)
```

---

### 6. No UserSub Status Reset on Payment Fail
**Severity:** HIGH | **Location:** `payments/views.py:92-96`

**Issue:** Failed payment doesn't reset UserSubscription status.

```python
except ... as e:
    order = PaymentOrder.objects.filter(...).first()
    if order:
        order.status = 'failed'
        order.save()
    # USER SUBSCRIPTION STATUS NOT RESET!
    return Response({"error": ...})
```

**Fix:**
```python
except ... as e:
    order = PaymentOrder.objects.filter(...).first()
    if order:
        order.status = 'failed'
        order.save()
    
    # Reset subscription status
    user_sub = UserSubscription.objects.filter(user=order.user).first()
    if user_sub and user_sub.status == 'payment_pending':
        user_sub.refresh_status()
        user_sub.save()
    
    return Response({"error": ...})
```

---

### 7. Webhook Doesn't Verify Order Ownership
**Severity:** HIGH | **Location:** `payments/views.py:136-143`

**Issue:** Webhook doesn't validate order belongs to user before updating subscription.

```python
order = PaymentOrder.objects.filter(razorpay_order_id=order_id).first()
if order and order.status != 'success':
    # Updates without checking user authorization!
    user_sub, _ = UserSubscription.objects.get_or_create(user=order.user)
```

**Problem:** If someone crafts a fake webhook for another user's order, they could upgrade that subscription.

**Fix:** Already partially fixed - verify:
```python
# Verify the order actually exists and is pending
if not order or order.status == 'success':
    return Response({"status": "ignored"})
```

---

### 8. Subscription Refresh Called on Every Check
**Severity:** HIGH | **Location:** `subscription_utils.py:16`

**Issue:** `refresh_status()` runs DB update on every subscription check.

```python
def is_subscription_active(user):
    sub = get_subscription(user)
    sub.refresh_status()  # DB write on EVERY check!
    ...
```

**Fix:** Cache status:
```python
from django.core.cache import cache

def is_subscription_active(user):
    cache_key = f"user_sub_active_{user.id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached
    
    sub = get_subscription(user)
    if not sub:
        return False
    
    result = sub.is_active and sub.status not in ['trial_expired']
    
    # Cache for 5 minutes
    cache.set(cache_key, result, 300)
    return result
```

---

### 9. QR Limit Check Has Race Condition
**Severity:** HIGH | **Location:** `subscription_utils.py:31-33`

**Issue:** Count check not atomic - concurrent requests can exceed limit.

```python
current_count = QRCode.objects.filter(user=user).count()
if current_count >= sub.plan.qr_limit:
    return False
```

**Fix:** Use database constraint:
```python
from django.db.models import F

def can_create_qr(user):
    ...
    # Atomic check and increment
    affected = QRCode.objects.filter(
        user=user
    ).update(scans=F('scans') + 1)
    return affected > 0
# Not suitable - need different approach

# Use select_for_update
from django.db import transaction

def can_create_qr(user):
    with transaction.atomic():
        sub = UserSubscription.objects.select_for_update().get(user=user)
        current_count = QRCode.objects.filter(user=user).count()
        return current_count < sub.plan.qr_limit
```

---

## MEDIUM SEVERITY BUGS

### 10. Wrong Status on Paid Expiry
**Severity:** MEDIUM | **Location:** `payments/models.py:101`

**Issue:** Expired paid subscription gets `trial_expired` status instead of descriptive status.

```python
self.status = 'trial_expired' # Wrong status!
```

**Fix:**
```python
self.status = 'subscription_expired'
# Add to STATUS_CHOICES
```

---

### 11. Always Saves Even When Unchanged
**Severity:** MEDIUM | **Location:** `payments/models.py:107-111`

**Issue:** Unnecessary DB writes on every status check.

```python
if self.status != old_status:
    self.log_transition(old_status, self.status)
    self.save()
else:
    self.save(update_fields=['is_active'])  # Unnecessary!
```

**Fix:**
```python
if self.status != old_status:
    self.log_transition(old_status, self.status)
    self.save()
elif self.is_active != old_is_active:
    self.save(update_fields=['is_active'])
# Only save when truly needed
```

---

### 12. No Graceful Degradation on Razorpay Fail
**Severity:** MEDIUM | **Location:** `payments/views.py`

**Issue:** Razorpay API failure crashes entire flow.

```python
razorpay_order = client.order.create({...})
# If Razorpay is down, entire flow fails
```

**Fix:** Add try-catch and fallback:
```python
try:
    razorpay_order = client.order.create({...})
except razorpay.errors.RazorpayError as e:
    return Response({
        "error": "Payment service temporarily unavailable",
        "detail": str(e)
    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
```

---

### 13. No Payment Retry Logic
**Severity:** MEDIUM | **Location:** `payments/views.py`

**Issue:** Failed payments can't be retried - user must start over.

**Fix:** Allow order recreation:
```python
# Check for existing pending order that's old (> 30 minutes)
from django.utils import timezone
from datetime import timedelta

old_pending = PaymentOrder.objects.filter(
    user=request.user,
    status='pending',
    created_at__lt=timezone.now() - timedelta(minutes=30)
)
old_pending.delete()  # Clean up old pending
```

---

### 14. Missing Plan Features Validation
**Severity:** MEDIUM | **Location:** `subscription_utils.py`

**Issue:** Feature checks don't validate individual capabilities.

```python
def can_create_qr(user):
    # Only checks QR limit, not feature flags
    
def can_upload_file(user, size):
    # Should check: can_create_pdf
```

**Fix:** Add feature checks:
```python
def can_create_pdf(user):
    sub = get_subscription(user)
    return sub and sub.plan and sub.plan.can_create_pdf

def can_access_analytics(user):
    sub = get_subscription(user)
    return sub and sub.plan and sub.plan.can_access_analytics
```

---

### 15. Wrong Plan Duration Calculation
**Severity:** MEDIUM | **Location:** `payments/models.py:128`

**Issue:** Wrong duration calculation for extensions.

```python
# Bug: 6 months * 30 = 180 days (not exactly 6 months)
self.expiry_date = self.expiry_date + timedelta(days=plan.duration_months * 30)
# Should be: use calendar months
```

**Fix:** Use calendar math:
```python
import calendar
from dateutil.relativedelta import relativedelta

months = plan.duration_months
self.expiry_date = self.expiry_date + relativedelta(months=months)
```

---

## LOW SEVERITY BUGS

### 16. No Webhook Event Validation
**Severity:** LOW | **Location:** `payments/views.py:129`

**Issue:** Webhook processes events without validation.

```python
event = data.get("event")
if event == "payment.captured":
    # Processes any event type
```

**Fix:** Validate event:
```python
VALID_EVENTS = ['payment.captured', 'payment.failed', 'subscription.activated']

if event not in VALID_EVENTS:
    return Response({"status": "ignored"})
```

---

### 17. No Subscription Cancellation
**Severity:** LOW | **Location:** `payments/models.py`

**Issue:** No way to cancel subscription.

**Fix:** Add cancel method:
```python
def cancel(self):
    self.status = 'cancelled'
    self.is_active = False
    self.save()
```

---

### 18. Audit Log Not Linked to Order
**Severity:** LOW | **Location:** `payments/models.py:62-69`

**Issue:** SubscriptionAuditLog not linked to PaymentOrder.

```python
SubscriptionAuditLog.objects.create(
    user=self.user,
    old_status=old_status,
    new_status=new_status,
    plan=self.plan
    # No order reference!
)
```

**Fix:** Add order FK:
```python
order = models.ForeignKey(PaymentOrder, ...)

def log_transition(self, old_status, new_status, order=None):
    SubscriptionAuditLog.objects.create(
        user=self.user,
        old_status=old_status,
        new_status=new_status,
        plan=self.plan,
        order=order
    )
```

---

### 19. No Email Notifications
**Severity:** LOW | **Location:** `payments/models.py`

**Issue:** Users not notified of subscription changes.

**Fix:** Add notifications:
```python
from django.core.mail import send_mail

def log_transition(self, old_status, new_status):
    ...
    send_mail(
        f"Subscription {new_status}",
        f"Your subscription is now {new_status}",
        ...,
        [self.user.email]
    )
```

---

### 20. Hardcoded Currency
**Severity:** LOW | **Location:** `payments/views.py:23`

**Issue:** Currency hardcoded to INR.

```python
currency = "INR"  # Only INR
```

**Fix:** Make configurable:
```python
CURRENCY = getattr(settings, 'DEFAULT_CURRENCY', 'INR')
```

---

## SUMMARY TABLE

| # | Bug | Severity | Status |
|---|----------|----------|----------|
| 1 | Payment Signature Bypass in DEBUG | NOT FIXED |
| 2 | Webhook Signature Not Verified | NOT FIXED |
| 3 | No Idempotency - Duplicate Orders | NOT FIXED |
| 4 | SubscriptionPlan Name Not Unique | NOT FIXED |
| 5 | Payment Update Not Atomic | NOT FIXED |
| 6 | No Status Reset on Fail | NOT FIXED |
| 7 | Webhook No Ownership Check | PARTIALLY FIXED |
| 8 | Subscription Refresh Every Check | NOT FIXED |
| 9 | QR Limit Race Condition | NOT FIXED |
| 10 | Wrong Status on Expiry | NOT FIXED |
| 11 | Unnecessary DB Saves | NOT FIXED |
| 12 | No Degradation on Fail | NOT FIXED |
| 13 | No Payment Retry Logic | NOT FIXED |
| 14 | No Feature Validation | NOT FIXED |
| 15 | Wrong Duration Calc | NOT FIXED |

---

## RECOMMENDED ACTIONS

### Immediate (Critical)
1. Remove DEBUG signature bypass
2. Enable webhook signature verification
3. Add idempotency keys

### This Sprint (High)
4. Add transaction atomicity
5. Fix subscription caching
6. Reset status on payment fail

### Next Sprint (Medium)
7. Add feature validation methods
8. Fix duration calculation
9. Add graceful degradation