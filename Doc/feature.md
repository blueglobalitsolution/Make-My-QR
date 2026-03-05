# QR Tracking & Dynamic Redirect Implementation

Implementing these libraries will transform your project from a basic QR generator into a **Professional Dynamic QR Platform**.

Below is a clear breakdown of the **Before vs. After** experience.

---

## 1. URL & Scanning Experience

### Before

* The QR code contains a long, messy URL like:

  ```
  .../view/business?id=bmma3dlp0&standalone=true
  ```
* This makes the QR code **dense** (lots of small dots).
* Harder for older phones to scan.

### After (with Hashids)

* The QR code contains a clean short link:

  ```
  https://api.makemyqr.com/r/Xy7Zp
  ```

### Result

* Fewer dots in the QR code.
* Premium, professional look.
* Scans instantly — even from distance or low light.

---

## 2. The "Dynamic" Factor (Editing Capability)

### Before

* If you printed 1,000 business cards with a QR pointing to a PDF,
* And later you change the PDF,
* The old QR codes break.
* You must re-print everything.

### After (with Redirect Flow)

* The QR points to a short link (`/r/slug`).
* You can update the destination anytime from the dashboard.

### Result

* Printed QR codes never break.
* You can change the destination anytime.
* No re-printing required.

---

## 3. Scanner Analytics (User Insights)

### Before

* Zero data.
* No idea how many scans happened.
* No information about device type or timing.

### After (with django-user-agents)

* Every scan passes through your Django redirect view.
* The server captures device information before redirecting.

### Dashboard Insights

You can now track:

* **Total Scans** – Number of times the QR was scanned.
* **Device Type** – Mobile / Tablet / Desktop.
* **OS Family** – iOS / Android / Windows / macOS.
* **Browser** – Chrome / Safari / etc.
* **Peak Times** – Most active scan times.

### Result

* Data-driven marketing decisions.
* Better understanding of your audience.
* Professional analytics reporting.

---

## 4. Direct PDF Access (Improved Mobile Experience)

### Before

* Users may get stuck inside an internal viewer.
* Experience feels like a web page.

### After (with HttpResponseRedirect)

* The server sends a direct redirect command.
* The file opens in the phone’s native PDF viewer (Safari, Chrome, Acrobat).

### Result

* Smooth system-level experience.
* Faster loading.
* Feels like a native app.

---

# Comparison Summary

| Feature     | Before Implementation       | After Implementation              |
| ----------- | --------------------------- | --------------------------------- |
| QR Density  | High (Harder to scan)       | Low (Scans instantly)             |
| Flexibility | Static (Cannot change link) | Dynamic (Update anytime)          |
| Tracking    | None                        | Full Analytics (Device, OS, Time) |
| User Flow   | Internal Viewer             | Native System Redirect            |

---

# Conclusion

By implementing:

* `hashids`
* `django-user-agents`
* Redirect-based tracking

Your system evolves from a simple QR generator into a **professional dynamic QR management platform with analytics and edit flexibility**.



# QR Gatekeeper & Security System

This document outlines the implementation of the **Gatekeeper functionality** for the QR Code Platform, including Login Walls, Lead Capture, and a Premium Branded Viewer experience.

---

# Overview

The Gatekeeper system transforms standard QR codes into controlled-access digital assets. It allows content protection, lead collection, and enhanced brand presentation.

---

# Key Enhancements

## 1️⃣ Security Gates & Lead Capture

### Login Wall

* Protect any QR code behind authentication.
* Anonymous users are redirected to the login page.
* After successful login, users are automatically redirected back to the original QR content.
* Ensures secure access to premium or private resources.

### Lead Capture (Getting Page)

* Require users to enter **Name** and **Email** before viewing content.
* Ideal for:

  * PDF whitepapers
  * Exclusive links
  * Marketing campaigns
* Enables structured lead generation before content delivery.

---

## 2️⃣ Premium Viewer Experience

### Enhanced QRViewer

* High-end branded header.
* Integrated PDF viewer.
* Supports:

  * Native browser PDF viewing
  * Fallback `<iframe>` viewer

### Responsive Design

* Skeleton loaders for smooth loading experience.
* "Access Denied" states for:

  * Expired links
  * Inactive QR codes

Creates a polished, professional landing experience instead of a basic redirect.

---

## 3️⃣ Wizard Integration

### New Section Added (Step 2)

**Gatekeeper & Security** section added to the QR creation wizard.

Users can:

* Enable Login Wall
* Enable Lead Capture
* Toggle features independently per QR code

This allows flexible control for each generated QR.

---

# Implementation Details

---

## Backend Changes

### QRCode Model Updates

Added the following fields:

```python
is_protected = models.BooleanField(default=False)
is_lead_capture = models.BooleanField(default=False)
```

### Database

* Applied migrations
* Ensured database schema is up to date

---

## Frontend Changes

### Types Updated

Updated:

* `WizardState`
* `GeneratedCode`

To include:

* `is_protected`
* `is_lead_capture`

---

### Hooks Updated

Updated `useWizard`:

* Handles saving and editing of security settings
* Persists gate configuration per QR code

---

### Components Modified

#### `QRViewer.tsx`

* Core authorization checking logic
* Renders Lead Capture form when required
* Handles access state logic

#### `index.tsx` (Wizard)

* Added UI toggles for:

  * Login Wall
  * Lead Capture

---

## Authentication Enhancement

Updated `useAuth` hook to:

* Respect the `next` URL parameter
* Automatically redirect users back to the intended QR content after login

Ensures seamless user experience.

---

# How To Use

1. Open QR Creation Wizard.
2. Go to **Step 2**.
3. Expand **Gatekeeper & Security** section.
4. Enable:

   * Login Wall (optional)
   * Lead Capture (optional)
5. Generate QR code.

---

# User Flow Example

### If Login Wall is Enabled

1. User scans QR.
2. Redirected to login page.
3. After login → Automatically redirected to QR content.

### If Lead Capture is Enabled

1. User scans QR.
2. Branded landing page appears.
3. User submits name & email.
4. Content is unlocked.

---

# Result

Your QR platform now supports:

* 🔐 Secure Content Access
* 📩 Lead Generation
* 🎨 Branded Viewing Experience
* ⚙️ Per-QR Security Configuration

The system upgrades your platform from a simple QR redirect tool to a **professional, marketing-ready dynamic QR management syst


# QR Scan Flow Architecture

This document explains the **two-stage scan logic** implemented in the QR platform. The system is designed for:

* Analytics tracking
* Dynamic destination updates
* Security (Gatekeeper features)
* Branded landing experience

---

# Overview

When a user scans a QR code, they are **not sent directly to the final file or website**. Instead, the request passes through a controlled backend flow that enables tracking, security checks, and dynamic content delivery.

The scan process consists of **four stages**:

1. Tracking Stage (Dynamic Redirector)
2. Landing Page Stage (Branded Viewer)
3. Gatekeeper Stage (Security & Lead Capture)
4. Final Content View

---

# 1. Tracking Stage (Dynamic Redirector)

When a QR code is scanned, the user first hits the backend redirect endpoint.

### Example URL

```
http://your-backend/r/ABCD12
```

### Hashids Slug Generation

The system uses the **Hashids Python library** to generate the slug (`ABCD12`).

Benefits:

* Hides internal database IDs
* Prevents link enumeration
* Makes links appear secure and cryptic

### Scan Tracking

Before redirecting the user, the backend records analytics information.

Captured data includes:

* Device type (Mobile / Desktop / Tablet)
* Operating System
* Browser
* IP Address
* Timestamp

This logic lives inside:

```
scans/views.py
```

### Redirect Handoff

After tracking, the backend determines the QR type and redirects the user to the frontend viewer.

Examples:

```
/view/ABCD12
/view/file/ABCD12
```

---

# 2. Landing Page Stage (Branded Viewer)

The user now lands inside the **React application** where the `QRViewer` component is responsible for rendering the experience.

### API Request

The frontend calls the backend endpoint:

```
/api/qrcodes/public/ABCD12/
```

### Data Returned

The backend returns QR code metadata including:

* destination link
* file URL
* QR settings
* gatekeeper configuration

### Dynamic File URL

The `file_url` is generated dynamically by the **Django serializer**.

This enables true **dynamic QR codes**.

Example:

* Printed QR → `/r/ABCD12`
* User uploads new PDF in dashboard
* Same QR code now serves the updated file

No reprinting required.

---

# 3. Gatekeeper Stage (Security & Lead Capture)

Before allowing access to the content, the system checks whether security gates are enabled.

## Lead Capture

If enabled:

The user sees a branded form requesting:

* Name
* Email

This is commonly used for:

* Whitepapers
* Marketing downloads
* Lead generation campaigns

## Secure Link Verification

The viewer shows a premium verification state:

```
Verifying Secure Link...
```

After validation:

```
Secure Link Verified
```

This creates a professional experience and reassures users that the link is legitimate.

---

# 4. Final Content View

Once the user passes the Gatekeeper checks:

### For PDF Content

Users can:

* Open the PDF in a new browser tab
* Use the embedded PDF viewer

### For Web Links

The viewer redirects the user to the final destination URL.

---

# Why This Architecture Is Better

## Analytics

Detailed insights about scans:

* Device distribution
* Browser usage
* Geographic data
* Scan timestamps

## Privacy Protection

Raw storage links such as:

```
/media/user_files/... 
```

are hidden behind the branded viewer layer.

## Flexibility

Administrators can:

* Replace files
* Change links
* Enable or disable lead capture

All **without reprinting existing QR codes**.

## Professional Experience

Users see:

* Branded landing page
* Secure verification indicator
* Smooth content loading

instead of a basic redirect.

---

# Secure Link Summary

The system combines:

* **Hashids (Python)** → Generates secure QR slugs
* **Redirect Tracking Endpoint** → Logs scan analytics
* **Frontend Viewer (React)** → Acts as a security wall
* **Dynamic API Retrieval** → Fetches the latest asset

This architecture ensures the QR platform remains:

* Secure
* Dynamic
* Trackable
* Marketing-ready

---

# Final Result

The platform evolves from a simple QR generator into a **fully featured dynamic QR management system with analytics, security gates, and branded delivery


