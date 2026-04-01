from django.urls import path, include
from .views import (
    RegisterView, SendSignupOTPView, CustomObtainAuthToken, PasswordResetRequestView, AdminPasswordResetRequestView,
    PasswordResetVerifyView, PasswordResetConfirmView, UserProfileView, UserPasswordChangeView,
    AdminUserListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('send-signup-otp/', SendSignupOTPView.as_view(), name='send-signup-otp'),
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', UserPasswordChangeView.as_view(), name='change_password'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('admin-password-reset-request/', AdminPasswordResetRequestView.as_view(), name='admin_password_reset_request'),
    path('password-reset-verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
]
