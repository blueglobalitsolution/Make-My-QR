import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'QRmaker.settings')
django.setup()

from django.contrib.auth.models import User
from payments.models import SubscriptionPlan, UserSubscription
from django.utils import timezone

def seed_data():
    # 1. Create Lifetime Plan
    plan, created = SubscriptionPlan.objects.get_or_create(
        name="Lifetime Testing Plan",
        defaults={
            'price': 0.00,
            'duration_months': 1200, # 100 years
            'qr_limit': 9999,
            'can_create_dynamic': True,
            'can_create_pdf': True,
            'can_create_business': True,
            'can_password_protect': True,
            'can_lead_capture': True,
            'can_access_analytics': True,
            'upload_limit_mb': 100,
            'is_lifetime': True
        }
    )
    if created:
        print("Created Lifetime Testing Plan")
    else:
        print("Lifetime Testing Plan already exists")

    # 2. Create Superuser
    if not User.objects.filter(username='qradmin').exists():
        User.objects.create_superuser('qradmin', 'makemyqrcodeapp@gmail.com', 'Root@123')
        print("Created Superuser: qradmin / Root@123")
    else:
        print("Superuser qradmin already exists")

    # 3. Create Test Customer
    test_user, created = User.objects.get_or_create(
        username='testcustomer',
        defaults={
            'email': 'testcustomer@example.com',
            'first_name': 'Test',
            'last_name': 'Customer'
        }
    )
    if created:
        test_user.set_password('testpass123')
        test_user.save()
        print("Created Test Customer: testcustomer / testpass123")
    else:
        print("Test Customer testcustomer already exists")

    # 4. Assign Lifetime Plan to Test Customer
    sub, created = UserSubscription.objects.get_or_create(
        user=test_user,
        defaults={
            'plan': plan,
            'status': 'paid_active',
            'is_active': True,
            'expiry_date': None
        }
    )
    if not created:
        sub.plan = plan
        sub.status = 'paid_active'
        sub.is_active = True
        sub.expiry_date = None
        sub.save()
        print("Updated subscription for testcustomer to Lifetime")
    else:
        print("Assigned Lifetime subscription to testcustomer")

if __name__ == "__main__":
    seed_data()
