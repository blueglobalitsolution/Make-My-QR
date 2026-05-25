# Gatekeeper Feature Analysis

## Overview

The Gatekeeper system provides:
- **Login Wall** — Protect QR codes behind authentication
- **Lead Capture** — Collect name/email before content access
- **Password Protection** — Simple password-based access control
- **Premium Viewer Experience** — Branded landing pages

---

## Bugs & Issues Found

### 1. Incorrect Lead Capture Endpoint Path
**Location:** `Frontend/src/components/app/QRViewer.tsx:104`
**Issue:** The endpoint uses `/r/${slug}/capture-lead/` which may cause routing conflicts.
```typescript
const response = await fetch(`/r/${slug}/capture-lead/`, {
```
**Fix:** Change to use the API client instead:
```typescript
import { client } from '../../api/client';
// Then use:
const response = await client(`/qrcodes/${slug}/capture-lead/`, { method: 'POST', body: JSON.stringify(leadForm) });
```

### 2. is_protected Not Passed to Preview Components
**Location:** `Frontend/src/components/previews/gatekeeper.tsx`
**Issue:** The `is_protected` prop is not passed into the individual preview components (WebsitePreview, PdfPreview, etc.). Password protection won't work properly.
```typescript
// Missing in all switch cases:
is_protected={is_protected} // Not passed!
```

### 3. Password Stored/Transmitted in Plain Text
**Location:** `Frontend/src/components/app/QRViewer.tsx:85`
**Issue:** The password is compared directly and stored in qrData. This is a security risk.
```typescript
const handlePasswordSubmit = (password: string) => {
    if (password === qrData.password) { // Password comparing in plain text
```
**Fix:** Implement server-side password validation with hashing (bcrypt).

### 4. Lead Capture Silently Fails on Password-Protected QR
**Location:** `Frontend/src/components/app/QRViewer.tsx:100-102`
**Issue:** If QR is protected but user hasn't entered password, lead capture returns early without feedback.
```typescript
if (qrData.is_protected && !isPasswordVerified) {
    return; // No user feedback - silently fails
}
```
**Fix:** Show an error message prompting password entry first.

### 5. Missing Email Validation
**Location:** `Frontend/src/components/previews/LeadCaptureForm.tsx:41-48`
**Issue:** Only checks for required field, no email format validation.
```typescript
type="email" // HTML5 validation only, easily bypassed
```
**Fix:** Add regex validation:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(leadForm.email)) {
    // Show error
}
```

### 6. Backend Doesn't Validate is_lead_capture Flag
**Location:** `Backend/QRmaker/scans/views.py:138-176`
**Issue:** The `capture_lead` function doesn't check if `qrcode.is_lead_capture` is True before accepting leads.
```python
qrcode = get_object_or_404(QRCode, short_slug=slug, status="active")
# No check: if not qrcode.is_lead_capture: return error
```

### 7. No Rate Limiting on Lead Capture
**Issue:** Same email can submit unlimited leads.
**Fix:** Add rate limiting or deduplication by email per QR code.

### 8. Missing isAuthorized Check Before Redirect
**Location:** `Frontend/src/components/app/QRViewer.tsx:162-176`
**Issue:** Redirect happens without checking `isPasswordVerified` when only password protection is enabled.
```typescript
if (isAuthorized && fullValue && !show_preview) {
    // Missing: && isPasswordVerified
```

---

## Suggested New Features

### 1. OTP/Email Verification
- Send verification code to email before granting access
- Better than simple password for high-value content

### 2. Custom Fields for Lead Capture
- Allow custom form fields (phone, company, etc.)
- Configurable per QR code from dashboard

### 3. Lead Export with CRM Integration
- Export leads to CSV
- Integrate with Mailchimp, HubSpot, Zapier

### 4. Time-Based Access
- Set expiration dates/times for access
- One-time access links

### 5. Geofencing
- Restrict access by geographic location
- Country/IP-based filtering

### 6. Device Limits
- Limit number of distinct devices
- Track unique visitors

### 7. A/B Testing for Gatekeeper
- Test different gate forms
- Conversion rate tracking

### 8. White-label Authentication
- Custom login page with logo/branding
- Custom CSS for gate forms

### 9. Lead Notification Alerts
- Email/SMS when new lead captured
- Webhook notifications

### 10. Progressive Profiling
- Ask for name first, email later
- Increase conversion rates

---

## Implementation Priority

| Priority | Item | Effort |
|----------|------|--------|
| High | Fix is_protected propagation | 1hr |
| High | Server-side password validation | 2hr |
| High | Add email validation | 30min |
| Medium | Backend is_lead_capture check | 1hr |
| Medium | Rate limiting | 2hr |
| Medium | Custom fields | 4hr |
| Low | OTP verification | 8hr |
| Low | Geofencing | 6hr |

---

## Summary

The gatekeeper feature is functional but has several issues:
1. Password protection not fully integrated
2. Security concerns with plain text handling
3. Missing backend validations
4. No rate limiting

Recommended fixes can be implemented in 4-6 hours of development time.