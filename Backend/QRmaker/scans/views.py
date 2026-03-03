from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponseRedirect
from hashids import Hashids
from qrcodes.models import QRCode
from .models import Scan
from django.conf import settings

def redirect_scan(request, slug):
    # Hashids initialization (uses SECRET_KEY by default)
    hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
    
    # Try to reverse decode if slug is numerical format or use directly
    # For now, we assume slug matches short_slug field directly for simplicity
    # but we will look up by short_slug
    
    qrcode = get_object_or_404(QRCode, short_slug=slug, status='active')
    
    # Analyze scanner info using django-user-agents
    user_agent = request.user_agents
    
    device_type = 'PC'
    if user_agent.is_mobile: device_type = 'Mobile'
    elif user_agent.is_tablet: device_type = 'Tablet'
    elif user_agent.is_bot: device_type = 'Bot'
    
    # Save Scan record
    Scan.objects.create(
        qrcode=qrcode,
        device_type=device_type,
        os_family=user_agent.os.family,
        browser=user_agent.browser.family,
        ip_address=request.META.get('REMOTE_ADDR')
    )
    
    # Increment total scan count in QRCode model
    qrcode.scans += 1
    qrcode.save(update_fields=['scans'])
    
    # Determine redirect goal
    # For PDFs on our server, we might want to redirect directly to media URL
    return HttpResponseRedirect(qrcode.value)
