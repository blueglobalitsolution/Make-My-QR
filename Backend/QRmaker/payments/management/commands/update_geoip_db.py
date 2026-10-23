"""Download the current DB-IP Lite country database.

Usage:
    python manage.py update_geoip_db
    python manage.py update_geoip_db --month 2026-10

DB-IP Lite is CC BY 4.0 (https://db-ip.com). Wire this to a monthly cron so
country detection does not drift as IP blocks are reallocated.
"""
import gzip
import os
import tempfile
import urllib.request
from datetime import date

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

URL = "https://download.db-ip.com/free/dbip-country-lite-{month}.mmdb.gz"


class Command(BaseCommand):
    help = "Update the DB-IP Lite country database used for price localisation"

    def add_arguments(self, parser):
        parser.add_argument("--month", help="YYYY-MM (defaults to this month)")
        parser.add_argument("--timeout", type=int, default=60)

    def handle(self, *args, **options):
        target = str(getattr(settings, "GEOIP_COUNTRY_DB", "") or "")
        if not target:
            raise CommandError("GEOIP_COUNTRY_DB is not configured.")

        month = options["month"] or date.today().strftime("%Y-%m")
        url = URL.format(month=month)

        self.stdout.write(f"Downloading {url}")
        try:
            with urllib.request.urlopen(url, timeout=options["timeout"]) as resp:
                raw = resp.read()
        except Exception as exc:
            raise CommandError(f"Download failed: {exc}")

        try:
            payload = gzip.decompress(raw)
        except Exception as exc:
            raise CommandError(f"Not a gzip archive: {exc}")

        if len(payload) < 1_000_000:
            raise CommandError(f"Archive looks truncated ({len(payload)} bytes).")

        os.makedirs(os.path.dirname(target), exist_ok=True)
        fd, tmp = tempfile.mkstemp(dir=os.path.dirname(target), suffix=".mmdb")
        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(payload)
            # Sanity-check before swapping it in.
            import maxminddb

            reader = maxminddb.open_database(tmp)
            record = reader.get("8.8.8.8") or {}
            reader.close()
            if not (record.get("country") or {}).get("iso_code"):
                raise CommandError("Downloaded database does not look valid.")
            os.replace(tmp, target)
        finally:
            if os.path.exists(tmp):
                os.unlink(tmp)

        self.stdout.write(self.style.SUCCESS(f"Updated {target} ({len(payload) / 1e6:.1f} MB)"))
