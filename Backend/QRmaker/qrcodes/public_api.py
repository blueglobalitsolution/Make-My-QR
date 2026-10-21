"""
Public, plan-gated REST API.

Everything here lives under /api/v1/ and requires:
  * a valid DRF token (Authorization: Token <key>)
  * a subscription plan with plan.can_use_api = True
  * for the bulk endpoint, additionally plan.can_bulk_create = True

The internal endpoints under /api/ are untouched, so the web app keeps working
exactly as before.
"""
import csv
import io

from django.conf import settings
from django.db import transaction
from hashids import Hashids
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import QRCode
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


def _generate_slug(instance):
    hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
    instance.short_slug = hashids.encode(instance.id)
    instance.save(update_fields=["short_slug"])


def _create_one(user, data):
    """Create a single QR code from a dict. Raises ValidationError on bad data."""
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
    """Accept {"codes": [...]} JSON, a bare JSON list, or a CSV upload."""
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


class PublicQRCodeViewSet(viewsets.ModelViewSet):
    """CRUD over the caller's QR codes. PATCH the `value` to change a destination."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]
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


class BulkCreateView(APIView):
    """Create many QR codes in one request, from JSON or a CSV upload."""

    permission_classes = [permissions.IsAuthenticated, HasBulkAccess]

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
                {
                    "error": f"You have {slots} QR code slot(s) left on this plan "
                             f"but submitted {len(rows)}."
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        created, errors = [], []
        with transaction.atomic():
            for index, row in enumerate(rows):
                label = row.get("_line") or index + 1
                try:
                    instance = _create_one(request.user, row)
                except Exception as exc:  # serializer errors, bad data, etc.
                    detail = exc.detail if hasattr(exc, "detail") else str(exc)
                    errors.append({"row": label, "error": detail})
                    continue
                created.append(instance)

            # all-or-nothing: if any row failed, roll the batch back
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
            {
                "source": source,
                "created": len(created),
                "codes": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ApiTokenView(APIView):
    """Return (or rotate) the token used for /api/v1/ requests."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]

    def get(self, request):
        token, _ = Token.objects.get_or_create(user=request.user)
        return Response(
            {
                "token": token.key,
                "header": "Authorization: Token <token>",
                "base_url": f"{request.scheme}://{request.get_host()}/api/v1/",
            }
        )

    def post(self, request):
        """Rotate the token (invalidates the previous one)."""
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.create(user=request.user)
        return Response({"token": token.key, "rotated": True})


class ApiRootView(APIView):
    """Small discovery document so the API is self-describing."""

    permission_classes = [permissions.IsAuthenticated, HasApiAccess]

    def get(self, request):
        sub = get_subscription(request.user)
        plan = sub.plan if sub and sub.plan else None
        base = f"{request.scheme}://{request.get_host()}/api/v1/"
        return Response(
            {
                "service": "Make My QR Code API",
                "version": "v1",
                "auth": "Authorization: Token <key>  (GET /api/v1/token/)",
                "plan": {
                    "name": plan.name if plan else None,
                    "can_use_api": bool(plan and plan.can_use_api),
                    "can_bulk_create": bool(plan and plan.can_bulk_create),
                    "qr_limit": plan.qr_limit if plan else 0,
                    "bulk_limit": bulk_limit_for(request.user),
                    "remaining_slots": remaining_qr_slots(request.user),
                },
                "endpoints": {
                    "list": f"GET {base}qrcodes/",
                    "create": f"POST {base}qrcodes/",
                    "retrieve": f"GET {base}qrcodes/{{id}}/",
                    "update_destination": f"PATCH {base}qrcodes/{{id}}/  body: {{\"value\": \"https://new-url\"}}",
                    "delete": f"DELETE {base}qrcodes/{{id}}/",
                    "bulk_json": f"POST {base}bulk/  body: {{\"codes\": [{{...}}]}}",
                    "bulk_csv": f"POST {base}bulk/  multipart file=@codes.csv",
                    "token": f"GET {base}token/",
                },
                "csv_columns": "name,value,category,type (category defaults to 'website', type to 'qr')",
            }
        )
