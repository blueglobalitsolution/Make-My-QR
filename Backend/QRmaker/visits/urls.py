from django.urls import path
from .views import TrackVisitView, AdminVisitStatsView, AdminVisitListView

urlpatterns = [
    path('track/', TrackVisitView.as_view(), name='track-visit'),
    path('admin/stats/', AdminVisitStatsView.as_view(), name='admin-visit-stats'),
    path('admin/list/', AdminVisitListView.as_view(), name='admin-visit-list'),
]
