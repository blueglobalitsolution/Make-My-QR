from django.urls import path
from .views import CaptureLeadView, AdminLeadListView

urlpatterns = [
    path('capture/', CaptureLeadView.as_view(), name='capture-lead'),
    path('admin/', AdminLeadListView.as_view(), name='admin-leads'),
]
