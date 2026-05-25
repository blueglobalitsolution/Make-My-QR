# Frontend-Backend-Database Integration Bugs

This document analyzes the connection between the frontend, backend, and database to identify bugs and issues.

---

## Architecture Overview

```
Frontend (React/Vite)  <-->  API Layer  <-->  Django REST API  <-->  Database (PostgreSQL)
                        (client.ts)      (views.py)          (models.py)
```

---

## Critical Bugs Found

### 1. Token Key Mismatch Between Frontend-Backend
**Severity:** Critical | **Files:** `client.ts`, `client.ts:11`

**Issue:** Frontend stores token with key `'makemyqr_token'` but backend API may expect different headers.

```typescript
// client.ts:11
const token = localStorage.getItem('makemyqr_token');
config.headers['Authorization'] = `Token ${token}`;  // Uses 'Token' prefix
```

**Backend:** Verify django-rest-auth is using Token authentication:
```python
# Should match REST_FRAMEWORK settings
'DEFAULT_AUTHENTICATION_CLASSES': [
    'rest_framework.authentication.TokenAuthentication',
]
```

**Problem:** If there's a mismatch, all authenticated requests fail.

**Fix:** Ensure both match exactly.

---

### 2. Serializer File URL Security Issue
**Severity:** High | **File:** `serializers.py:48`

**Issue:** `get_file_url` retrieves ANY file by ID without checking ownership.

```python
# serializers.py:46-52
if file_id:
    try:
        file_obj = File.objects.get(id=file_id)  # NO OWNERSHIP CHECK!
        if file_obj.file:
            return f"/api/files/public/{file_obj.id}/"
    except File.DoesNotExist:
        pass
```

**Problem:** Any user can potentially access files they don't own.

**Fix:** Add ownership validation:
```python
file_obj = File.objects.get(id=file_id)
# Check request user owns this file
request = self.context.get('request')
if request and request.user != file_obj.user:
    raise serializers.ValidationError("Access denied")
```

---

### 3. Password Validation Missing in Serializers
**Severity:** High | **File:** `serializers.py`, `qrcodes/serializers.py`

**Issue:** Password validation not enforced in serializer - can set weak passwords.

```python
# No validators on password field
password = serializers.CharField(required=False, allow_blank=True)
# Should have min_length, pattern validation
```

**Fix:** Add serializer validation:
```python
def validate_password(self, value):
    if value and len(value) < 4:
        raise serializers.ValidationError("Password must be at least 4 characters")
    return value
```

---

### 4. QR Code Limit Check Inconsistency
**Severity:** High | **Files:** `qrcodes/views.py:53`, `subscription_utils.py`

**Issue:** Limit check happens twice - before and during create, potential race condition.

```python
# views.py:53 - check 1
if not can_create_qr(request.user):
    return error

# But perform_create at line 42 still creates - if concurrent requests slip through,
# user could exceed limit
instance = serializer.save(user=self.request.user)
```

**Fix:** Add database-level constraint:
```python
from django.db.models import Count

def can_create_qr(user):
    plan = get_user_plan(user)
    current_count = QRCode.objects.filter(user=user).count()
    return current_count < plan.qr_limit
```

Use `select_for_update()` to prevent race conditions.

---

### 5. Duplicate Folder Creation Race Condition
**Severity:** High | **Files:** `files/views.py:45-52`, `qrcodes/views.py:31-39`

**Issue:** Same race condition as database.md - folder created twice if concurrent requests.

```python
# files/views.py:45-52
root_folder = Folder.objects.filter(user=self.request.user, is_root=True).first()
if not root_folder:
    root_folder = Folder.objects.create(...)  # RACE CONDITION!
```

**Fix:** Use `get_or_create`:
```python
root_folder, created = Folder.objects.get_or_create(
    user=self.request.user,
    is_root=True,
    defaults={'name': 'My Files'}
)
```

---

### 6. Public File View No Owner Check
**Severity:** High | **Files:** `files/views.py:68-86`

**Issue:** `public_file_view` loads any file by ID with no access control.

```python
# files/views.py:73
file_obj = get_object_or_404(File, id=file_id)  # No ownership check

# Only checks owner subscription - but file could be private
from users.subscription_utils import is_subscription_active
if not is_subscription_active(file_obj.user):
    raise Http404("Subscription expired")
```

**Problem:** Files should remain private until explicitly shared.

**Fix:** Add explicit privacy check.

---

### 7. Hashids Dependency on Model ID
**Severity:** Medium | **Files:** `qrcodes/views.py:45-47`

**Issue:** Short slug generated AFTER initial save uses wrong ID.

```python
# views.py:44-47
instance = serializer.save(user=self.request.user)
# At this point, instance.id may be None or 0 (before DB commit)
hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
instance.short_slug = hashids.encode(instance.id)  # Wrong ID!
instance.save(update_fields=["short_slug"])
```

**Problem:** Encoding wrong ID leads to incorrect slugs.

**Fix:** Generate slug after refresh:
```python
instance = serializer.save(user=self.request.user)
instance.refresh_from_db()  # Get actual ID
instance.short_slug = hashids.encode(instance.id)
instance.save(update_fields=["short_slug"])
```

---

### 8. Subscription Check on Every Public Access
**Severity:** Medium | **Files:** `scans/views.py`, `qrcodes/views.py:328`

**Issue:** Public QR code lookup checks subscription for every request.

```python
# views.py:328 - for each public scan
if not is_subscription_active(instance.user):
    return error  # This runs on EVERY public scan
```

**Problem:** Expensive - hits database on every scan.

**Fix:** Cache subscription status:
```python
from django.core.cache import cache

def is_subscription_active(user):
    cache_key = f"sub_active_{user.id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached
    
    # ... original logic ...
    cache.set(cache_key, result, 300)  # Cache 5 minutes
    return result
```

---

### 9. Frontend-Backend Field Name Mismatch
**Severity:** Medium | **Files:** `types.ts`, `serializers.py`

**Issue:** Frontend uses snake_case but backend returns different format.

```typescript
// Frontend types.ts
shortSlug?: string;  // camelCase

// But API may return:
{ short_slug: "abc123" }  // snake_case
```

**Fix:** Map in frontend API layer:
```typescript
export const mapQRCode = (data) => ({
    ...data,
    shortSlug: data.short_slug
})
```

---

### 10. Missing Error Response Format Standardization
**Severity:** Medium | **Multiple files**

**Issue:** Backend returns different error formats.

```python
# Some endpoints return:
return Response({"error": "message"}, status=400)

# Others:
return Response({"detail": "message"}, status=400)

# Others raise exceptions with different formats
```

**Frontend:** Can't reliably parse errors.

**Fix:** Standardize:
```python
def error_response(message, code="error"):
    return Response({code: message}, status=status.HTTP_400_BAD_REQUEST)
```

---

### 11. CORS Configuration Issues
**Severity:** Medium | **Location:** Settings

**Issue:** If frontend and backend on different domains, CORS may block requests.

**Check settings.py:**
```python
CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'https://yourdomain.com']
```

**Current state:** Need to verify CORS is properly configured.

---

### 12. File Upload Size Limit Not Enforced at API Level
**Severity:** Medium | **Files:** `files/views.py:34`

**Issue:** File size check happens in view but not at serializer level.

```python
# views.py:34 - correct
if not can_upload_file(self.request.user, uploaded_file.size):
    raise ValidationError("Upload limit reached")
```

**But:** No validation at model/serializer level.

**Fix:** Add to serializer:
```python
def validate_file(self, file):
    max_size = 10 * 1024 * 1024  # 10MB
    if file.size > max_size:
        raise ValidationError("File too large")
    return file
```

---

### 13. QR Code Category Not Validated
**Severity:** Low | **Files:** `qrcodes/views.py`, `models.py`

**Issue:** Category is free-text, no validation against allowed values.

```python
# models.py:9
category = models.CharField(max_length=50)  # No choices!

# Frontend can send any value
```

**Fix:** Add choices:
```python
CATEGORY_CHOICES = [
    ('website', 'Website'),
    ('pdf', 'PDF'),
    ('file', 'File'),
    # ...
]
category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
```

---

### 14. Lead Capture No Duplicate Check
**Severity:** Low | **Files:** `scans/views.py:159-169`

**Issue:** Same email can submit multiple times without limit.

```python
# Creates new Scan record every time - no deduplication
scan = Scan.objects.create(
    qrcode=qrcode,
    visitor_name=visitor_name,
    visitor_email=visitor_email,
    # ...
)
```

**Fix:** Add unique constraint or check:
```python
# Check if email already captured for this QR
existing = Scan.objects.filter(
    qrcode=qrcode,
    visitor_email=visitor_email
).exists()
if existing:
    return JsonResponse({"message": "Lead already captured"})
```

---

### 15. Missing API Versioning
**Severity:** Low | **Files:** All API endpoints

**Issue:** No API versioning - breaking changes affect all clients.

```python
# Current: /api/qrcodes/
# Should be: /api/v1/qrcodes/
```

**Fix:** Add versioning:
```python
path('api/v1/qrcodes/', include('qrcodes.urls')),
```

---

## Summary Table

| # | Bug | Severity | Effort |
|---|-----|----------|--------|
| 1 | Token key mismatch | Critical | 30min |
| 2 | File URL security | High | 1hr |
| 3 | Password validation missing | High | 30min |
| 4 | QR limit race condition | High | 1hr |
| 5 | Duplicate folder race | High | 30min |
| 6 | Public file view no check | High | 1hr |
| 7 | Hashids wrong ID | Medium | 30min |
| 8 | Subscription check caching | Medium | 1hr |
| 9 | Field name mismatch | Medium | 30min |
| 10 | Error format inconsistent | Medium | 1hr |
| 11 | CORS issues | Medium | 1hr |
| 12 | File size not validated | Medium | 30min |
| 13 | Category validation | Low | 30min |
| 14 | Lead duplicate check | Low | 30min |
| 15 | No API versioning | Low | 2hr |

---

## Recommended Fix Order

1. **Immediate (Critical):** Token mismatch, File URL security
2. **This Sprint (High):** Password validation, Race conditions, Public file check
3. **Next Sprint (Medium):** Caching, Error handling, Field mapping
4. **Backlog (Low):** API versioning, Category choices