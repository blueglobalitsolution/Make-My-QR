import requests
from django.conf import settings

RECAPTCHA_SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
SCORE_THRESHOLD = 0.5


def verify_recaptcha(token):
    if not token:
        return False

    secret = getattr(settings, "RECAPTCHA_SECRET_KEY", "")
    if not secret:
        return False

    try:
        response = requests.post(
            RECAPTCHA_SITEVERIFY_URL,
            data={"secret": secret, "response": token},
            timeout=5,
        )
        result = response.json()
    except Exception:
        return False

    if not result.get("success"):
        return False

    score = result.get("score", 0)
    return score >= SCORE_THRESHOLD
