"""Display-only currency localisation for plan prices.

Razorpay charges every order in INR (see ``CreateOrderView``). These helpers
therefore never change what is charged - they only translate the INR amount
into a nearby local figure so a visitor in, say, Germany sees roughly what the
plan costs them.
"""
import math
import os
from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings

from .models import CurrencyRate

DEFAULT_COUNTRY = "IN"
FALLBACK_CURRENCY = "USD"
BASE_CURRENCY = "INR"

# Headers set by common CDN / proxy setups when they know the visitor country.
COUNTRY_HEADERS = ("CF-IPCountry", "X-Country-Code", "X-Geo-Country")

_geo_reader = None
_geo_reader_path = None


def _geoip_reader():
    """Lazily open the DB-IP / MaxMind country database, if present."""
    global _geo_reader, _geo_reader_path
    path = str(getattr(settings, "GEOIP_COUNTRY_DB", "") or "")
    if not path or not os.path.exists(path):
        return None
    if _geo_reader is None or _geo_reader_path != path:
        try:
            import maxminddb

            _geo_reader = maxminddb.open_database(path)
            _geo_reader_path = path
        except Exception:
            _geo_reader = None
            return None
    return _geo_reader


def client_ips(request):
    """Candidate client IPs, most-trusted proxy hop first."""
    meta = getattr(request, "META", {}) or {}
    candidates = []
    forwarded = meta.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        parts = [p.strip() for p in forwarded.split(",") if p.strip()]
        # The right-most entry is the one our own proxy appended.
        candidates.extend(reversed(parts))
    for header in ("HTTP_X_REAL_IP", "REMOTE_ADDR"):
        value = meta.get(header)
        if value:
            candidates.append(value.strip())
    seen, unique = set(), []
    for ip in candidates:
        if ip not in seen:
            seen.add(ip)
            unique.append(ip)
    return unique


def client_ip(request):
    ips = client_ips(request)
    return ips[0] if ips else None


def country_from_ip(ip):
    if not ip:
        return None
    reader = _geoip_reader()
    if reader is None:
        return None
    try:
        record = reader.get(ip) or {}
    except Exception:
        return None
    code = ((record.get("country") or {}).get("iso_code") or "").upper()
    return code or None


def country_from_request(request):
    """First hop that resolves to a country wins."""
    for ip in client_ips(request):
        code = country_from_ip(ip)
        if code:
            return code
    return None


def resolve_country(request):
    """Best-effort ISO country for this request.

    Order of precedence: an explicit ``?country=`` (used by the currency
    switcher and for testing), then edge headers, then India.
    """
    raw = ""
    params = getattr(request, "query_params", None) or getattr(request, "GET", {})
    try:
        raw = params.get("country") or ""
    except Exception:
        raw = ""
    if not raw:
        for header in COUNTRY_HEADERS:
            try:
                raw = request.headers.get(header) or ""
            except Exception:
                raw = ""
            if raw:
                break

    code = str(raw).strip().upper()
    if len(code) != 2 or code in {"XX", "ZZ", "T1"}:
        # No edge header: fall back to a local lookup of the visitor's IP.
        code = country_from_request(request) or DEFAULT_COUNTRY
    return code


def active_currencies():
    return CurrencyRate.objects.filter(is_active=True).order_by("code")


def currency_by_code(code):
    code = str(code or "").strip().upper()
    if not code:
        return None
    return CurrencyRate.objects.filter(code=code, is_active=True).first()


def currency_for_country(country, explicit=None):
    """Currency row for a country, honouring an explicit user choice first."""
    if explicit:
        chosen = currency_by_code(explicit)
        if chosen:
            return chosen

    country = str(country or "").strip().upper()
    if country:
        for row in active_currencies():
            if country in (row.countries or []):
                return row

    return currency_by_code(FALLBACK_CURRENCY)


def resolve_currency(request):
    country = resolve_country(request)
    params = getattr(request, "query_params", None) or getattr(request, "GET", {})
    try:
        explicit = params.get("currency") or ""
    except Exception:
        explicit = ""
    return country, currency_for_country(country, explicit)


def round_money(value, mode):
    value = Decimal(str(value))
    if mode == "nearest_99":
        whole = math.ceil(value)
        return Decimal(whole) - Decimal("0.01") if whole > 0 else Decimal("0.99")
    if mode == "nearest_5":
        return Decimal(math.ceil(value / 5) * 5)
    if mode == "nearest_10":
        return Decimal(math.ceil(value / 10) * 10)
    if mode == "nearest_1":
        return value.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def localize_price(inr_amount, currency):
    """Convert an INR amount into ``currency`` for display.

    Returns ``(amount, currency_code, symbol)``. Amounts in INR are returned
    untouched so Indian visitors always see the exact charge.
    """
    if currency is None or currency.code == BASE_CURRENCY:
        return Decimal(str(inr_amount)), BASE_CURRENCY, "₹"

    rate = currency.rate or Decimal("0")
    if rate <= 0:
        return Decimal(str(inr_amount)), BASE_CURRENCY, "₹"

    converted = Decimal(str(inr_amount)) * rate
    return round_money(converted, currency.rounding), currency.code, currency.symbol or currency.code
