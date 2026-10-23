"""
Public, plan-gated REST API (B2B).

Everything here lives under /api/v1/ and requires:
  * a valid token via ``Authorization: Bearer <key>`` (or the legacy
    ``Authorization: Token <key>``)
  * a subscription plan with plan.can_use_api = True
  * for the bulk endpoint, additionally plan.can_bulk_create = True
  * a monthly API quota (plan.api_monthly_quota), enforced per request

The internal endpoints under /api/ are untouched, so the web app keeps working
exactly as before.
"""
import csv
import io

from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from hashids import Hashids
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle, SimpleRateThrottle
from rest_framework.views import APIView

from .models import ApiUsage, QRCode
from .serializers import QRCodeSerializer
from users.subscription_utils import (
    bulk_limit_for,
    can_use_api,
    can_use_bulk,
    get_subscription,
    is_subscription_active,
    remaining_qr_slots,
)

MAX_BULK_ROWS = 5000
DEFAULT_RATE_PER_MIN = 120


# --------------------------------------------------------------- permissions
class HasApiAccess(permissions.BasePermission):
    message = (
        "API access requires an active plan that includes the API. "
        "Upgrade your plan to use /api/v1/."
    )

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return can_use_api(user)


class HasBulkAccess(HasApiAccess):
    message = (
        "Bulk creation requires an active plan that includes bulk creation. "
        "Upgrade your plan to use this endpoint."
    )

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return can_use_bulk(user)


# ------------------------------------------------------------------ throttles
def _plan_for(user):
    sub = get_subscription(user)
    return sub.plan if sub and sub.plan else None


class PlanRateThrottle(SimpleRateThrottle):
    """Per-minute burst limit, honouring plan.api_rate_limit when set."""

    scope = "api"

    def allow_request(self, request, view):
        plan = _plan_for(request.user) if getattr(request, "user", None) else None
        per_min = (plan.api_rate_limit if plan and plan.api_rate_limit else DEFAULT_RATE_PER_MIN)
        self.rate = f"{per_min}/min"
        self.num_requests, self.duration = self.parse_rate(self.rate)
        request.api_rate_limit = per_min
        return super().allow_request(request, view)

    def get_cache_key(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        return self.cache_format % {"scope": self.scope, "ident": user.pk}


class MonthlyQuotaThrottle(BaseThrottle):
    """Counts every allowed call against the plan's monthly quota."""

    def allow_request(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return True

        request.api_quota = None
        request.api_used = None
        if user.is_superuser:
            return True

        plan = _plan_for(user)
        quota = plan.api_monthly_quota if plan else 0
        period = timezone.now().strftime("%Y-%m")
        request.api_period = period

        if quota <= 0:
            request.api_quota = 0
            request.api_used = 0
            return False

        usage, _ = ApiUsage.objects.get_or_create(user=user, period=period)
        if usage.calls >= quota:
            request.api_quota = quota
            request.api_used = usage.calls
            return False

        ApiUsage.objects.filter(pk=usage.pk).update(calls=F("calls") + 1)
        request.api_quota = quota
        request.api_used = usage.calls + 1
        return True


class ApiHeadersMixin:
    """Adds rate-limit / quota headers to every /api/v1/ response."""

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        quota = getattr(request, "api_quota", None)
        used = getattr(request, "api_used", None)
        if quota is not None:
            response["X-RateLimit-Limit"] = str(quota)
            response["X-RateLimit-Remaining"] = str(max(0, quota - (used or 0)))
            if getattr(request, "api_period", None):
                response["X-Quota-Period"] = request.api_period
        rate = getattr(request, "api_rate_limit", None)
        if rate:
            response["X-RateLimit-Rate"] = f"{rate}/min"
        return response


# ------------------------------------------------------------------- helpers
def _generate_slug(instance):
    hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
    instance.short_slug = hashids.encode(instance.id)
    instance.save(update_fields=["short_slug"])


def _create_one(user, data):
    payload = {
        "type": data.get("type") or "qr",
        "category": data.get("category") or "website",
        "name": data.get("name") or "Untitled",
        "value": data.get("value") or "",
    }
    for optional in ("is_dynamic", "is_protected", "is_lead_capture", "settings"):
        if data.get(optional) is not None:
            payload[optional] = data[optional]

    serializer = QRCodeSerializer(data=payload)
    serializer.is_valid(raise_exception=True)
    instance = serializer.save(user=user)
    _generate_slug(instance)
    return instance


def _rows_from_request(request):
    uploaded = request.FILES.get("file")
    if uploaded is not None:
        raw = uploaded.read().decode("utf-8-sig", errors="replace")
        reader = csv.DictReader(io.StringIO(raw))
        if not reader.fieldnames:
            raise ValueError("CSV appears to be empty.")
        missing = {"name", "value"} - {f.strip() for f in reader.fieldnames}
        if missing:
            raise ValueError(f"CSV is missing required column(s): {', '.join(sorted(missing))}")
        rows = []
        for i, row in enumerate(reader, start=2):
            clean = {(k or "").strip(): (v or "").strip() for k, v in row.items()}
            clean["_line"] = i
            rows.append(clean)
        return rows, "csv"

    data = request.data
    if isinstance(data, list):
        return data, "json"
    codes = data.get("codes") if isinstance(data, dict) else None
    if isinstance(codes, list):
        return codes, "json"
    raise ValueError('Send either a "codes" array or a CSV file in the "file" field.')


# ---------------------------------------------------------------- API views
class PublicQRCodeViewSet(ApiHeadersMixin, viewsets.ModelViewSet):
    """CRUD over the caller's QR codes. PATCH the `value` to change a destination."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]
    throttle_classes = [PlanRateThrottle, MonthlyQuotaThrottle]
    serializer_class = QRCodeSerializer

    def get_queryset(self):
        return QRCode.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        _generate_slug(instance)

    def create(self, request, *args, **kwargs):
        if not is_subscription_active(request.user):
            return Response(
                {"error": "Your subscription is not active."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )
        slots = remaining_qr_slots(request.user)
        if slots is not None and slots <= 0:
            return Response(
                {"error": "QR code limit reached for your current plan."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )
        return super().create(request, *args, **kwargs)


class BulkCreateView(ApiHeadersMixin, APIView):
    """Create many QR codes in one request, from JSON or a CSV upload."""

    permission_classes = [permissions.IsAuthenticated, HasBulkAccess]
    throttle_classes = [PlanRateThrottle, MonthlyQuotaThrottle]

    def post(self, request):
        if not is_subscription_active(request.user):
            return Response(
                {"error": "Your subscription is not active."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        try:
            rows, source = _rows_from_request(request)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        if not rows:
            return Response({"error": "No rows supplied."}, status=status.HTTP_400_BAD_REQUEST)
        if len(rows) > MAX_BULK_ROWS:
            return Response(
                {"error": f"Too many rows in one request (max {MAX_BULK_ROWS})."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        per_request = bulk_limit_for(request.user)
        if per_request is not None and len(rows) > per_request:
            return Response(
                {"error": f"Your plan allows at most {per_request} codes per bulk request."},
                status=status.HTTP_403_FORBIDDEN,
            )

        slots = remaining_qr_slots(request.user)
        if slots is not None and len(rows) > slots:
            return Response(
                {"error": f"You have {slots} QR code slot(s) left on this plan "
                          f"but submitted {len(rows)}."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        created, errors = [], []
        with transaction.atomic():
            for index, row in enumerate(rows):
                label = row.get("_line") or index + 1
                try:
                    instance = _create_one(request.user, row)
                except Exception as exc:
                    detail = exc.detail if hasattr(exc, "detail") else str(exc)
                    errors.append({"row": label, "error": detail})
                    continue
                created.append(instance)

            if errors:
                transaction.set_rollback(True)
                return Response(
                    {
                        "error": "Bulk creation failed. No codes were created.",
                        "created": 0,
                        "failed": len(errors),
                        "rows": errors[:50],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = QRCodeSerializer(created, many=True)
        return Response(
            {"source": source, "created": len(created), "codes": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class ApiTokenView(ApiHeadersMixin, APIView):
    """Return (or rotate) the token used for /api/v1/ requests."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]
    throttle_classes = [PlanRateThrottle, MonthlyQuotaThrottle]

    def get(self, request):
        token, _ = Token.objects.get_or_create(user=request.user)
        return Response(
            {
                "token": token.key,
                "header": "Authorization: Bearer <token>",
                "also_accepted": "Authorization: Token <token>",
                "base_url": f"{request.scheme}://{request.get_host()}/api/v1/",
                "docs": f"{request.scheme}://{request.get_host()}/api/v1/docs/",
            }
        )

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.create(user=request.user)
        return Response({"token": token.key, "rotated": True})


class ApiRootView(ApiHeadersMixin, APIView):
    """Discovery document: plan, quotas, usage and every endpoint."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]
    throttle_classes = [PlanRateThrottle, MonthlyQuotaThrottle]

    def get(self, request):
        sub = get_subscription(request.user)
        plan = sub.plan if sub and sub.plan else None
        base = f"{request.scheme}://{request.get_host()}/api/v1/"
        period = timezone.now().strftime("%Y-%m")
        usage = ApiUsage.objects.filter(user=request.user, period=period).first()

        return Response(
            {
                "service": "Make My QR Code API",
                "version": "v1",
                "auth": "Authorization: Bearer <key>   (GET /api/v1/token/)",
                "plan": {
                    "name": plan.name if plan else None,
                    "can_use_api": bool(plan and plan.can_use_api),
                    "can_bulk_create": bool(plan and plan.can_bulk_create),
                    "qr_limit": plan.qr_limit if plan else 0,
                    "bulk_limit": bulk_limit_for(request.user),
                    "remaining_slots": remaining_qr_slots(request.user),
                    "api_monthly_quota": plan.api_monthly_quota if plan else 0,
                    "api_rate_limit_per_min": (plan.api_rate_limit or DEFAULT_RATE_PER_MIN) if plan else 0,
                },
                "usage": {
                    "period": period,
                    "calls": usage.calls if usage else 0,
                    "limit": plan.api_monthly_quota if plan else 0,
                    "remaining": max(0, (plan.api_monthly_quota if plan else 0) - (usage.calls if usage else 0)),
                },
                "endpoints": {
                    "list": f"GET {base}qrcodes/",
                    "create": f"POST {base}qrcodes/",
                    "retrieve": f"GET {base}qrcodes/{{id}}/",
                    "update_destination": f'PATCH {base}qrcodes/{{id}}/  body: {{"value": "https://new-url"}}',
                    "delete": f"DELETE {base}qrcodes/{{id}}/",
                    "bulk_json": f'POST {base}bulk/  body: {{"codes": [{{...}}]}}',
                    "bulk_csv": f"POST {base}bulk/  multipart file=@codes.csv",
                    "token": f"GET {base}token/",
                    "docs": f"GET {base}docs/",
                },
                "csv_columns": "name,value,category,type (category defaults to 'website', type to 'qr')",
            }
        )


DOCS_HTML = """<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Make My QR Code - API v1 Documentation</title>
<style>
 :root{--red:#bd1819;--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--bg:#f9fafb}
 *{box-sizing:border-box}
 body{margin:0;font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;color:#374151;background:#fff}
 header{background:var(--red);color:#fff;padding:40px 20px}
 .wrap{max-width:900px;margin:0 auto}
 header h1{margin:0 0 6px;font-size:30px}
 header p{margin:0;opacity:.9;font-size:15px}
 main{padding:36px 20px 80px}
 h2{font-size:22px;color:var(--ink);margin:44px 0 12px;padding-top:8px;border-top:1px solid var(--line)}
 h2:first-of-type{border-top:none;margin-top:0}
 h3{font-size:16px;color:var(--ink);margin:26px 0 8px}
 p{color:#374151}
 code{background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:1px 6px;font-size:13.5px}
 pre{background:#111827;color:#e5e7eb;border-radius:8px;padding:16px 18px;overflow:auto;font-size:13.5px;line-height:1.6}
 pre .c{color:#9ca3af}
 table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
 th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
 th{background:var(--bg);color:var(--ink);font-weight:700}
 td code{white-space:nowrap}
 .pill{display:inline-block;background:#fef2f2;color:var(--red);font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:10px}
 .note{background:#fff7ed;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:6px;font-size:14.5px;margin:16px 0}
 .ok{color:#047857;font-weight:700}
</style></head><body>
<header><div class="wrap">
 <h1>Make My QR Code - API v1</h1>
 <p>Create, bulk-import and re-point QR codes programmatically.</p>
</div></header>
<main><div class="wrap">

<p class="pill">B2B API</p>

<h2>Authentication</h2>
<p>Every request needs a token in the <code>Authorization</code> header. Bearer is the
standard form; the legacy <code>Token</code> prefix is still accepted.</p>
<pre><span class="c"># preferred</span>
Authorization: Bearer YOUR_API_TOKEN

<span class="c"># also accepted</span>
Authorization: Token YOUR_API_TOKEN</pre>
<p>Get your token with <code>GET /api/v1/token/</code> (authenticated with your normal
account credentials), or from the API tab in your dashboard. Rotating it with
<code>POST /api/v1/token/</code> invalidates the previous key immediately.</p>

<h2>Quickstart</h2>
<pre>BASE=https://app.makemyqrcode.com/api/v1
TOKEN=YOUR_API_TOKEN

<span class="c"># 1. check plan, quota and usage</span>
curl -s -H "Authorization: Bearer $TOKEN" $BASE/

<span class="c"># 2. create one QR code</span>
curl -s -X POST "$BASE/qrcodes/" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Table 1","category":"website","value":"https://example.com/menu"}'

<span class="c"># 3. re-point it after printing (dynamic codes only)</span>
curl -s -X PATCH "$BASE/qrcodes/42/" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"value":"https://example.com/new-menu"}'</pre>

<h2>Endpoints</h2>
<table>
<tr><th>Method</th><th>Path</th><th>Purpose</th></tr>
<tr><td>GET</td><td><code>/api/v1/</code></td><td>Plan, quota, usage and endpoint discovery</td></tr>
<tr><td>GET</td><td><code>/api/v1/token/</code></td><td>Read your token</td></tr>
<tr><td>POST</td><td><code>/api/v1/token/</code></td><td>Rotate your token</td></tr>
<tr><td>GET</td><td><code>/api/v1/qrcodes/</code></td><td>List your QR codes</td></tr>
<tr><td>POST</td><td><code>/api/v1/qrcodes/</code></td><td>Create one QR code</td></tr>
<tr><td>GET</td><td><code>/api/v1/qrcodes/{id}/</code></td><td>Retrieve one</td></tr>
<tr><td>PATCH</td><td><code>/api/v1/qrcodes/{id}/</code></td><td>Change the destination after printing</td></tr>
<tr><td>DELETE</td><td><code>/api/v1/qrcodes/{id}/</code></td><td>Delete one</td></tr>
<tr><td>POST</td><td><code>/api/v1/bulk/</code></td><td>Create up to 5,000 codes from JSON or CSV</td></tr>
</table>

<h2>Create a QR code</h2>
<pre>POST /api/v1/qrcodes/
Content-Type: application/json

{
  "name": "Menu - Table 1",
  "category": "website",
  "value": "https://example.com/menu",
  "type": "qr"
}</pre>
<p><code>category</code> defaults to <code>website</code>, <code>type</code> to <code>qr</code>.
Optional: <code>is_dynamic</code>, <code>is_protected</code>, <code>is_lead_capture</code>, <code>settings</code>.
The response includes <code>id</code>, <code>short_slug</code> and <code>short_url</code>.</p>

<h2>Change the destination after printing</h2>
<pre>PATCH /api/v1/qrcodes/{id}/
Content-Type: application/json

{ "value": "https://example.com/new-destination" }</pre>
<p>The printed code never changes - only where it points. This works for dynamic
codes; a static code stores its data inside the pattern and cannot be re-pointed.</p>

<h2>Bulk create</h2>
<h3>JSON</h3>
<pre>POST /api/v1/bulk/
Content-Type: application/json

{
  "codes": [
    { "name": "Table 1", "category": "website", "value": "https://example.com/1" },
    { "name": "Table 2", "category": "website", "value": "https://example.com/2" }
  ]
}</pre>
<h3>CSV</h3>
<pre>POST /api/v1/bulk/
Content-Type: multipart/form-data

file=@codes.csv</pre>
<pre>name,value,category
Table 1,https://example.com/1,website
Table 2,https://example.com/2,website</pre>
<div class="note">
<strong>All-or-nothing.</strong> If any row fails validation the entire batch is
rolled back and nothing is created. The response names the offending row and field:
<pre>{
  "error": "Bulk creation failed. No codes were created.",
  "created": 0,
  "failed": 1,
  "rows": [{ "row": 2, "error": { "value": ["This field may not be blank."] } }]
}</pre>
</div>

<h2>Quotas and rate limits</h2>
<table>
<tr><th>Plan</th><th>Price</th><th>API calls / month</th><th>QR codes</th><th>Bulk per upload</th></tr>
<tr><td>Basic</td><td>Rs 99</td><td>-</td><td>50</td><td>-</td></tr>
<tr><td>Pro</td><td>Rs 299</td><td>5,000</td><td>250</td><td>100</td></tr>
<tr><td>Business</td><td>Rs 799</td><td>25,000</td><td>1,000</td><td>500</td></tr>
<tr><td>Enterprise</td><td>Rs 2,499</td><td>100,000</td><td>20,000</td><td>1,000</td></tr>
</table>
<p>Every successful call returns the remaining allowance:</p>
<pre>X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4987
X-RateLimit-Rate: 120/min
X-Quota-Period: 2026-10</pre>
<p>Exceeding the per-minute rate returns <code>429</code> with a <code>Retry-After</code>
header. Exceeding the monthly quota returns <code>429</code> until the first day of the
next month.</p>

<h2>Errors</h2>
<table>
<tr><th>Status</th><th>Meaning</th></tr>
<tr><td>401</td><td>Missing or invalid token</td></tr>
<tr><td>403</td><td>Plan does not include API / bulk creation, or bulk_limit exceeded</td></tr>
<tr><td>402</td><td>Subscription inactive, or QR code limit reached</td></tr>
<tr><td>400</td><td>Validation failed (see <code>rows</code> for bulk)</td></tr>
<tr><td>429</td><td>Rate limit or monthly quota exceeded</td></tr>
</table>

<h2>Notes</h2>
<ul>
<li>Requests count against your monthly quota only when they pass the rate limiter.</li>
<li>Token auth is per account; rotate the key if it is ever exposed.</li>
<li><code>is_dynamic</code> codes are the ones you can edit after printing.</li>
</ul>

</div></main></body></html>"""


class ApiDocsView(APIView):
    """Public, unauthenticated API reference."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        from django.http import HttpResponse
        return HttpResponse(DOCS_HTML, content_type="text/html; charset=utf-8")
