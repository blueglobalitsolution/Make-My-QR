import yagmail
from django.conf import settings

def send_welcome_email(to_email, username):
    try:
        yag = yagmail.SMTP(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        subject = "Welcome to QR Pro Studio!"
        body = f"""
            <h1>Hi {username},</h1>
            <p>Thanks for joining QR Pro Studio! We're excited to have you on board.</p>
            <p>You can now create and manage your QR codes easily.</p>
            <p>Best regards,<br>The QR Pro Studio Team</p>
        """
        yag.send(to_email, subject, body)
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False

def send_otp_email(to_email, otp):
    try:
        yag = yagmail.SMTP(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        subject = "Your Password Reset OTP"
        body = f"""
            <h1>Password Reset Request</h1>
            <p>Your 6-digit OTP for resetting your password is: <b style="font-size: 24px; color: #156295;">{otp}</b></p>
            <p>This OTP will expire in 3 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        """
        yag.send(to_email, subject, body)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False
