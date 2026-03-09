from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponseRedirect, FileResponse, Http404
from hashids import Hashids
from qrcodes.models import QRCode
from files.models import File
from .models import Scan
from django.conf import settings
import os
import json
from django.views.decorators.csrf import csrf_exempt


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

    # Minimal GeoIP Check (ip-api.com is free and doesn't require keys for low volume)
    if ip_address and ip_address not in ["127.0.0.1", "localhost"] and not ip_address.startswith("192.168."):
        import requests
        try:
            geo_response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=1).json()
            if geo_response.get("status") == "success":
                country = geo_response.get("country", "Unknown")
                city = geo_response.get("city", "Unknown")
        except Exception:
            pass

    # Save Scan record
    Scan.objects.create(
        qrcode=qrcode,
        device_type=device_type,
        os_family=user_agent.os.family,
        browser=user_agent.browser.family,
        ip_address=ip_address,
        country=f"{city}, {country}" if city != "Unknown" else country,
    )

    # Increment total scan count in QRCode model
    qrcode.scans += 1
    qrcode.save(update_fields=["scans"])

    # Check if this is a file-type QR code or has a file URL in value
    file_id = None
    file_url = None

    # First check if it's a file category
    is_file_category = qrcode.category in ["file", "pdf", "document"]

    # Also check if value contains a file URL (regardless of category)
    has_file_url = qrcode.value and (
        "/media/" in qrcode.value or qrcode.value.startswith("http")
    )

    file_obj = None
    if is_file_category or has_file_url:
        file_obj = None
        try:
            # Try to parse as JSON first (new format)
            value_data = json.loads(qrcode.value)
            if isinstance(value_data, dict):
                file_id = value_data.get("file_id")
        except (json.JSONDecodeError, TypeError):
            # If not JSON, check if value is just a file ID
            if qrcode.value and qrcode.value.isdigit():
                file_id = int(qrcode.value)
            elif has_file_url:
                # Value contains a URL like http://.../media/... or /media/...
                file_url = qrcode.value

        # Try to find file by ID first
        file_obj = None
        if file_id:
            try:
                file_obj = File.objects.get(id=file_id)
            except File.DoesNotExist:
                pass

        # If no file by ID, try to find by URL (old QR codes)
        if not file_obj and file_url:
            # Extract filename from URL and try to match
            try:
                # Handle URLs like http://.../media/user_files/2025/03/04/file.pdf
                # or just /media/user_files/2025/03/04/file.pdf
                filename = file_url.split("/")[-1]
                if filename:
                    # Try to find file by name (might match multiple, take first)
                    file_obj = File.objects.filter(name=filename).first()
            except Exception:
                pass

    # If preview is disabled AND no lead capture is active, redirect directly to content
    if not qrcode.show_preview and not qrcode.is_lead_capture:
        # For website and whatsapp, redirect to the target URL
        if qrcode.category in ['website', 'whatsapp']:
            target_url = qrcode.value
            if qrcode.category == 'website' and not target_url.startswith('http'):
                target_url = f"https://{target_url}"
            return HttpResponseRedirect(target_url)
        
        # For file/pdf, redirect directly to the file URL
        if file_obj and file_obj.file:
            return HttpResponseRedirect(file_obj.file.url)
        elif file_url:
            return HttpResponseRedirect(file_url)

    # For file-type QR codes, redirect to Frontend file viewer page
    if file_obj or file_url or is_file_category or has_file_url:
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
