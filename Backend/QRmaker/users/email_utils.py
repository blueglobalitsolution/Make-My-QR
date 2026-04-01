def get_email_client():
    import yagmail

    return yagmail.SMTP("blueglobalcloud@gmail.com", password="pjooewfxcxhtldod")


def send_welcome_email(to_email, name):
    try:
        yag = get_email_client()
        subject = "Welcome to MakeMyQR!"

        html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6;">

<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6">
  <tr>
    <td align="center">

      <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;">
        <tr>
          <td align="center" style="padding:40px 10px;">

            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius:8px;">
              
              <tr>
                <td align="center" style="padding:30px 20px 10px 20px; font-family:Arial, sans-serif; font-size:22px; font-weight:bold; color:#333;">
                  Welcome to MakeMyQR, {name}!
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:10px 20px; font-family:Arial, sans-serif; font-size:15px; color:#555;">
                  Thank you for joining us. Start creating amazing QR codes today!
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:20px 20px;">
                  <a href="https://makemyqr.com" style="display:inline-block; padding:12px 24px; background-color:#dc2626; color:#ffffff; text-decoration:none; font-family:Arial, sans-serif; font-size:14px; font-weight:bold; border-radius:6px;">
                    Get Started
                  </a>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:10px 20px 30px 20px; font-family:Arial, sans-serif; font-size:12px; color:#888;">
                  If you didn't create this account, please ignore this email.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
"""
        yag.send(to_email, subject, html)
        return True

    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False


def send_otp_email(to_email, otp):
    try:
        yag = get_email_client()
        subject = "Your Password Reset OTP"

        html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f4f6;">

<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6">
  <tr>
    <td align="center">

      <!-- Outer container -->
      <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;">
        <tr>
          <td align="center" style="padding:40px 10px;">

            <!-- Card -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius:8px;">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding:30px 20px 10px 20px; font-family:Arial, sans-serif; font-size:22px; font-weight:bold; color:#333;">
                  Password Reset Request
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td align="center" style="padding:10px 20px; font-family:Arial, sans-serif; font-size:15px; color:#555;">
                  Your 6-digit OTP for resetting your password is:
                </td>
              </tr>

              <!-- OTP -->
              <tr>
                <td align="center" style="padding:20px 20px;">
                  <span style="font-family:Arial, sans-serif; font-size:36px; font-weight:bold; color:#2563eb; letter-spacing:4px;">
                    {otp}
                  </span>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td align="center" style="padding:10px 20px;">
                  <table width="40" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td height="4" bgcolor="#e5e7eb" style="border-radius:2px;"></td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Expiry -->
              <tr>
                <td align="center" style="padding-top:10px; font-family:Arial, sans-serif; font-size:12px; color:#888;">
                  This OTP is valid for 10 minutes.
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding:10px 20px 30px 20px; font-family:Arial, sans-serif; font-size:12px; color:#888;">
                  If you didn’t request this, you can safely ignore this email.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
"""
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False


def send_signup_otp_email(to_email, otp):
    try:
        yag = get_email_client()
        subject = "Verify your email for MakeMyQR"

        html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6">
  <tr>
    <td align="center">
      <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;">
        <tr>
          <td align="center" style="padding:40px 10px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius:8px;">
              <tr>
                <td align="center" style="padding:30px 20px 10px 20px; font-family:Arial, sans-serif; font-size:22px; font-weight:bold; color:#333;">
                  Verify Your Email
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:10px 20px; font-family:Arial, sans-serif; font-size:15px; color:#555;">
                  Welcome to MakeMyQR! Please use the following 6-digit code to verify your email and complete your registration:
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:20px 20px;">
                  <span style="font-family:Arial, sans-serif; font-size:36px; font-weight:bold; color:#dc2626; letter-spacing:4px;">
                    {otp}
                  </span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:10px; font-family:Arial, sans-serif; font-size:12px; color:#888;">
                  This code is valid for 10 minutes.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:10px 20px 30px 20px; font-family:Arial, sans-serif; font-size:12px; color:#888;">
                  If you didn't request this, you can safely ignore this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
"""
        yag.send(to_email, subject, html)
        return True
    except Exception as e:
        print(f"Error sending signup OTP: {e}")
        return False
