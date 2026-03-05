from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QRCodeViewSet, PublicQRCodeView

router = DefaultRouter()
router.register(r'', QRCodeViewSet, basename='qrcode')

urlpatterns = [
    path('public/<str:short_slug>/', PublicQRCodeView.as_view(), name='public-qrcode-detail'),
    path('', include(router.urls)),
]
