from rest_framework import status
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.cache import cache
import random
from .email_utils import send_welcome_email, send_otp_email, send_signup_otp_email
from rest_framework.permissions import IsAuthenticated, IsAdminUser


def get_user_subscription_data(user):
    from payments.models import UserSubscription, SubscriptionPlan
    from django.utils import timezone
    from datetime import timedelta

    try:
        subscription = UserSubscription.objects.get(user=user)
        plan = subscription.plan

        # Check if expired
        if subscription.expiry_date and subscription.expiry_date < timezone.now():
            return {
                "plan": "expired",
                "expiry_date": subscription.expiry_date,
                "is_active": False,
                "plan_details": {
                    "name": plan.name,
                    "qr_limit": plan.qr_limit,
                    "can_create_dynamic": plan.can_create_dynamic,
                    "can_create_pdf": plan.can_create_pdf,
                    "can_create_business": plan.can_create_business,
                    "can_password_protect": plan.can_password_protect,
                    "can_lead_capture": plan.can_lead_capture,
                    "can_access_analytics": plan.can_access_analytics,
                    "upload_limit_mb": plan.upload_limit_mb,
                    "is_lifetime": plan.is_lifetime,
                },
                "days_remaining": 0
            }

        # Refresh status on every check to ensure accuracy
        subscription.refresh_status()
        
        import math
        time_left = subscription.expiry_date - timezone.now()
        days_remaining = max(0, math.ceil(time_left.total_seconds() / 86400))
        is_trial = "trial" in plan.name.lower()

        return {
            "plan": "trial" if is_trial else plan.name.lower(),
            "status": subscription.status,
            "expiry_date": subscription.expiry_date,
            "is_active": subscription.is_active,
            "plan_details": {
                "name": plan.name,
                "qr_limit": plan.qr_limit,
                "can_create_dynamic": plan.can_create_dynamic,
                "can_create_pdf": plan.can_create_pdf,
                "can_create_business": plan.can_create_business,
                "can_password_protect": plan.can_password_protect,
                "can_lead_capture": plan.can_lead_capture,
                "can_access_analytics": plan.can_access_analytics,
                "upload_limit_mb": plan.upload_limit_mb,
                "is_lifetime": plan.is_lifetime,
            },
            "days_remaining": days_remaining,
            "trial_end_date": subscription.expiry_date if is_trial else None
        }

    except UserSubscription.DoesNotExist:
        # Automatically grant 7-day trial to existing users who don't have a plan
        trial_plan = SubscriptionPlan.objects.filter(name__icontains='Trial').first()
        if trial_plan:
            subscription = UserSubscription.objects.create(
                user=user,
                plan=trial_plan,
                expiry_date=timezone.now() + timedelta(days=7),
                is_active=True
            )
            return {
                "plan": "trial",
                "expiry_date": subscription.expiry_date,
                "is_active": True,
                "plan_details": {
                    "name": trial_plan.name,
                    "qr_limit": trial_plan.qr_limit,
                    "can_create_dynamic": trial_plan.can_create_dynamic,
                    "can_create_pdf": trial_plan.can_create_pdf,
                    "can_create_business": trial_plan.can_create_business,
                    "can_password_protect": trial_plan.can_password_protect,
                    "can_lead_capture": trial_plan.can_lead_capture,
                    "can_access_analytics": trial_plan.can_access_analytics,
                    "upload_limit_mb": trial_plan.upload_limit_mb,
                    "is_lifetime": trial_plan.is_lifetime,
                },
                "days_remaining": 7
            }

        # Fallback if Trial plan doesn't exist (should not happen after setup)
        return {
            "plan": "free",
            "expiry_date": None,
            "is_active": True,
            "plan_details": {
                "name": "Free",
                "qr_limit": 1,
                "can_create_dynamic": False,
                "can_create_pdf": False,
                "can_create_business": False,
                "can_password_protect": False,
                "can_lead_capture": False,
                "can_access_analytics": False,
                "upload_limit_mb": 1,
                "is_lifetime": False,
            },
            "days_remaining": 0
        }


class CustomObtainAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        from django.contrib.auth import authenticate

        data = request.data.copy()
        username_or_email = data.get("username")
        password = data.get("password")

        if not username_or_email or not password:
            return Response(
                {"error": "Please provide both username/email and password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1. Identify User (Check if exists)
        user = None
        if "@" in username_or_email:
            user = User.objects.filter(email=username_or_email).first()
        else:
            user = User.objects.filter(username=username_or_email).first()

        if not user:
            return Response(
                {"error": "User not found. Please register first."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 2. Authenticate Password
        authenticated_user = authenticate(username=user.username, password=password)
        if not authenticated_user:
            return Response(
                {"error": "Incorrect password. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # 3. Handle Session/Token
        # Clear existing session if any (prevents 400 errors in incognito/multi-tab)
        from django.contrib.auth import logout
        logout(request)

        token, created = Token.objects.get_or_create(user=authenticated_user)
        
        return Response(
            {
                "token": token.key,
                "user_id": authenticated_user.id,
                "username": authenticated_user.username,
                "email": authenticated_user.email,
                "first_name": authenticated_user.first_name,
                "last_name": authenticated_user.last_name,
                "is_staff": authenticated_user.is_staff,
                "is_superuser": authenticated_user.is_superuser,
                "user": {
                    "id": authenticated_user.id,
                    "username": authenticated_user.username,
                    "email": authenticated_user.email,
                    "first_name": authenticated_user.first_name,
                    "last_name": authenticated_user.last_name,
                    "is_staff": authenticated_user.is_staff,
                    "is_superuser": authenticated_user.is_superuser,
                },
                "subscription": get_user_subscription_data(authenticated_user),
            }
        )


class SendSignupOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "This email is already registered"}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))
        cache_key = f"signup_otp_{email}"
        
        try:
            cache.set(cache_key, otp, timeout=600)  # 10 minutes
            success = send_signup_otp_email(email, otp)
            if not success:
                raise Exception("Email failed to send")
            return Response({"message": "Verification code sent to your email"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"SIGNUP OTP FAIL: {e}")
            return Response({"error": "Failed to send verification code. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")

        otp = request.data.get("otp")

        if not username or not password or not email or not otp:
            return Response(
                {"error": "Please provide all fields and verification code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify OTP
        cache_key = f"signup_otp_{email}"
        cached_otp = cache.get(cache_key)
        
        if not cached_otp or str(cached_otp) != str(otp):
            return Response(
                {"error": "Invalid or expired verification code. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        from folders.models import Folder
        from payments.models import UserSubscription, SubscriptionPlan
        from datetime import timedelta

        Folder.objects.create(user=user, name=username, is_root=True)

        # Create 7-day Trial subscription for new users
        trial_plan = SubscriptionPlan.objects.filter(name__icontains='Trial').first()
        if trial_plan:
             UserSubscription.objects.create(
                user=user,
                plan=trial_plan,
                expiry_date=timezone.now() + timedelta(days=7),
                is_active=True
            )

        token, _ = Token.objects.get_or_create(user=user)

        # Send welcome email (don't fail registration if email fails)
        try:
            send_welcome_email(email, username)
        except Exception as e:
            print(f"Welcome email failed: {e}")

        return Response(
            {
                "token": token.key,
                "user_id": user.pk,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "subscription": get_user_subscription_data(user),
                "is_staff": user.is_staff,
                "message": "Welcome! You have been granted a 7-day free trial with premium features."
            }
        )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "subscription": get_user_subscription_data(user),
                "is_staff": user.is_staff,
            }
        )

    def put(self, request):
        user = request.user
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.email = request.data.get("email", user.email)
        user.save()
        return Response(
            {
                "message": "Profile updated successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            }
        )


class UserPasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_password = request.data.get("new_password")
        if not new_password:
            return Response(
                {"error": "New password is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"})


class TokenRefreshView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete old token and create a new one
        Token.objects.filter(user=request.user).delete()
        new_token = Token.objects.create(user=request.user)
        return Response({
            "token": new_token.key,
            "message": "Token refreshed successfully"
        })


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {"error": "No user exists with this email"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
             return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
        try:
            # Store OTP in cache for 3 minutes (180 seconds)
            cache.set(f"otp_{email}", otp, timeout=180)
        except Exception as e:
            # Handle Redis connection errors gracefully
            print(f"Redis Cache Error: {e}")
            return Response(
                {"error": "Server temporary storage error (Redis). Please ensure the Redis server is running."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if send_otp_email(email, otp):
             return Response({"message": "OTP sent successfully"})
        else:
            return Response(
                {"error": "Failed to send OTP"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminPasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # specifically check for superuser with this email
            user = User.objects.filter(email=email, is_superuser=True).first()
            if not user:
                # check if ANY user exists to give a more specific error
                if User.objects.filter(email=email).exists():
                    return Response(
                        {"error": "You are not a super user"},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                return Response(
                    {"error": "No user exists with this email"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
        # Store OTP in cache for 3 minutes (180 seconds)
        cache.set(f"otp_{email}", otp, timeout=180)

        if send_otp_email(email, otp):
            return Response({"message": "OTP sent successfully"})
        else:
            return Response(
                {"error": "Failed to send OTP"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cached_otp = cache.get(f"otp_{email}")
        if not cached_otp:
            return Response(
                {"error": "OTP expired or not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cached_otp == otp:
            # Mark that OTP was verified (e.g., using a short-lived token or cache key)
            cache.set(
                f"verified_{email}", True, timeout=300
            )  # Valid for 5 more minutes to set password
            return Response({"message": "OTP verified successfully"})
        else:
            return Response(
                {"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response(
                {"error": "Email and new password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not cache.get(f"verified_{email}"):
            return Response(
                {"error": "OTP not verified or verification expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {"error": "Invalid email or user does not exist"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password(new_password)
            user.save()
            # Clear verification from cache
            cache.delete(f"verified_{email}")
            cache.delete(f"otp_{email}")
            return Response({"message": "Password reset successfully"})
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from qrcodes.models import QRCode
        from payments.models import UserSubscription
        from django.db.models import Count, OuterRef, Subquery

        # Get pagination parameters
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
        except ValueError:
            page = 1
            page_size = 20

        # Optimization: Use annotation for QR count and select_related for subscription
        # This solves the N+1 query problem (#9)
        users_queryset = User.objects.all().order_by("-date_joined").annotate(
            qr_count_anno=Count('qrcodes')
        ).prefetch_related('subscription__plan')

        # Apply search if provided (#15)
        search_query = request.query_params.get('search', '')
        if search_query:
            from django.db.models import Q
            users_queryset = users_queryset.filter(
                Q(username__icontains=search_query) | 
                Q(email__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            )

        total_users = users_queryset.count()
        
        # Apply pagination (#8)
        start = (page - 1) * page_size
        end = start + page_size
        paginated_users = users_queryset[start:end]

        data = []
        for user in paginated_users:
            # Try to get subscription data safely
            try:
                sub = user.subscription
                plan_name = sub.plan.name if sub.plan else "Trial/Free"
                plan_id = sub.plan.id if sub.plan else None
            except:
                plan_name = "Free"
                plan_id = None

            data.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_active": user.is_active,
                    "is_staff": user.is_staff,
                    "date_joined": user.date_joined,
                    "qr_count": user.qr_count_anno,
                    "plan_id": plan_id,
                    "plan_name": plan_name,
                }
            )

        return Response({
            "users": data,
            "total_count": total_users,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_users + page_size - 1) // page_size
        })

    def post(self, request):
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get("user_id")
        user_action = request.data.get("action")  # 'toggle_active' or 'delete'

        try:
            user = User.objects.get(id=user_id)
            if user.is_superuser:
                return Response(
                    {"error": "Cannot modify superuser"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if user_action == "toggle_active":
                user.is_active = not user.is_active
                user.save()
                return Response(
                    {
                        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully"
                    }
                )
            elif user_action == "delete":
                user.delete()
                return Response({"message": "User deleted successfully"})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
