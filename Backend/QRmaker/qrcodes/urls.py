from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QRCodeViewSet, PublicQRCodeView, CaptureLeadView, VerifyPasswordView, GatekeeperConfigListView, PublicQRAccessStatusView

router = DefaultRouter()
router.register(r'', QRCodeViewSet, basename='qrcode')

urlpatterns = [
    path('public/<str:short_slug>/', PublicQRCodeView.as_view(), name='public-qrcode-detail'),
    path('<str:short_slug>/capture-lead/', CaptureLeadView.as_view(), name='api-capture-lead'),
    path('<str:short_slug>/verify-password/', VerifyPasswordView.as_view(), name='api-verify-password'),
    path('gatekeeper-config/', GatekeeperConfigListView.as_view(), name='gatekeeper-config'),
    path('public/<str:short_slug>/access-status/', PublicQRAccessStatusView.as_view(), name='public-access-status'),
    path('', include(router.urls)),
]
