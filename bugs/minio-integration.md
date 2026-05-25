# MinIO Integration Bugs

This document identifies bugs and issues in the integration of MinIO with the backend, frontend, and database.

## Architecture Overview

```
Frontend (React/Vite) 
      ↓ (API calls to backend)
Backend (Django) 
      ↓ (Uses django-storages with S3Boto3Storage to interface with MinIO)
MinIO (Object storage service)
      ↓ (Stores binary files)
Database (PostgreSQL) 
      ↓ (Stores file metadata: name, size, type, reference to storage path)
```

## Critical Bugs Found

### 1. MinIO Public URL Not Accessible
**Severity:** Critical | **Files:** `QRmaker/settings.py`, `nginx.conf`, `docker-compose.yml`

**Issue:** The backend returns public file URLs pointing to `https://qrstorage.makemyqrcode.com/file/{name}`, but there is no nginx configuration to route traffic for this domain to the MinIO service. MinIO is only accessible internally at `minio:9000` and exposed on host ports `9020:9000` and `9021:9001` (not standard HTTP/HTTPS ports).

**Evidence:**
- In `settings.py`: `MEDIA_URL = f"https://qrstorage.makemyqrcode.com/file/"`
- In `docker-compose.yml`: MinIO ports mapped to `9020` and `9021` on host
- In `nginx.conf`: Only server block for `localhost`, no handling for `qrstorage.makemyqrcode.com`

**Problem:** Users cannot access uploaded files because browsers cannot reach `qrstorage.makemyqrcode.com` on standard ports.

**Fix Options:**
1. Expose MinIO on standard ports (80/443) and configure nginx to proxy `qrstorage.makemyqrcode.com` to MinIO
2. Change backend to serve files via proxied endpoint (not redirect) using Django's file serving
3. Update public URL to use accessible host:port (e.g., `http://localhost:9020/qrmaker-files/{name}`)

### 2. Inconsistent Protocol Configuration
**Severity:** High | **File:** `QRmaker/settings.py`

**Issue:** `MINIO_SECURE` defaults to `False` (HTTP) but `MEDIA_URL` is hardcoded to HTTPS. This creates protocol mismatch if frontend/backend use HTTP.

**Evidence:**
```python
MINIO_SECURE = os.getenv("MINIO_SECURE", "False").lower() == "true"
# ...
MEDIA_URL = f"https://qrstorage.makemyqrcode.com/file/"  # Always HTTPS
```

**Problem:** Mixed content warnings, broken file access when site served over HTTP.

**Fix:** Derive `MEDIA_URL` from `MINIO_SECURE` setting:
```python
protocol = "https" if MINIO_SECURE else "http"
MEDIA_URL = f"{protocol}://qrstorage.makemyqrcode.com/file/"
```

### 3. Public File View Lacks Access Control
**Severity:** High | **File:** `Backend/QRmaker/files/views.py`

**Issue:** `public_file_view` function serves any file by ID without checking if the file is intended for public access. It only validates owner's subscription status.

**Evidence:**
```python
# files/views.py:73
file_obj = get_object_or_404(File, id=file_id)  # No privacy check!
# Only checks owner subscription - but file could be private
from users.subscription_utils import is_subscription_active
if not is_subscription_active(file_obj.user):
    raise Http404("Subscription expired")
```

**Problem:** Private files can be accessed by anyone who knows or guesses the file ID.

**Fix:** Add privacy flag to File model and check it:
```python
# In files/models.py
is_public = models.BooleanField(default=False)

# In files/views.py
if not file_obj.is_public:
    raise Http404("File not found")
```

### 4. Missing File Size Validation in Serializer
**Severity:** Medium | **File:** `Backend/QRmaker/files/serializers.py`

**Issue:** File size validation occurs only in the view (`perform_create`), not in the serializer. This allows oversized files to pass serializer validation but fail later in the view, creating inconsistent error handling.

**Evidence:**
```python
# files/views.py:34-36
if not can_upload_file(self.request.user, uploaded_file.size):
    raise ValidationError("Upload limit reached for your current plan.")

# files/serializers.py: No file size validation
```

**Problem:** Inconsistent API validation - serializer may accept file that view rejects.

**Fix:** Add file size validation to serializer:
```python
def validate_file(self, file):
    max_size = 10 * 1024 * 1024  # 10MB from settings
    if file.size > max_size:
        raise ValidationError(f"File size exceeds {max_size} bytes limit")
    return file
```

### 5. Hardcoded Media URL Reduces Flexibility
**Severity:** Medium | **File:** `QRmaker/settings.py`

**Issue:** `MEDIA_URL` is hardcoded to a specific domain, making environment-specific configuration difficult and preventing easy migration.

**Evidence:**
```python
MEDIA_URL = f"https://qrstorage.makemyqrcode.com/file/"
```

**Problem:** Cannot easily change domain or use different URLs for development/staging/production.

**Fix:** Make `MEDIA_URL` configurable via environment variable:
```python
MEDIA_URL = os.getenv("MEDIA_URL", f"https://qrstorage.makemyqrcode.com/file/")
```

### 6. Inadequate Error Handling in Public File View
**Severity:** Low | **File:** `Backend/QRmaker/files/views.py`

**Issue:** Error handling in `public_file_view` logs error but still attempts redirect, potentially exposing internal errors or causing redirect loops.

**Evidence:**
```python
# files/views.py:82-85
try:
    return HttpResponseRedirect(file_obj.file.url)
except Exception as e:
    print(f"Error serving file {file_id}: {e}")
    return HttpResponseRedirect(file_obj.file.url)  # Still redirects!
```

**Problem:** On error, user gets redirected to same URL that caused the error, potentially creating infinite loop.

**Fix:** Return proper error response on failure:
```python
except Exception as e:
    print(f"Error serving file {file_id}: {e}")
    raise Http404("Unable to serve file")
```

## Workflow Issues Identified

### File Upload Flow
1. Frontend sends file to `/api/files/` endpoint
2. Backend validates subscription and upload limits
3. Backend saves file to MinIO via django-storages
4. Backend returns file metadata including `file_url` pointing to `/api/files/public/{id}/`
5. Frontend stores file reference

### File Download Flow
1. Frontend requests file via `/api/files/public/{id}/`
2. Backend's `public_file_view` redirects to MinIO URL (`https://qrstorage.makemyqrcode.com/file/{name}`)
3. Browser requests file from MinIO URL
4. MinIO serves file directly (if accessible)

**Issue:** Step 2 relies on publicly accessible MinIO URL which is not configured.

## Database Integration Notes

- File metadata stored in `files_file` table
- `file` column stores path within MinIO bucket (e.g., `user_files/2026/04/21/filename.pdf`)
- Actual binary data stored in MinIO, not database
- Referential integrity: Django ORM handles relationship between File model and storage

## Recommendations

1. **Immediate:** Fix MinIO accessibility by either:
   - Exposing MinIO on standard ports and configuring nginx reverse proxy
   - Changing backend to proxy file downloads instead of redirecting

2. **Short-term:** Implement proper access control for public files

3. **Medium-term:** Make all URLs and protocols configurable via environment

4. **Long-term:** Consider using signed URLs for time-limited file access instead of public URLs