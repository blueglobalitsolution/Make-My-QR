def get_email_client():
    import yagmail

    return yagmail.SMTP("blueglobalcloud@gmail.com", password="pjooewfxcxhtldod")


def send_welcome_email(to_email, name):
    try:
        yag = get_email_client()
        subject = "Welcome to Make My QR Code!"

        html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Welcome</title></head><body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding: 20px 0;"><table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width:500px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"><tr><td align="center" style="padding: 25px 20px 5px 20px;"><div style="font-size: 22px; font-weight: 800; color: #dc2626; letter-spacing: -0.5px;">Make My<span style="color: #1e293b;"> QR Code</span></div></td></tr><tr><td align="center" style="padding: 5px 40px 15px 40px;"><h1 style="font-size: 19px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">Hi {name},</h1><p style="font-size: 14px; line-height: 1.5; color: #475569; margin: 0;">Welcome to the family! We're thrilled to have you. Start creating professional QR codes today.</p></td></tr><tr><td align="center" style="padding: 0 40px 30px 40px;"><a href="https://makemyqrcode.com/" style="display:inline-block; padding:12px 28px; background-color:#dc2626; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; border-radius:10px;">Get Started Now</a></td></tr><tr><td align="center" style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;"><p style="font-size: 12px; color: #94a3b8; margin: 0;">If you didn't create this account, please ignore this email.</p><p style="font-size: 11px; color: #cbd5e1; margin: 8px 0 0 0;">&copy; 2026 Make My QR Code. All rights reserved.</p></td></tr></table></td></tr></table></body></html>"""
        yag.send(to_email, subject, html)
        return True

    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False


def send_otp_email(to_email, otp):
    try:
        yag = get_email_client()
        subject = "Your Password Reset OTP"

        html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Password Reset</title></head><body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding: 20px 0;"><table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width:500px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"><tr><td align="center" style="padding: 25px 20px 5px 20px;"><div style="font-size: 20px; font-weight: 800; color: #dc2626; letter-spacing: -0.5px;">Make My<span style="color: #1e293b;"> QR Code</span></div></td></tr><tr><td align="center" style="padding: 5px 40px 10px 40px;"><h1 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">Password Reset Request</h1><p style="font-size: 14px; line-height: 1.4; color: #475569; margin: 0;">Use the code below to reset your password. Valid for <strong>10 minutes</strong>.</p></td></tr><tr><td align="center" style="padding: 5px 40px 25px 40px;"><div style="padding: 15px; background-color: #fef2f2; border: 2px dashed #fecaca; border-radius: 12px; display: inline-block;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #dc2626; letter-spacing: 6px;">{otp}</span></div></td></tr><tr><td align="center" style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;"><p style="font-size: 12px; color: #94a3b8; margin: 0;">Didn't request this? Please ignore this message.</p></td></tr></table></td></tr></table></body></html>"""
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False


def send_signup_otp_email(to_email, otp):
    try:
        yag = get_email_client()
        subject = "Verify your email for Make My QR Code"

        html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Email Verification</title></head><body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding: 20px 0;"><table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width:500px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);"><tr><td align="center" style="padding: 25px 20px 5px 20px;"><div style="font-size: 20px; font-weight: 800; color: #dc2626; letter-spacing: -0.5px;">Make My<span style="color: #1e293b;"> QR Code</span></div></td></tr><tr><td align="center" style="padding: 5px 40px 10px 40px;"><h1 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">Verify Your Email</h1><p style="font-size: 14px; line-height: 1.4; color: #475569; margin: 0;">Welcome! Use the code below to verify your account and get started.</p></td></tr><tr><td align="center" style="padding: 5px 40px 25px 40px;"><div style="padding: 15px; background-color: #fef2f2; border: 2px dashed #fecaca; border-radius: 12px; display: inline-block;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #dc2626; letter-spacing: 6px;">{otp}</span></div></td></tr><tr><td align="center" style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;"><p style="font-size: 12px; color: #94a3b8; margin: 0;">Valid for 10 minutes. Didn't request this? Just ignore it.</p></td></tr></table></td></tr></table></body></html>"""
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending signup OTP: {e}")
        return False
