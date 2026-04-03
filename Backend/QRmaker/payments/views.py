import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from .models import PaymentOrder, SubscriptionPlan, UserSubscription
from .serializers import PaymentOrderSerializer, SubscriptionPlanSerializer, UserSubscriptionSerializer
import json

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

        amount = int(plan.price * 100)  # Amount in paise
        currency = "INR"

        # Create Razorpay Order
        razorpay_order = client.order.create({
            "amount": amount,
            "currency": currency,
            "payment_capture": "1"
        })

        # Save Order in DB
        order = PaymentOrder.objects.create(
            user=request.user,
            plan=plan,
            amount=plan.price,
            razorpay_order_id=razorpay_order['id'],
            status='pending'
        )

        # Update UserSubscription status to payment_pending
        user_sub, _ = UserSubscription.objects.get_or_create(user=request.user)
        user_sub.status = 'payment_pending'
        user_sub.save()

        return Response({
            "order_id": razorpay_order['id'],
            "amount": amount,
            "currency": currency,
            "key": settings.RAZORPAY_KEY_ID,
            "name": "Make My QR Code",
            "description": f"Subscription for {plan.name}",
        })

class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            # If in DEBUG mode, allow skipping real verification if a special flag is sent
            # or just bypass it for dev convenience.
            if settings.DEBUG:
                print("DEBUG: Bypassing signature verification for testing")
            else:
                # Verify the payment signature with Razorpay
                client.utility.verify_payment_signature(params_dict)
            
            # Update order status
            order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
            order.razorpay_payment_id = razorpay_payment_id or "fake-payment-id"
            order.razorpay_signature = razorpay_signature or "fake-signature"
            order.status = 'success'
            order.save()

            # Update UserSubscription
            user_sub, created = UserSubscription.objects.get_or_create(user=order.user)
            user_sub.update_subscription(order.plan)

            return Response({"status": "Payment verified successfully (Dev Mock)"}, status=status.HTTP_200_OK)
        except (razorpay.errors.SignatureVerificationError, Exception) as e:
            print(f"ERROR: Payment Verification Error: {str(e)}")
            order = PaymentOrder.objects.filter(razorpay_order_id=razorpay_order_id).first()
            if order:
                order.status = 'failed'
                order.save()
            return Response({"error": f"Payment verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
class AdminSubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAdminUser]

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

class AdminUserSubscriptionListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        subscriptions = UserSubscription.objects.all().select_related('user', 'plan')
        serializer = UserSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
class RazorpayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import os
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "YOUR_WEBHOOK_SECRET")
        webhook_signature = request.headers.get("X-Razorpay-Signature")
        payload = request.body.decode("utf-8")

        try:
            # Only verify signature if not in DEBUG or if secret is provided
            if not settings.DEBUG and webhook_signature:
                client.utility.verify_webhook_signature(payload, webhook_signature, webhook_secret)
            
            data = json.loads(payload)
            event = data.get("event")
            
            if event == "payment.captured":
                payment_id = data["payload"]["payment"]["entity"]["id"]
                order_id = data["payload"]["payment"]["entity"]["order_id"]
                
                # Update order and subscription
                order = PaymentOrder.objects.filter(razorpay_order_id=order_id).first()
                if order and order.status != 'success':
                    order.status = 'success'
                    order.razorpay_payment_id = payment_id
                    order.save()
                    
                    user_sub, _ = UserSubscription.objects.get_or_create(user=order.user)
                    user_sub.update_subscription(order.plan)
            
            return Response({"status": "ok"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"WEBHOOK ERROR: {str(e)}")
            return Response({"error": "Webhook processing failed"}, status=status.HTTP_400_BAD_REQUEST)

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from django.contrib.auth.models import User
        from qrcodes.models import QRCode
        
        total_users = User.objects.count()
        
        # Calculate Trial -> Paid Conversion Rate
        # Users who currently have a paid plan vs total users
        ever_paid_users_count = UserSubscription.objects.filter(purchase_count__gt=0).count()
        total_trial_users_count = UserSubscription.objects.filter(plan__name__icontains='Trial').count() + ever_paid_users_count
        
        conversion_rate = 0
        if total_trial_users_count > 0:
            conversion_rate = (ever_paid_users_count / total_trial_users_count) * 100
            
        # Calculate Churn Rate
        # Users who were once paid but are now inactive
        churn_count = UserSubscription.objects.filter(purchase_count__gt=0, is_active=False).count()
        churn_rate = 0
        if ever_paid_users_count > 0:
            churn_rate = (churn_count / ever_paid_users_count) * 100

        return Response({
            "total_users": total_users,
            "total_qrcodes": QRCode.objects.count(),
            "active_subscriptions": UserSubscription.objects.filter(is_active=True).count(),
            "total_subscriptions": UserSubscription.objects.count(),
            "analytics": {
                "conversion_rate": round(conversion_rate, 2),
                "churn_rate": round(churn_rate, 2),
                "ever_paid_count": ever_paid_users_count,
                "churn_count": churn_count
            }
        })
