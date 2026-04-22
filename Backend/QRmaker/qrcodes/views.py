from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import QRCode
from .serializers import QRCodeSerializer
from folders.models import Folder
from files.models import File
from scans.models import Scan
from hashids import Hashids
from django.conf import settings
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
import json


class QRCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QRCodeSerializer

    def get_queryset(self):
        from users.subscription_utils import is_subscription_active
        if not is_subscription_active(self.request.user):
            return QRCode.objects.none()
        return QRCode.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            folder = self.request.data.get("folder")
            if not folder:
                root_folder, created = Folder.objects.get_or_create(
                    user=self.request.user, is_root=True,
                    defaults={'name': self.request.user.username}
                )
                instance = serializer.save(user=self.request.user, folder=root_folder)
            if "folder" not in self.request.data:
                instance = serializer.save(user=self.request.user)
            else:
                instance = serializer.save()

            # --- Automatic File Privacy Update ---
            # If this is a file-type QR code, ensure the associated file is marked public
            if instance.category in ['pdf', 'file', 'video', 'document']:
                from files.models import File
                target_file = None
                
                # Case 1: Value is a JSON string containing file_id
                try:
                    import json
                    val_data = json.loads(instance.value)
                    if isinstance(val_data, dict) and 'file_id' in val_data:
                        target_file = File.objects.filter(id=val_data['file_id'], user=instance.user).first()
                except:
                    pass
                
                # Case 2: Value is a raw file path
                if not target_file:
                    relative_path = instance.value
                    if settings.MEDIA_URL and relative_path.startswith(settings.MEDIA_URL):
                        relative_path = relative_path[len(settings.MEDIA_URL):]
                    
                    target_file = File.objects.filter(file=relative_path, user=instance.user).first()
                
                # Case 3: Value is a public API URL containing the ID (e.g. /api/files/public/2/)
                if not target_file and '/api/files/public/' in instance.value:
                    try:
                        extracted_id = instance.value.split('/public/')[1].split('/')[0]
                        target_file = File.objects.filter(id=extracted_id, user=instance.user).first()
                    except:
                        pass
                    
                if target_file and not target_file.is_public:
                    target_file.is_public = True
                    target_file.save(update_fields=['is_public'])
            # -------------------------------------

            # Generate short_slug using Hashids
            hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
            instance.short_slug = hashids.encode(instance.id)
            instance.save(update_fields=["short_slug"])

    def create(self, request, *args, **kwargs):
        from users.subscription_utils import can_create_qr, is_subscription_active
        if not is_subscription_active(request.user):
             return Response({"error": "Trial period expired. Please upgrade your subscription to continue using the platform and access your work."}, status=status.HTTP_402_PAYMENT_REQUIRED)
        if not can_create_qr(request.user):
             return Response({"error": "QR code limit reached for your current plan. Please upgrade your subscription to create more QR codes."}, status=status.HTTP_402_PAYMENT_REQUIRED)
             
        # Override create to ensure response has the slug
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Refresh data from instance
        instance = serializer.instance
        result_serializer = self.get_serializer(instance)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def create_for_file(self, request):
        """Create a QR code for an existing file."""
        file_id = request.data.get("file_id")
        if not file_id:
            return Response(
                {"error": "file_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            file_obj = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response(
                {"error": "File not found"}, status=status.HTTP_404_NOT_FOUND
            )

        folder_id = request.data.get("folder")
        if folder_id:
            folder = Folder.objects.filter(id=folder_id, user=request.user).first()
        else:
            folder, created = Folder.objects.get_or_create(
                user=request.user, is_root=True,
                defaults={'name': request.user.username}
            )

        with transaction.atomic():
            # Mark the file as public so it can be viewed via QR code
            if not file_obj.is_public:
                file_obj.is_public = True
                file_obj.save(update_fields=["is_public"])

            # Create QR code with file reference
            qr_code = QRCode.objects.create(
                user=request.user,
                folder=folder,
                type="qr",
                category="file",
                name=request.data.get("name", file_obj.name),
                value=json.dumps(
                    {
                        "file_id": file_obj.id,
                        "file_name": file_obj.name,
                        "file_type": file_obj.file_type,
                    }
                ),
                is_dynamic=True,
                status="active",
            )

            # Generate short_slug
            hashids = Hashids(salt=settings.SECRET_KEY, min_length=6)
            qr_code.short_slug = hashids.encode(qr_code.id)
            qr_code.save(update_fields=["short_slug"])

        serializer = self.get_serializer(qr_code)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="summary-analytics")
    def summary_analytics(self, request):
        """Overall analytics for all user's QR codes with filtering."""
        user = request.user
        
        # Get Filter Params
        period = request.query_params.get('period', '30')
        device_type = request.query_params.get('device_type', 'All')
        search = request.query_params.get('search', '')
        location = request.query_params.get('location')
        
        try:
           days = int(period)
        except:
           days = 30
           
        time_threshold = timezone.now() - timedelta(days=days)
        
        # Base queries
        qr_filters = Q(user=user)
        if search:
            qr_filters &= Q(name__icontains=search) | Q(value__icontains=search)
            
        user_qr_ids = QRCode.objects.filter(qr_filters).values_list('id', flat=True)
        
        if search:
            # If searching, we only show scans for QR codes that match the search
            scan_filters = Q(qrcode_id__in=user_qr_ids)
        else:
            # Otherwise show all scans belonging to the user (including deleted ones)
            scan_filters = Q(user=user)

        if days > 0:
            scan_filters &= Q(timestamp__gte=time_threshold)
        if device_type != 'All':
            scan_filters &= Q(device_type=device_type)
        if location:
            scan_filters &= Q(country=location)
            
        user_scans = Scan.objects.filter(scan_filters)
        
        # Summary Counters
        total_scans = user_scans.count()
        unique_scans = user_scans.values('ip_address').distinct().count()
        total_qrcodes = len(user_qr_ids)
        
        # Scans by Day
        daily_scans = user_scans\
            .annotate(date=TruncDate('timestamp'))\
            .values('date')\
            .annotate(count=Count('id'))\
            .order_by('date')
            
        # Device Distribution
        devices = user_scans.values('device_type')\
            .annotate(count=Count('id'))\
            .order_by('-count')
            
        # OS Distribution
        os_stats = user_scans.values('os_family')\
            .annotate(count=Count('id'))\
            .order_by('-count')
            
        # Browser Distribution
        browser_stats = user_scans.values('browser')\
            .annotate(count=Count('id'))\
            .order_by('-count')
            
        # Location Distribution
        location_stats = user_scans.exclude(country=None).values('country')\
            .annotate(count=Count('id'))\
            .order_by('-count')
            
        # Top QR Codes within this scan set (Optimized Bug 10)
        top_ids = user_scans.values('qrcode_id')\
            .annotate(scan_count=Count('id'))\
            .order_by('-scan_count')[:10]
            
        top_qr_ids = [t['qrcode_id'] for t in top_ids]
        qr_names_map = {q.id: q.name for q in QRCode.objects.filter(id__in=top_qr_ids)}
        
        top_qrs_data = [
            {
                "id": t['qrcode_id'], 
                "name": qr_names_map.get(t['qrcode_id'], 'Unknown'), 
                "scans": t['scan_count']
            } for t in top_ids
        ]

        # Recent Leads (Optimized Bug 10 with select_related)
        # Bug 11: Add simple pagination support
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size

        recent_leads_qs = user_scans.filter(visitor_email__isnull=False)\
            .exclude(visitor_email='')\
            .select_related('qrcode')\
            .order_by('-timestamp')
            
        total_leads = recent_leads_qs.count()
        recent_leads_slice = recent_leads_qs[start:end]

        recent_leads = [{
            "name": l.visitor_name,
            "email": l.visitor_email,
            "qr_name": l.qrcode.name,
            "timestamp": l.timestamp,
            "id": l.id
        } for l in recent_leads_slice]

        return Response({
            "summary": {
                "total_scans": total_scans,
                "unique_scans": unique_scans,
                "total_qrcodes": total_qrcodes
            },
            "daily_scans": list(daily_scans),
            "devices": list(devices),
            "os": list(os_stats),
            "browsers": list(browser_stats),
            "locations": list(location_stats),
            "top_qrcodes": top_qrs_data,
            "recent_leads": {
                "results": recent_leads,
                "total": total_leads,
                "page": page,
                "page_size": page_size
            }
        })

    @action(detail=False, methods=["get"], url_path="export-scans-csv")
    def export_scans_csv(self, request):
        """Export all scans for current user as CSV using streaming to save memory."""
        import csv
        from django.http import StreamingHttpResponse

        class Echo:
            def write(self, value):
                return value

        def stream_csv():
            user_qr_ids = QRCode.objects.filter(user=request.user).values_list('id', flat=True)
            # Use iterator() to load records from DB in chunks instead of all at once
            scans = Scan.objects.filter(qrcode_id__in=user_qr_ids)\
                .select_related('qrcode')\
                .order_by('-timestamp')\
                .iterator(chunk_size=1000)
            
            pseudo_buffer = Echo()
            writer = csv.writer(pseudo_buffer)
            
            # Write Header
            yield writer.writerow(['QR Name', 'QR ID', 'Timestamp', 'Visitor Name', 'Visitor Email', 'IP Address', 'Device', 'OS', 'Browser'])
            
            for s in scans:
                yield writer.writerow([
                    s.qrcode.name if s.qrcode else 'Deleted QR',
                    s.qrcode.id if s.qrcode else 'N/A',
                    s.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    s.visitor_name or '',
                    s.visitor_email or '',
                    s.ip_address,
                    s.device_type,
                    s.os_family,
                    s.browser
                ])

        response = StreamingHttpResponse(stream_csv(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="qr_scans_export.csv"'
        return response

    @action(detail=True, methods=["get"])
    def analytics(self, request, pk=None):
        """Detailed analytics for a specific QR code with filtering."""
        qrcode = self.get_object()
        
        # Get Filter Params
        period = request.query_params.get('period', '30')
        device_type = request.query_params.get('device_type', 'All')
        location = request.query_params.get('location')
        
        try:
           days = int(period)
        except:
           days = 30
           
        time_threshold = timezone.now() - timedelta(days=days)
        
        scan_filters = Q(qrcode=qrcode)
        if days > 0:
            scan_filters &= Q(timestamp__gte=time_threshold)
        if device_type != 'All':
            scan_filters &= Q(device_type=device_type)
        if location:
            scan_filters &= Q(country=location)

        user_scans = Scan.objects.filter(scan_filters)

        # Summary
        total_scans = user_scans.count()
        unique_scans = user_scans.values('ip_address').distinct().count()

        # Scans by Day
        daily_scans = user_scans\
            .annotate(date=TruncDate('timestamp'))\
            .values('date')\
            .annotate(count=Count('id'))\
            .order_by('date')

        # Distributions
        devices = user_scans.values('device_type').annotate(count=Count('id')).order_by('-count')
        os_stats = user_scans.values('os_family').annotate(count=Count('id')).order_by('-count')
        browser_stats = user_scans.values('browser').annotate(count=Count('id')).order_by('-count')
        location_stats = user_scans.exclude(country=None).values('country').annotate(count=Count('id')).order_by('-count')

        # Leads for this specific QR (Optimized Bug 10 + 11)
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size

        leads_qs = user_scans.filter(visitor_email__isnull=False).exclude(visitor_email='').order_by('-timestamp')
        total_leads = leads_qs.count()
        leads_slice = leads_qs[start:end]

        leads = [{
            "name": l.visitor_name,
            "email": l.visitor_email,
            "timestamp": l.timestamp,
            "id": l.id
        } for l in leads_slice]

        return Response({
            "name": qrcode.name,
            "summary": {
                "total_scans": total_scans, 
                "unique_scans": unique_scans,
                "total_qrcodes": 1
            },
            "daily_scans": list(daily_scans),
            "devices": list(devices),
            "os": list(os_stats),
            "browsers": list(browser_stats),
            "locations": list(location_stats),
            "leads": {
                "results": leads,
                "total": total_leads,
                "page": page,
                "page_size": page_size
            }
        })


class PublicQRCodeView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = QRCodeSerializer
    lookup_field = "short_slug"
    queryset = QRCode.objects.filter(status="active")

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the owner's subscription is active
        from users.subscription_utils import is_subscription_active
        if not is_subscription_active(instance.user):
            return Response(
                {"error": "This QR code is currently inactive because the owner's subscription has expired."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class CaptureLeadView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, short_slug):
        """Capture lead information for a QR code."""
        qrcode = get_object_or_404(QRCode, short_slug=short_slug, status="active")
        
        # Bug 6 Fix: Check if lead capture is enabled
        if not qrcode.is_lead_capture:
            return Response(
                {"error": "Lead capture is not enabled for this QR code."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        data = request.data
        visitor_name = data.get("name")
        visitor_email = data.get("email")
        
        if not visitor_name or not visitor_email:
            return Response(
                {"error": "Name and email are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Analyze scanner info
        from scans.models import Scan
        user_agent = request.user_agent
        device_type = "PC"
        if user_agent.is_mobile:
            device_type = "Mobile"
        elif user_agent.is_tablet:
            device_type = "Tablet"
        
        ip_address = request.META.get("REMOTE_ADDR")
        
        # Create a scan record with lead data
        Scan.objects.create(
            user=qrcode.user,
            qrcode=qrcode,
            visitor_name=visitor_name,
            visitor_email=visitor_email,
            device_type=device_type,
            os_family=user_agent.os.family,
            browser=user_agent.browser.family,
            ip_address=ip_address,
        )
        
        return Response({"message": "Lead captured successfully"}, status=status.HTTP_201_CREATED)


class VerifyPasswordView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, short_slug):
        """Verify password for a protected QR code."""
        qrcode = get_object_or_404(QRCode, short_slug=short_slug, status="active")

        if not qrcode.is_protected:
            return Response(
                {"error": "This QR code is not password protected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        password = request.data.get("password")
        if not password:
            return Response(
                {"error": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if qrcode.check_password(password):
            return Response({"message": "Password verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Incorrect password. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED
            )
