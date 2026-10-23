"""Refresh the display currency rates from a free FX feed.

Usage:
    python manage.py refresh_currency_rates
    python manage.py refresh_currency_rates --dry-run

The feed returns rates relative to INR, which is exactly what
``CurrencyRate.rate`` stores. Failures are non-fatal: the previous rates stay
in place, so this can be wired to cron without risking the pricing page.
"""
from decimal import Decimal, InvalidOperation

import json
import urllib.request

from django.core.management.base import BaseCommand

from payments.models import CurrencyRate

FEED_URL = "https://open.er-api.com/v6/latest/INR"


class Command(BaseCommand):
    help = "Update CurrencyRate.rate from open.er-api.com"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Print without saving")
        parser.add_argument("--timeout", type=int, default=15)

    def handle(self, *args, **options):
        try:
            with urllib.request.urlopen(FEED_URL, timeout=options["timeout"]) as resp:
                payload = json.load(resp)
        except Exception as exc:  # network, JSON, HTTP
            self.stderr.write(f"Could not fetch rates: {exc}")
            return

        if payload.get("result") != "success":
            self.stderr.write(f"Feed returned: {payload.get('error-type') or payload}")
            return

        rates = payload.get("rates") or {}
        updated, skipped = [], []

        for currency in CurrencyRate.objects.all():
            if currency.code == "INR":
                continue
            raw = rates.get(currency.code)
            if raw is None:
                skipped.append(currency.code)
                continue
            try:
                value = Decimal(str(raw)).quantize(Decimal("0.000001"))
            except (InvalidOperation, TypeError):
                skipped.append(currency.code)
                continue

            if options["dry_run"]:
                self.stdout.write(f"{currency.code}: {currency.rate} -> {value}")
                continue

            currency.rate = value
            currency.save(update_fields=["rate", "updated_at"])
            updated.append(currency.code)

        if options["dry_run"]:
            return
        self.stdout.write(
            self.style.SUCCESS(
                f"Updated {len(updated)} rate(s); skipped {len(skipped)}"
                + (f" ({', '.join(skipped)})" if skipped else "")
            )
        )
