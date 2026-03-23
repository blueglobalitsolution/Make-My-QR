from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CreateOrderView, VerifyPaymentView, 
    AdminSubscriptionPlanViewSet, AdminUserSubscriptionListView, AdminStatsView,
    SubscriptionPlanViewSet
)

router = DefaultRouter()
router.register(r'admin/plans', AdminSubscriptionPlanViewSet, basename='admin-plans')
router.register(r'plans', SubscriptionPlanViewSet, basename='plans')

urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users-subscriptions/', AdminUserSubscriptionListView.as_view(), name='admin-users-subscriptions'),
    path('', include(router.urls)),
]
