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

        # First clean up old plans if needed or just update
        for plan_data in plans:
            plan, created = SubscriptionPlan.objects.update_or_create(
                id=plan_data['id'],
                defaults=plan_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created plan: {plan.name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Successfully updated plan: {plan.name}'))
        
        # Remove the old test plan if it exists and isn't in IDs 1-9
        SubscriptionPlan.objects.exclude(id__in=[p['id'] for p in plans]).delete()
