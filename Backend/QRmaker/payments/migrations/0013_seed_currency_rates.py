"""Seed the display currencies.

Rates are units per 1 INR and were captured when this migration was written.
Run ``manage.py refresh_currency_rates`` (or edit them in the admin) to keep
them current.
"""
from django.db import migrations

EUROZONE = [
    "AD", "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE",
    "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK", "MC", "ME", "XK",
    "SM", "VA",
]

CURRENCIES = [
    ("INR", "Indian Rupee", "₹", "1", "nearest_1", ["IN"]),
    ("USD", "US Dollar", "$", "0.010537", "nearest_1",
     ["US", "EC", "SV", "PA", "PR", "TL", "ZW", "BQ"]),
    ("EUR", "Euro", "€", "0.009410", "nearest_1", EUROZONE),
    ("GBP", "British Pound", "£", "0.007879", "nearest_1",
     ["GB", "GG", "IM", "JE", "GI"]),
    ("AED", "UAE Dirham", "AED", "0.038700", "nearest_1", ["AE"]),
    ("AUD", "Australian Dollar", "A$", "0.015019", "nearest_1",
     ["AU", "KI", "NR", "TV"]),
    ("CAD", "Canadian Dollar", "C$", "0.014790", "nearest_1", ["CA"]),
    ("SGD", "Singapore Dollar", "S$", "0.013479", "nearest_1", ["SG"]),
    ("NZD", "New Zealand Dollar", "NZ$", "0.018544", "nearest_1",
     ["NZ", "CK", "NU", "TK"]),
    ("ZAR", "South African Rand", "R", "0.173998", "nearest_1",
     ["ZA", "LS", "NA", "SZ"]),
    ("MYR", "Malaysian Ringgit", "RM", "0.043078", "nearest_1", ["MY"]),
    ("SAR", "Saudi Riyal", "SAR", "0.039517", "nearest_1", ["SA"]),
    ("BDT", "Bangladeshi Taka", "৳", "1.305102", "nearest_1", ["BD"]),
    ("LKR", "Sri Lankan Rupee", "Rs", "3.506091", "nearest_1", ["LK"]),
    ("NPR", "Nepalese Rupee", "Rs", "1.600000", "nearest_1", ["NP"]),
    ("PKR", "Pakistani Rupee", "Rs", "2.921710", "nearest_1", ["PK"]),
    ("KES", "Kenyan Shilling", "KSh", "1.371399", "nearest_1", ["KE"]),
    ("NGN", "Nigerian Naira", "₦", "14.205534", "nearest_1", ["NG"]),
    ("JPY", "Japanese Yen", "¥", "1.655630", "nearest_10", ["JP"]),
]


def seed(apps, schema_editor):
    CurrencyRate = apps.get_model("payments", "CurrencyRate")
    for code, name, symbol, rate, rounding, countries in CURRENCIES:
        CurrencyRate.objects.get_or_create(
            code=code,
            defaults={
                "name": name,
                "symbol": symbol,
                "rate": rate,
                "rounding": rounding,
                "countries": countries,
                "is_active": True,
            },
        )


def unseed(apps, schema_editor):
    CurrencyRate = apps.get_model("payments", "CurrencyRate")
    CurrencyRate.objects.filter(code__in=[c[0] for c in CURRENCIES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0012_currencyrate"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
