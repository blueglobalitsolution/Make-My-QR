from django.core.management.base import BaseCommand
from payments.models import SubscriptionPlan

class Command(BaseCommand):
    help = 'Populate initial subscription plans based on billing cycles (3, 6, 12 months)'

    def handle(self, *args, **kwargs):
        # Plan IDs:
        # 3 Months: 1 (Starter), 2 (Pro), 3 (Enterprise)
        # 6 Months: 4 (Starter), 5 (Pro), 6 (Enterprise)
        # 12 Months: 7 (Starter), 8 (Pro), 9 (Enterprise)
        
        plans = [
             # Standard Free & Trial Plans
            {
                'id': 100,
                'name': 'Trial',
                'price': 0.00,
                'duration_months': 0,
                'features': ['All pro features for 7 days', 'Test drive and enjoy our service'],
                'can_create_pdf': True,
                'can_create_business': True,
                'can_create_dynamic': True,
                'can_access_analytics': True,
                'qr_limit': 100,
            },
            {
                'id': 101,
                'name': 'Free',
                'price': 0.00,
                'duration_months': 0,
                'features': ['10 Dynamic Codes', 'Standard Analytics']
            },
            # 3 Months Billing
            {
                'id': 1,
                'name': 'Starter Plan (3 Months)',
                'price': 1999.00,
                'duration_months': 3,
                'features': ['10 Dynamic Codes', 'Standard Analytics', 'Email Support']
            },
            {
                'id': 2,
                'name': 'Pro Plan (3 Months)',
                'price': 1299.00,
                'duration_months': 3,
                'features': ['Everything in Starter', 'Unlimited Scans', 'Premium Formatting', 'Direct Support']
            },
            {
                'id': 3,
                'name': 'Enterprise Plan (3 Months)',
                'price': 2499.00,
                'duration_months': 3,
                'features': ['Unlimited Codes', 'Custom API Access', 'Team Management', 'Priority Support']
            },
            # 6 Months Billing
            {
                'id': 4,
                'name': 'Starter Plan (6 Months)',
                'price': 1799.00,
                'duration_months': 6,
                'features': ['15 Dynamic Codes', 'Standard Analytics', 'Email Support', 'Cancel Anytime']
            },
            {
                'id': 5,
                'name': 'Pro Plan (6 Months)',
                'price': 999.00,
                'duration_months': 6,
                'features': ['Everything in Starter', 'Full Analytics Dashboard', 'Unlimited Scans', 'Premium Formatting', 'Team Management']
            },
            {
                'id': 6,
                'name': 'Enterprise Plan (6 Months)',
                'price': 1999.00,
                'duration_months': 6,
                'features': ['Unlimited Codes', 'Custom API Access', 'Dedicated Account Manager', 'White Labeling', 'Advanced Analytics']
            },
            # 12 Months Billing
            {
                'id': 7,
                'name': 'Starter Plan (12 Months)',
                'price': 1499.00,
                'duration_months': 12,
                'features': ['20 Dynamic Codes', 'Full Analytics', 'Priority Support', 'Cancel Anytime', 'Premium Formatting']
            },
            {
                'id': 8,
                'name': 'Pro Plan (12 Months)',
                'price': 699.00,
                'duration_months': 12,
                'features': ['Everything in Monthly', 'Full Analytics Dashboard', 'API Access', 'Priority Direct Support', 'Dedicated Account Manager', 'Custom Branding']
            },
            {
                'id': 9,
                'name': 'Enterprise Plan (12 Months)',
                'price': 1499.00,
                'duration_months': 12,
                'features': ['Unlimited Everything', 'SLA Guarantee', 'Dedicated Infrastructure', 'SSO Integration', 'Custom Feature Development', '24/7 Phone Support']
            }
        ]

        current_ids = []
        for p_data in plans:
            pid = p_data.pop('id')
            current_ids.append(pid)
            plan = SubscriptionPlan.objects.filter(id=pid).first()
            if plan:
                # Update existing
                for key, value in p_data.items():
                    setattr(plan, key, value)
                plan.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully updated plan: {plan.name}'))
            else:
                # Create new
                plan = SubscriptionPlan.objects.create(id=pid, **p_data)
                self.stdout.write(self.style.SUCCESS(f'Successfully created plan: {plan.name}'))
        
        # Cleanup
        deleted_count, _ = SubscriptionPlan.objects.exclude(id__in=current_ids).delete()
        if deleted_count:
             self.stdout.write(self.style.WARNING(f'Deleted {deleted_count} obsolete plans'))
