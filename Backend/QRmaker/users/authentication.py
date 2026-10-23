"""Bearer-token authentication for the public API.

The internal web app keeps using ``Authorization: Token <key>`` (DRF's default
TokenAuthentication). For B2B integrations we also accept the far more common
``Authorization: Bearer <key>`` form, backed by the same token table.
"""
from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """Accepts ``Authorization: Bearer <key>``.

    The keyword is only the header prefix - the credential is the same
    ``rest_framework.authtoken`` token, so rotating a key invalidates both.
    """

    keyword = "Bearer"
    model = None  # resolved lazily by TokenAuthentication.get_model()
