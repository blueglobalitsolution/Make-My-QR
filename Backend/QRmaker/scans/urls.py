from django.urls import path
from .views import redirect_scan

urlpatterns = [
    path('', redirect_scan, name='redirect_scan'),
]
