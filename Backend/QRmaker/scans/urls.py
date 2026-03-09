from django.urls import path
from .views import redirect_scan, capture_lead

urlpatterns = [
    path('', redirect_scan, name='redirect_scan'),
    path('capture-lead/', capture_lead, name='capture_lead'),
]
