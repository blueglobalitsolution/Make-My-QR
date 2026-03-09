import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import PaymentOrder, SubscriptionPlan
from .serializers import PaymentOrderSerializer
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

        return Response({
            "order_id": razorpay_order['id'],
            "amount": amount,
            "currency": currency,
            "key": settings.RAZORPAY_KEY_ID,
            "name": "QR code.io",
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
            # Verify the payment signature
            client.utility.verify_payment_signature(params_dict)
            
            # Update order status
            order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.status = 'success'
            order.save()

            # Here you would typically update the user's plan/subscription details
            # user_profile = order.user.profile
            # user_profile.plan = order.plan
            # user_profile.save()

            return Response({"status": "Payment verified successfully"}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            order = PaymentOrder.objects.get(razorpay_order_id=razorpay_order_id)
            order.status = 'failed'
            order.save()
            return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)
        except PaymentOrder.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
