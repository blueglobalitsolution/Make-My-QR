from datetime import date, timedelta
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.core.paginator import Paginator
from .models import SiteVisit
from .serializers import TrackVisitSerializer, SiteVisitSerializer

class TrackVisitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        page_url = request.data.get('page', '/')
        today = date.today()

        if ip_address:
            if not SiteVisit.objects.filter(ip_address=ip_address, visited_at__date=today).exists():
                SiteVisit.objects.create(
                    ip_address=ip_address,
                    user_agent=user_agent,
                    page_url=page_url,
                )

        today_count = SiteVisit.objects.filter(visited_at__date=today).count()
        total_count = SiteVisit.objects.count()

        return Response({
            'today_count': today_count,
            'total_count': total_count,
        })


class AdminVisitStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = date.today()
        today_count = SiteVisit.objects.filter(visited_at__date=today).count()
        total_count = SiteVisit.objects.count()

        last_7_days = []
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            count = SiteVisit.objects.filter(visited_at__date=d).count()
            last_7_days.append({'date': d.isoformat(), 'count': count})

        last_30_days = []
        for i in range(29, -1, -1):
            d = today - timedelta(days=i)
            count = SiteVisit.objects.filter(visited_at__date=d).count()
            last_30_days.append({'date': d.isoformat(), 'count': count})

        return Response({
            'today_count': today_count,
            'total_count': total_count,
            'last_7_days': last_7_days,
            'last_30_days': last_30_days,
        })


class AdminVisitListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        search = request.query_params.get('search', '').strip()

        queryset = SiteVisit.objects.all()

        if search:
            queryset = queryset.filter(
                Q(ip_address__icontains=search) |
                Q(page_url__icontains=search) |
                Q(user_agent__icontains=search)
            )

        total = queryset.count()
        paginator = Paginator(queryset, page_size)
        try:
            page_obj = paginator.page(page)
        except Exception:
            return Response({
                'results': [],
                'total': total,
                'page': page,
                'page_size': page_size,
                'total_pages': paginator.num_pages,
            })

        serializer = SiteVisitSerializer(page_obj.object_list, many=True)

        return Response({
            'results': serializer.data,
            'total': total,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
        })
