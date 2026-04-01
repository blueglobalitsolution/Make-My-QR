import os
import django
import sys
from collections import Counter

# Set up Django environment
project_root = '/home/bhavan/Project/Bgt/Make-My-QR/Backend/QRmaker'
if project_root not in sys.path:
    sys.path.append(project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'QRmaker.settings')
django.setup()

from django.contrib.auth.models import User

def cleanup_duplicate_users():
    print("Checking for duplicate users by email...")
    emails = User.objects.values_list('email', flat=True)
    duplicate_emails = [email for email, count in Counter(emails).items() if count > 1 and email]
    
    if not duplicate_emails:
        print("No duplicate emails found.")
        return

    print(f"Found {len(duplicate_emails)} duplicate emails: {duplicate_emails}")
    
    for email in duplicate_emails:
        # Sort by is_superuser first (True > False), then last_login, then newest joined
        users = User.objects.filter(email=email).order_by('-is_superuser', '-last_login', '-date_joined')
        print(f"\nProcessing email: {email}")
        
        # Keep the one that is superuser, or has last login, or is newest
        keep_user = users[0]
        delete_users = users[1:]
        
        print(f"  KEEPING: ID={keep_user.id}, Username={keep_user.username}, IsSuper={keep_user.is_superuser}")
        for dupe in delete_users:
            print(f"  DELETING: ID={dupe.id}, Username={dupe.username}, IsSuper={dupe.is_superuser}")
            dupe.delete()
            
    print("\nDELETION COMPLETE.")

if __name__ == "__main__":
    cleanup_duplicate_users()
