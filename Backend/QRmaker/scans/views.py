from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponseRedirect, FileResponse, Http404
from hashids import Hashids
from qrcodes.models import QRCode, GatekeeperConfig
from files.models import File
from .models import Scan
from django.conf import settings
import os
import json
import logging
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)


@csrf_exempt
def redirect_scan(request, slug):
    # Hashids initialization (uses SECRET_KEY by default)
    hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)

    # Try to reverse decode if slug is numerical format or use directly
    # For now, we assume slug matches short_slug field directly for simplicity
    # but we will look up by short_slug

    qrcode = get_object_or_404(QRCode, short_slug=slug, status="active")

    # Analyze scanner info using django-user-agents
    user_agent = request.user_agent

    device_type = "PC"
    if user_agent.is_mobile:
        device_type = "Mobile"
    elif user_agent.is_tablet:
        device_type = "Tablet"
    elif user_agent.is_bot:
        device_type = "Bot"

    # Capture IP
    ip_address = request.META.get("REMOTE_ADDR")
    country = "Unknown"
    city = "Unknown"

    # Minimal GeoIP Check
    if ip_address and ip_address not in ["127.0.0.1", "localhost"] and not ip_address.startswith("192.168."):
        import requests
        try:
            geo_response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=1).json()
            if geo_response.get("status") == "success":
                country = geo_response.get("country", "Unknown")
                city = geo_response.get("city", "Unknown")
        except Exception as e:
            logger.error(f"GeoIP Lookup failed for IP {ip_address}: {str(e)}")

    # Bug 6 Fix: Deduplication (1-minute cooldown per IP/QR pair)
    from django.utils import timezone
    from datetime import timedelta
    
    last_scan = Scan.objects.filter(
        qrcode=qrcode, 
        ip_address=ip_address, 
        timestamp__gte=timezone.now() - timedelta(minutes=1)
    ).exists()

    if not last_scan:
        # Save Scan record
        Scan.objects.create(
            user=qrcode.user,
            qrcode=qrcode,
            device_type=device_type,
            os_family=user_agent.os.family,
            browser=user_agent.browser.family,
            ip_address=ip_address,
            country=f"{city}, {country}" if city != "Unknown" else country,
        )

        # Bug 7 Fix: Atomic Increment using F()
        from django.db.models import F
        qrcode.scans = F('scans') + 1
        qrcode.save(update_fields=["scans"])
    else:
        print(f"DEBUG: Deduplicated scan for QR {qrcode.id} from IP {ip_address}")

    # Preview page hamesha dikhega — redirect to frontend
    # File-type QR codes go to file viewer, everything else goes to standard viewer
    category = qrcode.category
    is_file_category = category in ["file", "pdf", "document"]

    if is_file_category:
        redirect_url = f"{settings.FRONTEND_URL}/view/file/{slug}"
    else:
        redirect_url = f"{settings.FRONTEND_URL}/view/{slug}"

    return HttpResponseRedirect(redirect_url)

@csrf_exempt
def capture_lead(request, slug):
    print(f"DEBUG: capture_lead hit for slug: {slug}")
    if request.method == "POST":
        qrcode = get_object_or_404(QRCode, short_slug=slug, status="active")
        try:
            data = json.loads(request.body)
            visitor_name = data.get("name")
            visitor_email = data.get("email")
            
            # Analyze scanner info
            user_agent = request.user_agent
            device_type = "PC"
            if user_agent.is_mobile:
                device_type = "Mobile"
            elif user_agent.is_tablet:
                device_type = "Tablet"
            
            ip_address = request.META.get("REMOTE_ADDR")
            
            print(f"DEBUG: Data received - Name: {visitor_name}, Email: {visitor_email}")
            
            # Create a scan record with lead data
            scan = Scan.objects.create(
                user=qrcode.user,
                qrcode=qrcode,
                visitor_name=visitor_name,
                visitor_email=visitor_email,
                device_type=device_type,
                os_family=user_agent.os.family,
                browser=user_agent.browser.family,
                ip_address=ip_address,
            )
            print(f"DEBUG: Scan record created with ID: {scan.id}")
            
            return HttpResponseRedirect("/") # Doesn't matter, frontend will handle it
        except Exception as e:
            from django.http import JsonResponse
            return JsonResponse({"error": str(e)}, status=400)
    
    from django.http import JsonResponse
    return JsonResponse({"error": "Method not allowed"}, status=405)
