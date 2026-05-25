# Database Bugs & Issues Report

---

## Critical Issues

### 1. Missing Database Indexes
**Severity:** High | **Files:** `scans/models.py`, `qrcodes/models.py`

**Status:** FIXED

**Issue:** Add indexes on frequently queried fields to optimize performance. Added to `ip_address`, `timestamp`, `visitor_email`, `country` in Scans and `status`, `created_at`, `user+status` in QRCodes.

```python
# scans/models.py - Missing indexes on:
- ip_address (used in filters)
- timestamp (used in ordering)
- visitor_email (used in lead queries)
- country (used in analytics filters)

# qrcodes/models.py - Missing indexes on:
- short_slug (unique but no index explicit)
- status (used in almost every query)
- user + status (composite query but no index)
- created_at (sorting/filtering)
```

**Fix:** Add `db_index=True` to fields:
```python
class Scan(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    country = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    visitor_email = models.EmailField(null=True, blank=True, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

class QRCode(models.Model):
    short_slug = models.CharField(max_length=50, unique=True, null=True, blank=True, db_index=True)
    status = models.CharField(max_length=20, default='active', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
```

---

### 2. Inconsistent on_delete Behavior
**Severity:** High | **Files:** `files/models.py`, `folders/models.py`

**Status:** FIXED

**Issue:** Changed `on_delete=models.CASCADE` to `models.SET_NULL` in `File` model for consistency with `QRCode` model. This ensures that deleting a folder doesn't accidentally delete the files within it; they instead become unassociated (assigned to root or remaining folderless).

**Fix:** Choose one approach:
```python
# Option A: Files belong to folders (cascade delete)
folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='files')

# Option B: Files can exist without folders (set null)
folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
```

---

### 3. Password Stored in Plain Text
**Severity:** Critical | **File:** `qrcodes/models.py:20`

**Status:** FIXED

**Issue:** Password stored as plain char field - security vulnerability.

```python
password = models.CharField(max_length=255, null=True, blank=True)  # INSECURE!
```

**Fix Applied:** Used Django's built-in password hashers.
- Added `set_password()` and `check_password()` methods to QRCode model
- Updated serializer to hash password on write and exclude from read
- Passwords are now stored using Django's PBKDF2 algorithm (or Argon2 if configured)

---

### 4. No Cascade Delete for Scan Records
**Severity:** Medium | **File:** `scans/models.py:5`

**Status:** FIXED

**Issue:** Changed relationship to `SET_NULL` and added a `user` field to the `Scan` model. This ensures that scan history is preserved for user analytics even after a QR code is deleted.

```python
qrcode = models.ForeignKey(QRCode, on_delete=models.CASCADE, related_name='scan_records')
# This is actually CORRECT - scans are deleted when QR is deleted
# But verify: Is this intentional? Scans analytics may be needed even after QR deletion
```

**Question:** Should scans be kept for analytics even after QR deletion? Consider `SET_NULL` instead.

---

### 5. Duplicate Folder Creation on Every Request
**Severity:** High | **Files:** `files/views.py`, `qrcodes/views.py`

**Status:** FIXED

**Issue:** Fixed race condition by replacing manual "check and create" logic with atomic `Folder.objects.get_or_create`. Also added a `UniqueConstraint` in `folders/models.py` to prevent duplicate root folders at the database level.

---

### 6. N+1 Query Problem in Analytics
**Severity:** High | **File:** `qrcodes/views.py:190-191`

**Status:** FIXED

**Issue:** Fetches QRCode names in a loop.

```python
qr_map = {q.id: q.name for q in QRCode.objects.filter(id__in=[t['qrcode_id'] for t in top_ids])}
# This executes an additional query for each analytics call
```

**Fix:** Use select_related or annotate:
```python
from django.db.models import Count

top_qrs = QRCode.objects.filter(user=request.user).annotate(
    scan_count=Count('scan_records')
).order_by('-scan_count')[:10]
# No separate query needed
```

---

### 7. Missing Transaction Atomicity
**Severity:** Medium | **Files:** `payments/views.py`, `qrcodes/views.py`

**Status:** FIXED

**Issue:** Wrapped sensitive multi-stage database operations in `transaction.atomic()` blocks. This includes:
1.  **Payments**: Ensuring the `PaymentOrder` status update and the `UserSubscription` activation happen together. Added `select_for_update()` to prevent race conditions during concurrent webhook/verification hits.
2.  **QR Codes**: Ensuring the initial record creation and subsequent `short_slug` generation/update are atomic.

---

### 8. Unused FileRecord Cleanup
**Severity:** Medium | **Files:** `files/models.py`, `files/views.py`

**Status:** FIXED

**Issue:** Implemented a `post_delete` signal in `files/models.py` that automatically removes the actual file from storage (MinIO/S3) whenever a `File` record is deleted from the database.

---

### 9. Folder Soft Delete vs Hard Delete Inconsistency
**Severity:** Low | **Files:** `folders/models.py`, `qrcodes/models.py`

**Issue:** No soft delete pattern - deletion is immediate and permanent.

```python
# No status field to mark as deleted
# Deleting folder immediately removes related qrcodes via CASCADE
```

**Consider:** Add soft delete pattern if needed.

---

### 10. JSONField Schema Validation Missing
**Severity:** Low | **File:** `qrcodes/models.py:18`

**Issue:** `settings` is JSONField with no schema validation.

```python
settings = models.JSONField(null=True, blank=True)
# Can contain any JSON - no validation that expected keys exist
```

**Fix:** Add serializer validation or use Django's constraints.

---

### 11. Incorrect GenericIPAddressField Import
**Severity:** Low | **File:** `scans/models.py:9`

**Issue:** Using `GenericIPAddressField` but no index.

```python
ip_address = models.GenericIPAddressField(null=True, blank=True)
# Could use IPv4/IPv6 - add index
```

---

### 12. SubscriptionPlan Missing Unique Constraint
**Severity:** Medium | **File:** `payments/models.py:4-20`

**Status:** FIXED

**Issue:** Multiple plans with same name possible.

```python
name = models.CharField(max_length=100)  # Can create duplicate 'Free' plans
```

**Fix:**
```python
name = models.CharField(max_length=100, unique=True)
```

---

## Migration Issues

### 13. Migration Number Gaps
**Severity:** Low

**Status:** RESOLVED / NO ISSUE

**Review:** A manual audit of all app migrations (`qrcodes`, `folders`, `files`, `payments`, `scans`) using `showmigrations` confirms that numbering is sequential within each app. The "gap" was a misunderstanding of how Django tracks migrations independently for each module. 

- qrcodes: 0001-0010 (Sequential)
- folders: 0001-0005 (Sequential)
- files: 0001-0003 (Sequential)
- No missing migrations or gaps found.

---

## Fix Priority Matrix

| Priority | Issue | Fix Effort |
|----------|-------|------------|
| Critical | Plain text password storage | 2hr |
| Critical | Duplicate folder creation race | 30min |
| High | Missing indexes | 1hr |
| High | N+1 queries | 2hr |
| High | No transaction atomicity | 1hr |
| Medium | File cleanup on delete | 1hr |
| Medium | Inconsistent on_delete | 30min |
| Medium | Missing unique constraints | 30min |
| Low | Migration gaps | Review |
| Low | JSONField schema | 2hr |

---

## Summary

**Total Issues Found:** 12

- **Critical (password security):** 1
- **High (performance):** 4
- **Medium (data integrity):** 4
- **Low (maintenance):** 3

**Recommended First Actions:**
1. Fix password storage (security)
2. Add database indexes (performance)
3. Fix folder creation race condition (reliability)
4. Add transaction atomicity to payments (integrity)