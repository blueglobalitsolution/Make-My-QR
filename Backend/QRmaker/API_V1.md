# Make My QR Code — Public API v1

Programmatic access to QR code creation, bulk import and destination editing.

Base URL: `https://app.makemyqrcode.com/api/v1/`

## Access

The API is a **paid-plan feature**. A plan must have:

| Flag | Controls |
|---|---|
| `can_use_api` | Access to `/api/v1/` at all |
| `can_bulk_create` | Access to `POST /api/v1/bulk/` |
| `bulk_limit` | Max rows per bulk request (0 = fall back to `qr_limit`) |
| `qr_limit` | Total QR codes the account may hold |

Requests from a plan without `can_use_api` return:

```json
403 {"detail": "API access requires an active plan that includes the API. Upgrade your plan to use /api/v1/."}
```

## Authentication

Token authentication, the same token issued at login.

```http
Authorization: Token <your-token>
```

Fetch or rotate it:

- `GET  /api/v1/token/` → `{"token": "...", "header": "Authorization: Token <token>"}`
- `POST /api/v1/token/` → rotates the token, invalidating the previous one

## Discovery

`GET /api/v1/` returns the service description, your plan limits and every endpoint. Useful as a smoke test.

## Endpoints

### List QR codes
```http
GET /api/v1/qrcodes/
```

### Create one QR code
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

`category` defaults to `website`, `type` to `qr`. Optional: `is_dynamic`, `is_protected`, `is_lead_capture`, `settings`.

Response `201` includes `id`, `short_slug` and `short_url`.

### Change the destination after printing
```http
PATCH /api/v1/qrcodes/{id}/
Content-Type: application/json

{ "value": "https://example.com/new-destination" }
```

The printed code is unchanged; the redirect target updates immediately. This only
applies to dynamic codes (`is_dynamic: true`) — a static code encodes its data
directly and cannot be repointed.

### Delete
```http
DELETE /api/v1/qrcodes/{id}/
```

### Bulk create — JSON
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

### Bulk create — CSV
```http
POST /api/v1/bulk/
Content-Type: multipart/form-data

file=@codes.csv
```

CSV columns: `name`, `value`, and optionally `category`, `type`. A UTF-8 BOM is
tolerated, so a file saved from Excel works as-is.

```csv
name,value,category
Table 1,https://example.com/1,website
Table 2,https://example.com/2,website
```

### Bulk behaviour

- **All-or-nothing.** If any row fails validation the whole batch is rolled back
  and nothing is created, so a bad line never leaves you with a half-imported set.
- Failures return the offending row and field:
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
  remaining `qr_limit` slots.
- Hard ceiling: 5,000 rows per request.

## Errors

| Status | Meaning |
|---|---|
| `401` | Missing or invalid token |
| `403` | Plan does not include API / bulk creation, or `bulk_limit` exceeded |
| `402` | Subscription inactive, or QR limit reached |
| `400` | Validation failed (see `rows`) |

## Example: full workflow

```bash
BASE=https://app.makemyqrcode.com/api/v1
TOKEN=<your-token>

# 1. check plan + limits
curl -s -H "Authorization: Token $TOKEN" $BASE/

# 2. bulk import from CSV
curl -s -X POST "$BASE/bulk/" \
  -H "Authorization: Token $TOKEN" \
  -F "file=@codes.csv"

# 3. repoint one code after printing
curl -s -X PATCH "$BASE/qrcodes/42/" \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":"https://example.com/seasonal-menu"}'
```

## Enabling it for a plan

Plans are edited through the admin dashboard (`/api/payments/admin/plans/{id}/`),
whose serializer exposes every field. Current state:

| Plan | can_use_api | can_bulk_create | bulk_limit |
|---|---|---|---|
| Trial | false | false | 0 |
| Basic | true | true | 50 |
| Godmode | true | true | 0 (uses `qr_limit`) |

New plans default to `false` / `false` / `0`, so the feature is opt-in per plan.
