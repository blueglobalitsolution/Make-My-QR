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
        folder = self.request.data.get("folder")
        if not folder:
            root_folder = Folder.objects.filter(
                user=self.request.user, is_root=True
            ).first()
            if not root_folder:
                root_folder = Folder.objects.create(
                    user=self.request.user,
                    name=self.request.user.username,
                    is_root=True,
                )
            instance = serializer.save(user=self.request.user, folder=root_folder)
        else:
            instance = serializer.save(user=self.request.user)

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
            folder = Folder.objects.filter(user=request.user, is_root=True).first()
            if not folder:
                folder = Folder.objects.create(
                    user=request.user, name=request.user.username, is_root=True
                )

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
        
        scan_filters = Q(qrcode_id__in=user_qr_ids)
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
            
        # Top QR Codes within this scan set
        top_ids = user_scans.values('qrcode_id')\
            .annotate(scan_count=Count('id'))\
            .order_by('-scan_count')[:5]
            
        # Fetch QR names for top IDs
        qr_map = {q.id: q.name for q in QRCode.objects.filter(id__in=[t['qrcode_id'] for t in top_ids])}
        top_qrs_data = [{"id": t['qrcode_id'], "name": qr_map.get(t['qrcode_id'], 'Unknown'), "scans": t['scan_count']} for t in top_ids]

        # Recent Leads
        recent_leads_qs = user_scans.filter(visitor_email__isnull=False).exclude(visitor_email='').order_by('-timestamp')[:10]
        recent_leads = [{
            "name": l.visitor_name,
            "email": l.visitor_email,
            "qr_name": l.qrcode.name,
            "timestamp": l.timestamp,
            "id": l.id
        } for l in recent_leads_qs]

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
            "recent_leads": recent_leads
        })

    @action(detail=False, methods=["get"], url_path="export-scans-csv")
    def export_scans_csv(self, request):
        """Export all scans for current user as CSV."""
        import csv
        from django.http import HttpResponse
        
        user_qr_ids = QRCode.objects.filter(user=request.user).values_list('id', flat=True)
        scans = Scan.objects.filter(qrcode_id__in=user_qr_ids).select_related('qrcode').order_by('-timestamp')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="qr_scans_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['QR Name', 'QR ID', 'Timestamp', 'Visitor Name', 'Visitor Email', 'IP Address', 'Device', 'OS', 'Browser'])
        
        for s in scans:
            writer.writerow([
                s.qrcode.name,
                s.qrcode.id,
                s.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                s.visitor_name or '',
                s.visitor_email or '',
                s.ip_address,
                s.device_type,
                s.os_family,
                s.browser
            ])
            
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

        # Leads for this specific QR
        leads_qs = user_scans.filter(visitor_email__isnull=False).exclude(visitor_email='').order_by('-timestamp')
        leads = [{
            "name": l.visitor_name,
            "email": l.visitor_email,
            "timestamp": l.timestamp,
            "id": l.id
        } for l in leads_qs]

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
            "leads": leads
        })


class PublicQRCodeView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = QRCodeSerializer
    lookup_field = "short_slug"
    queryset = QRCode.objects.filter(status="active")
