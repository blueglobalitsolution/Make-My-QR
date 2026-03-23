from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PaymentOrder, SubscriptionPlan, UserSubscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class PaymentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentOrder
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)

    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'username', 'user_email', 'plan', 'plan_name', 'start_date', 'expiry_date', 'is_active', 'purchase_count']
