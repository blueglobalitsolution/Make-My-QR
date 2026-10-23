# Make My QR Code — Public API v1 (B2B)

Programmatic access to QR code creation, bulk import and destination editing.

**Base URL:** `https://app.makemyqrcode.com/api/v1/`
**Reference page:** `https://app.makemyqrcode.com/api/v1/docs/` (alias: `/api/docs/`)

---

## Authentication

Every request needs a token in the `Authorization` header.
**Bearer** is the standard form; the legacy `Token` prefix is still accepted.

```http
Authorization: Bearer YOUR_API_TOKEN
```

```http
Authorization: Token YOUR_API_TOKEN
```

```bash
# read your token
curl -s -H "Authorization: Bearer $TOKEN" https://app.makemyqrcode.com/api/v1/token/

# rotate it (invalidates the previous key immediately)
curl -s -X POST -H "Authorization: Bearer $TOKEN" https://app.makemyqrcode.com/api/v1/token/
```

Bearer and Token are the **same credential** — only the header prefix differs.

---

## Plans and quotas

| Plan | Price / month | API calls / month | Rate limit | QR codes | Bulk per upload |
|---|---:|---:|---:|---:|---:|
| Basic | ₹99 | — | — | 50 | — |
| **Pro** | **₹299** | **5,000** | 120/min | 250 | 100 |
| **Business** | **₹799** | **25,000** | 240/min | 1,000 | 500 |
| **Enterprise** | **₹2,499** | **100,000** | 600/min | 20,000 | 1,000 |

Cost per API call: **Pro ≈ ₹0.06**, vs QR TIGER's ≈ ₹0.45 (3,000 calls at $16).
A plan without `can_use_api` receives `403` on every `/api/v1/` request.

Every response carries the remaining allowance:

```http
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4987
X-RateLimit-Rate: 120/min
X-Quota-Period: 2026-10
```

- Per-minute limit exceeded → `429` with `Retry-After`.
- Monthly quota exceeded → `429` until the 1st of the next month.
- Quota is consumed only by requests that pass the rate limiter.

---

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/` | Plan, quota, usage and endpoint discovery |
| GET | `/api/v1/docs/` | This reference (public) |
| GET | `/api/v1/token/` | Read your token |
| POST | `/api/v1/token/` | Rotate your token |
| GET | `/api/v1/qrcodes/` | List your QR codes |
| POST | `/api/v1/qrcodes/` | Create one QR code |
| GET | `/api/v1/qrcodes/{id}/` | Retrieve one |
| PATCH | `/api/v1/qrcodes/{id}/` | Change the destination after printing |
| DELETE | `/api/v1/qrcodes/{id}/` | Delete one |
| POST | `/api/v1/bulk/` | Create up to 5,000 codes from JSON or CSV |

---

## Create a QR code

```http
POST /api/v1/qrcodes/
Content-Type: application/json

{
  "name": "Menu — Table 1",
  "category": "website",
  "value": "https://example.com/menu",
  "type": "qr"
}
```

`category` defaults to `website`, `type` to `qr`.
Optional: `is_dynamic`, `is_protected`, `is_lead_capture`, `settings`.

Response `201` includes `id`, `short_slug` and `short_url`.

---

## Change the destination after printing

```http
PATCH /api/v1/qrcodes/{id}/
Content-Type: application/json

{ "value": "https://example.com/new-destination" }
```

The printed code is unchanged; the redirect target updates immediately.
This applies to **dynamic** codes (`is_dynamic: true`) — a static code stores its
data inside the pattern and cannot be re-pointed.

---

## Bulk create

### JSON

```http
POST /api/v1/bulk/
Content-Type: application/json

{
  "codes": [
    { "name": "Table 1", "category": "website", "value": "https://example.com/1" },
    { "name": "Table 2", "category": "website", "value": "https://example.com/2" }
  ]
}
```

### CSV

```http
POST /api/v1/bulk/
Content-Type: multipart/form-data

file=@codes.csv
```

```csv
name,value,category
Table 1,https://example.com/1,website
Table 2,https://example.com/2,website
```

A UTF-8 BOM is tolerated, so files saved from Excel work as-is.

### Behaviour

- **All-or-nothing.** If any row fails validation the whole batch is rolled back.
- Failures report the offending line and field:

```json
{
  "error": "Bulk creation failed. No codes were created.",
  "created": 0,
  "failed": 1,
  "rows": [{ "row": 2, "error": { "value": ["This field may not be blank."] } }]
}
```

- `row` is the CSV line number (header is line 1) or the array index for JSON.
- Limits: `bulk_limit` rows per request, and the batch may not exceed the account's
  remaining `qr_limit` slots. Hard ceiling: 5,000 rows per request.

---

## Errors

| Status | Meaning |
|---|---|
| `401` | Missing or invalid token |
| `402` | Subscription inactive, or QR code limit reached |
| `403` | Plan excludes API / bulk creation, or `bulk_limit` exceeded |
| `400` | Validation failed (see `rows` for bulk) |
| `429` | Rate limit or monthly quota exceeded |

---

## Full example

```bash
BASE=https://app.makemyqrcode.com/api/v1
TOKEN=YOUR_API_TOKEN

# 1. plan, quota and usage
curl -s -H "Authorization: Bearer $TOKEN" $BASE/

# 2. bulk import from CSV
curl -s -X POST "$BASE/bulk/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@codes.csv"

# 3. re-point one code after printing
curl -s -X PATCH "$BASE/qrcodes/42/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":"https://example.com/seasonal-menu"}'
```

---

## Enabling it for a plan

Plans are edited through the admin dashboard (`/api/payments/admin/plans/{id}/`),
whose serializer exposes every field.

| Plan | can_use_api | can_bulk_create | bulk_limit | api_monthly_quota | api_rate_limit |
|---|---|---|---|---|---|
| Trial | false | false | 0 | 0 | 0 |
| Basic | false | false | 0 | 0 | 0 |
| Pro | true | true | 100 | 5,000 | 120 |
| Business | true | true | 500 | 25,000 | 240 |
| Enterprise | true | true | 1,000 | 100,000 | 600 |

New plans default to `false` / `0`, so the feature is opt-in per tier.
