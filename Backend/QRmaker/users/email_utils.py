import yagmail
from django.conf import settings

def get_email_template(title, body_content, footer_text=""):
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}
        .wrapper {{
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
            border: 1px solid #f1f5f9;
        }}
        .header {{
            padding: 32px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
        }}
        .logo-text {{
            font-size: 24px;
            font-weight: 800;
            color: #dc2626;
            letter-spacing: -0.025em;
            text-decoration: none;
        }}
        .logo-text span {{
            color: #0f172a;
        }}
        .content {{
            padding: 48px 40px;
            color: #334155;
            line-height: 1.6;
        }}
        .title {{
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 24px 0;
            text-align: center;
            letter-spacing: -0.025em;
        }}
        .text {{
            font-size: 16px;
            color: #475569;
            margin-bottom: 32px;
            text-align: center;
        }}
        .otp-box {{
            background-color: #fef2f2;
            border: 2px dashed #fecaca;
            border-radius: 16px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
        }}
        .otp-label {{
            font-size: 12px;
            font-weight: 700;
            color: #dc2626;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
            display: block;
        }}
        .otp-code {{
            font-size: 40px;
            font-weight: 900;
            color: #dc2626;
            letter-spacing: 0.3em;
            margin: 0;
            font-family: inherit;
        }}
        .footer {{
            padding: 32px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #f1f5f9;
        }}
        .footer-text {{
            font-size: 13px;
            color: #94a3b8;
            margin: 0;
        }}
        .footer-sub {{
            font-size: 12px;
            color: #cbd5e1;
            margin-top: 8px;
        }}
        .button {{
            display: inline-block;
            padding: 14px 32px;
            background-color: #dc2626;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            margin: 16px 0;
        }}
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <a href="#" class="logo-text">MakeMy<span>QR</span></a>
            </div>
            <div class="content">
                {body_content}
            </div>
            <div class="footer">
                <p class="footer-text">© 2026 MakeMyQR Studio. All rights reserved.</p>
                {footer_text}
            </div>
        </div>
    </div>
</body>
</html>
"""

def send_welcome_email(to_email, username):
    try:
        yag = yagmail.SMTP(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        subject = "Welcome to MakeMyQR! 🚀"
        
        body_content = f"""
            <h1 class="title">Welcome aboard, {username}!</h1>
            <p class="text">We're thrilled to have you join our community. MakeMyQR is designed to help you create stunning, trackable QR codes in seconds.</p>
            <div style="text-align: center;">
                <a href="{settings.FRONTEND_URL}" class="button">Go to Dashboard</a>
            </div>
            <p class="text" style="font-size: 14px; margin-top: 24px;">If you have any questions, feel free to reply to this email.</p>
        """
        
        html = get_email_template(subject, body_content)
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False

def send_otp_email(to_email, otp):
    try:
        yag = yagmail.SMTP(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        subject = "Your Password Reset OTP"
        
        body_content = f"""
            <h1 class="title">Password Reset</h1>
            <p class="text">We received a request to reset your password. Use the following code to continue:</p>
            <div class="otp-box">
                <span class="otp-label">Verification Code</span>
                <p class="otp-code">{otp}</p>
            </div>
            <p class="text" style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes for security reasons.</p>
        """
        
        footer_text = '<p class="footer-sub">If you did not request this, please ignore this email.</p>'
        
        html = get_email_template(subject, body_content, footer_text)
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False
