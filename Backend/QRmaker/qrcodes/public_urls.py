from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .public_api import ApiDocsView, ApiRootView, ApiTokenView, BulkCreateView, PublicQRCodeViewSet

router = DefaultRouter()
router.register(r"qrcodes", PublicQRCodeViewSet, basename="public-qrcode")

urlpatterns = [
    path("", ApiRootView.as_view(), name="api-v1-root"),
    path("docs/", ApiDocsView.as_view(), name="api-v1-docs"),
    path("token/", ApiTokenView.as_view(), name="api-v1-token"),
    path("bulk/", BulkCreateView.as_view(), name="api-v1-bulk"),
    path("", include(router.urls)),
]
