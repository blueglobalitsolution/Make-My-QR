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
from .email_utils import send_welcome_email, send_otp_email
from rest_framework.permissions import IsAuthenticated

def get_user_subscription_data(user):
    from payments.models import UserSubscription
    try:
        sub = UserSubscription.objects.get(user=user)
        if sub.is_active and (not sub.expiry_date or sub.expiry_date > timezone.now()):
            plan = sub.plan
            if plan:
                return {
                    'plan': plan.name.lower(),
                    'plan_details': {
                        'name': plan.name,
                        'qr_limit': plan.qr_limit,
                        'can_create_dynamic': plan.can_create_dynamic,
                        'can_create_pdf': plan.can_create_pdf,
                        'can_create_business': plan.can_create_business,
                        'can_password_protect': plan.can_password_protect,
                        'can_lead_capture': plan.can_lead_capture,
                        'can_access_analytics': plan.can_access_analytics,
                    },
                    'expiry_date': sub.expiry_date.isoformat() if sub.expiry_date else None,
                    'is_active': True
                }
    except UserSubscription.DoesNotExist:
        pass
    
    return {
        'plan': 'free',
        'plan_details': {
            'name': 'Free',
            'qr_limit': 5,
            'can_create_dynamic': False,
            'can_create_pdf': False,
            'can_create_business': False,
            'can_password_protect': False,
            'can_lead_capture': False,
            'can_access_analytics': False,
        },
        'expiry_date': None,
        'is_active': False
    }
class CustomObtainAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        username_or_email = data.get('username')
        
        # If the provided username looks like an email, try to find the user by email
        if username_or_email and '@' in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
                data['username'] = user.username
            except User.DoesNotExist:
                pass
            except User.MultipleObjectsReturned:
                # If there are multiple users with the same email, pick the first one
                user = User.objects.filter(email=username_or_email).first()
                data['username'] = user.username

        serializer = self.serializer_class(data=data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not username or not password or not email:
            return Response({'error': 'Please provide all fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(
            username=username, 
            email=email, 
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        from folders.models import Folder
        Folder.objects.create(user=user, name=username, is_root=True)

        token, _ = Token.objects.get_or_create(user=user)
        
        # Send welcome email
        send_welcome_email(email, username)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'subscription': get_user_subscription_data(user),
            'is_staff': user.is_staff
        })

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'subscription': get_user_subscription_data(user),
            'is_staff': user.is_staff
        })

    def put(self, request):
        user = request.user
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        })

class UserPasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'error': 'New password is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = request.user
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user exists with this email'}, status=status.HTTP_404_NOT_FOUND)
        
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        # Store OTP in cache for 3 minutes (180 seconds)
        cache.set(f'otp_{email}', otp, timeout=180)
        
        if send_otp_email(email, otp):
            return Response({'message': 'OTP sent successfully'})
        else:
            return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        cached_otp = cache.get(f'otp_{email}')
        if not cached_otp:
            return Response({'error': 'OTP expired or not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        if cached_otp == otp:
            # Mark that OTP was verified (e.g., using a short-lived token or cache key)
            cache.set(f'verified_{email}', True, timeout=300) # Valid for 5 more minutes to set password
            return Response({'message': 'OTP verified successfully'})
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        
        if not email or not new_password:
            return Response({'error': 'Email and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not cache.get(f'verified_{email}'):
            return Response({'error': 'OTP not verified or verification expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            # Clear verification from cache
            cache.delete(f'verified_{email}')
            cache.delete(f'otp_{email}')
            return Response({'message': 'Password reset successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
