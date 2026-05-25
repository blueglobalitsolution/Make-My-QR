# Workflow Bugs & Errors Analysis

This document analyzes all workflow-related issues across the application's features including QR creation, authentication, scan flows, payment, and analytics workflows.

---

## 1. QR Creation Wizard Workflow

### Bug: Wizard Step Validation Not Enforced Before Save
**Location:** `Frontend/src/components/app/Wizard/index.tsx:139-146`
**Issue:** Step 2 only validates website type, other types can proceed without required content.

```typescript
const isNextStepDisabled = () => {
    if (wizard.step === 2) {
        if (wizard.type === 'website') {
            return !wizard.value;  // Only website check!
        }
    }
    return false;  // Other types bypass validation!
}
```
**Fix:** Add proper validation for all types:
```typescript
const isNextStepDisabled = () => {
    if (wizard.step === 2) {
        switch (wizard.type) {
            case 'website': return !wizard.value;
            case 'pdf': return !pdfUrl;
            case 'whatsapp': return !whatsappPhone;
            case 'business': return !wizard.business?.company;
            default: return false;
        }
    }
    return false;
}
```

---

### Bug: Duplicate QR Code Creation on Double Click
**Location:** No loading state to prevent duplicate submissions
**Issue:** Users can click "Create" multiple times before the request completes.

**Fix:** Add loading state:
```typescript
const [isCreating, setIsCreating] = useState(false);

const handleCreate = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
        await handleNextStep();
    } finally {
        setIsCreating(false);
    }
};
```

---

### Bug: Session Timeout Without Proper Handling in Wizard Flow
**Location:** `Frontend/App.tsx:252-258`
**Issue:** Only checks on init, doesn't prevent wizard submission if session expires mid-flow.

```typescript
// Only checks on initial load
if (loginTime && (Date.now() - parseInt(loginTime)) > FIVE_HOURS) {
    auth.handleLogout();
    // User could be mid-wizard when this fires!
}
```

**Fix:** Add in-view session check:
```typescript
useEffect(() => {
    if (!auth.currentUser) {
        setView('login');
    }
}, [auth.currentUser]);
```

---

### Bug: PDF File Not Properly Reset When Changing Type
**Location:** Wizard state, file upload handling
**Issue:** If user selects PDF, uploads file, then goes back and changes type, PDF data may persist incorrectly.

**Fix:** Reset PDF state on type change:
```typescript
useEffect(() => {
    if (wizard.step === 1) {
        setPdfUrl(null);
        setPdfFileName(null);
    }
}, [wizard.type]);
```

---

### Bug: Missing Business Data Reset on Type Change
**Location:** `Frontend/src/components/app/Wizard/index.tsx:196`
**Issue:** Switching from business to other types keeps business data.

```typescript
setWizard(prev => ({ ...prev, type: type.id as any, step: 2 }));
// Business data in wizard.business persists
```

**Fix:** Add conditional reset:
```typescript
const handleTypeSelect = (type) => {
    if (type.id !== 'business') {
        setWizard(prev => ({ ...prev, type: type.id, step: 2, business: undefined }));
    } else {
        setWizard(prev => ({ ...prev, type: type.id, step: 2 }));
    }
};
```

---

## 2. Authentication Workflow

### Bug: Multiple Token Keys Used Inconsistently
**Location:** `Frontend/src/api/client.ts` and `Frontend/src/api/auth.ts`
**Issue:** Uses `makemyqr_token` but other places use `barqr_user`.

```typescript
// client.ts:11
const token = localStorage.getItem('makemyqr_token');

// Auth.ts also checks:
const savedUser = localStorage.getItem('makemyqr_user') || localStorage.getItem('barqr_user');
```

**Fix:** Standardize to single key:
```typescript
const TOKEN_KEY = 'makemyqr_token';
const USER_KEY = 'makemyqr_user';
```

---

### Bug: Password Reset Flow No OTP Expiration
**Location:** `Backend/QRmaker/users/views.py`
**Issue:** OTPs don't have expiration, can be used indefinitely after creation.

```python
# Current: Cache stores OTP without TTL
cached_otp = cache.get(cache_key)
# Should expire after 10 minutes
```

**Fix:** Add expiration:
```python
cache.set(cache_key, otp, 600)  # 10 minutes
```

---

### Bug: Login Token Never Refreshes
**Location:** No token refresh endpoint
**Issue:** Token is static, no refresh mechanism when approaching expiry.

**Fix:** Add refresh endpoint:
```python
@api_view(['POST'])
def refresh_token(request):
    token = Token.objects.get(user=request.user)
    token.delete()
    new_token = Token.objects.create(user=request.user)
    return Response({'token': new_token.key})
```

---

### Bug: Logout Doesn't Clear All State
**Location:** `Frontend/src/api/auth.ts:34-38`
**Issue:** Partial cleanup after logout.

```typescript
export const logout = () => {
    localStorage.removeItem('makemyqr_token');
    localStorage.removeItem('makemyqr_user');
    // Missing: makemyqr_view_data, makemyqr_login_time
};
```

**Fix:** Clear all:
```typescript
export const logout = () => {
    localStorage.removeItem('makemyqr_token');
    localStorage.removeItem('makemyqr_user');
    localStorage.removeItem('makemyqr_view_data');
    localStorage.removeItem('makemyqr_login_time');
};
```

---

## 3. Scan & Redirect Workflow

### Bug: Slug Validation Bypass
**Location:** `Backend/QRmaker/scans/views.py:22`
**Issue:** Only checks `short_slug`, no SQL injection protection.

```python
qrcode = get_object_or_404(QRCode, short_slug=slug, status="active")
# Slug used directly in query
```

**Fix:** Add slug validation:
```python
from django.core.validators import RegexValidator
slug_validator = RegexValidator(r'^[a-zA-Z0-9]+$')

def redirect_scan(request, slug):
    slug_validator(slug)
    # Then query
```

---

### Bug: Missing Error Handler for Failed GeoIP
**Location:** `Backend/QRmaker/scans/views.py:40-49`
**Issue:** Silent failure on GeoIP errors, no logging.

```python
try:
    geo_response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=1).json()
except Exception:
    pass  # Silent failure!
```

**Fix:** Add logging:
```python
import logging
logger = logging.getLogger(__name__)

try:
    geo_response = requests.get(...)
except Exception as e:
    logger.warning(f"GeoIP lookup failed: {e}")
```

---

### Bug: Race Condition on Scan Count Increment
**Location:** `Backend/QRmaker/scans/views.py:61-63`
**Issue:** Two requests can read same count before saving.

```python
qrcode.scans += 1
qrcode.save(update_fields=["scans"])
# Not atomic - can lose counts under load
```

**Fix:** Use F() expression:
```python
from django.db.models import F
QRCode.objects.filter(id=qrcode.id).update(scans=F('scans') + 1)
```

---

### Bug: Duplicate Scan Records Possible
**Location:** `Backend/QRmaker/scans/views.py:52-59`
**Issue:** No deduplication - same user can create multiple scan records quickly.

**Fix:** Add rate limiting:
```python
from django.utils import timezone
from datetime import timedelta

recent = Scan.objects.filter(
    qrcode=qrcode,
    ip_address=ip_address,
    timestamp__gte=timezone.now() - timedelta(minutes=1)
).exists()

if not recent:
    Scan.objects.create(...)
```

---

## 4. Payment Workflow

### Bug: Payment Verification Bypassed in DEBUG
**Location:** `Backend/QRmaker/payments/views.py:70-76`
**Issue:** Insecure debug bypass.

```python
if settings.DEBUG:
    print("DEBUG: Bypassing signature verification for testing")
else:
    client.utility.verify_payment_signature(params_dict)
```

**Fix:** Use separate test mode flag:
```python
ALLOW_TEST_PAYMENTS = getattr(settings, 'ALLOW_TEST_PAYMENTS', False)

if settings.DEBUG and ALLOW_TEST_PAYMENTS:
    # Use test keys specifically
```

---

### Bug: Order Status Not Reset on Failed Payment
**Location:** `Backend/QRmaker/payments/views.py:92-96`
**Issue:** Failed payment leaves order in inconsistent state.

```python
except (razorpay.errors.SignatureVerificationError, Exception) as e:
    order = PaymentOrder.objects.filter(razorpay_order_id=razorpay_order_id).first()
    if order:
        order.status = 'failed'
        order.save()
    return Response({"error": f"Payment verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
```

**Fix:** This is handled but verify UserSubscription is reset too.

---

### Bug: Missing Webhook Signature Verification
**Location:** `Backend/QRmaker/payments/views.py:120-140`
**Issue:** Webhooks don't verify signature before processing.

```python
webhook_signature = request.headers.get("X-Razorpay-Signature")
# Should verify before processing event
```

**Fix:** Add verification:
```python
def verify_webhook_signature(payload, signature):
    secret = settings.RAZORPAY_WEBHOOK_SECRET
    expected = hmac.new(secret, payload, 'sha256').hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

### Bug: No Idempotency Key for Orders
**Location:** `Backend/QRmaker/payments/views.py:26-39`
**Issue:** Creating order twice creates duplicate orders.

```python
razorpay_order = client.order.create({...})
# Same request can create multiple orders
```

**Fix:** Use idempotency key:
```python
idempotency_key = f"{request.user.id}_{plan_id}_{timezone.now().timestamp()}"
razorpay_order = client.order.create({
    "amount": amount,
    "idempotency_key": idempotency_key
})
```

---

## 5. Analytics Workflow

### Bug: N+1 Query Problem in Analytics
**Location:** `Backend/QRmaker/qrcodes/views.py:190-191`
**Issue:** Separate query for QR names.

```python
qr_map = {q.id: q.name for q in QRCode.objects.filter(id__in=[...])}
```

**Fix:** Use select_related or annotate.

---

### Bug: No Pagination in Analytics
**Location:** All analytics endpoints
**Issue:** Returns all records without limit.

```python
leads_qs = user_scans.filter(...).order_by('-timestamp')[:10]  # Hardcoded!
```

**Fix:** Add pagination params:
```python
page = int(request.query_params.get('page', 1))
page_size = 50
offset = (page - 1) * page_size
leads_qs = user_scans[offset:offset+page_size]
```

---

### Bug: CSV Export No Memory Limit
**Location:** `Backend/QRmaker/qrcodes/views.py:218-246`
**Issue:** Large exports can timeout.

**Fix:** Use streaming response or background task.

---

## 6. User & Subscription Workflow

### Bug: Trial Can't Be Reactivated
**Location:** `UserSubscription.update_subscription`
**Issue:** Users who expire can't get new trial.

```python
def update_subscription(self, plan):
    # No check for trial reactivation
```

**Fix:** Add trial check.

---

### Bug: Subscription Status Not Synced
**Location:** `payments/models.py:107-111`
**Issue:** Status refresh saves even when unchanged.

```python
if self.status != old_status:
    self.log_transition(old_status, self.status)
    self.save()
else:
    self.save(update_fields=['is_active'])  # Always saves!
```

**Fix:** Only save when needed.

---

### Bug: No Plan Change Notification
**Location:** Subscription updates
**Issue:** Users not notified of subscription changes.

**Fix:** Add email notification.

---

## 7. Data Sync Workflow

### Bug: Field Name Mapping Not Consistent
**Location:** `Frontend/App.tsx:215-225`
**Issue:** Manual mapping prone to errors.

```typescript
const mappedHistory = (Array.isArray(historyData) ? historyData : []).map((code: any) => ({
    ...code,
    shortSlug: code.short_slug,
    isDynamic: code.is_dynamic,
    isLeadCapture: code.is_lead_capture,
    // Error-prone manual mapping
}));
```

**Fix:** Use API Transform or consistent naming.

---

### Bug: No Optimistic Updates
**Location:** Frontend API calls
**Issue:** UI waits for server response.

**Fix:** Implement optimistic rollbacks.

---

## Summary Table

| # | Workflow | Bug | Severity | Status |
|---|----------|-----|----------|--------|
| 1 | Wizard | Step validation bypassed | High | Not Fixed |
| 2 | Wizard | Duplicate creation possible | Medium | Not Fixed |
| 3 | Auth | Multiple token keys | High | Not Fixed |
| 4 | Auth | OTP no expiration | Medium | Not Fixed |
| 5 | Auth | No token refresh | Medium | Not Fixed |
| 6 | Scan | No scan deduplication | Medium | Not Fixed |
| 7 | Scan | Race condition on count | High | Not Fixed |
| 8 | Payment | DEBUG bypass | Critical | Not Fixed |
| 9 | Payment | No webhook verification | High | Not Fixed |
| 10 | Analytics | N+1 queries | Medium | Not Fixed |
| 11 | Analytics | No pagination | Medium | Not Fixed |
| 12 | Subscriptions | No status sync | Low | Not Fixed |

---

## Recommended Priority

1. **Immediate:** Payment verification security, scan race conditions
2. **High:** Token consistency, wizard validation, scan deduplication
3. **Medium:** Auth flows, analytics optimization
4. **Low:** Notifications, UI polish