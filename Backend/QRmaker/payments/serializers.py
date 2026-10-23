from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PaymentOrder, SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    # Display-only local price. The amount actually charged is always INR.
    display_price = serializers.SerializerMethodField()
    display_currency = serializers.SerializerMethodField()
    display_symbol = serializers.SerializerMethodField()
    display_country = serializers.SerializerMethodField()
    charge_amount = serializers.SerializerMethodField()
    charge_currency = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = "__all__"

    # -- localisation -----------------------------------------------------
    def _localized(self, obj):
        from .pricing import localize_price

        currency = self.context.get("currency")
        return localize_price(obj.price or 0, currency)

    def get_display_price(self, obj):
        amount, _, _ = self._localized(obj)
        return float(amount)

    def get_display_currency(self, obj):
        _, code, _ = self._localized(obj)
        return code

    def get_display_symbol(self, obj):
        _, _, symbol = self._localized(obj)
        return symbol

    def get_display_country(self, obj):
        return self.context.get("country") or "IN"

    def get_charge_amount(self, obj):
        return float(obj.price or 0)

    def get_charge_currency(self, obj):
        return "INR"

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_duration_months(self, value):
        if value <= 0:
            raise serializers.ValidationError("Duration must be at least 1 month.")
        return value

    def validate_qr_limit(self, value):
        if value < 0:
            raise serializers.ValidationError("QR limit cannot be negative.")
        return value

    def validate_upload_limit_mb(self, value):
        if value < 0:
            raise serializers.ValidationError("Upload limit cannot be negative.")
        return value

    def validate(self, attrs):
        # Ensure lifetime plans have is_lifetime=True, and trial plans have is_trial=True
        is_lifetime = attrs.get(
            "is_lifetime",
            getattr(self.instance, "is_lifetime", False) if self.instance else False,
        )
        is_trial = attrs.get(
            "is_trial",
            getattr(self.instance, "is_trial", False) if self.instance else False,
        )

        if is_lifetime and is_trial:
            raise serializers.ValidationError(
                "A plan cannot be both lifetime and trial."
            )

        # For lifetime plans, duration can be 0 or ignored, but not negative
        if is_lifetime:
            duration = attrs.get(
                "duration_months",
                getattr(self.instance, "duration_months", 0) if self.instance else 0,
            )
            if duration < 0:
                raise serializers.ValidationError(
                    "Duration cannot be negative even for lifetime plans."
                )

        return attrs


class PaymentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentOrder
        fields = "__all__"


class UserSubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "user",
            "username",
            "user_email",
            "plan",
            "plan_name",
            "status",
            "start_date",
            "expiry_date",
            "is_active",
            "purchase_count",
        ]
