from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import WebsiteLead
from .serializers import WebsiteLeadSerializer, WebsiteLeadCaptureSerializer
from django.db.models import Q
from django.core.paginator import Paginator

class CaptureLeadView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = WebsiteLeadCaptureSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        ip_address = request.META.get('REMOTE_ADDR')

        lead = WebsiteLead.objects.create(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            qr_type=data.get('qr_type', ''),
            qr_value=data.get('qr_value', ''),
            ip_address=ip_address,
        )

        return Response(
            {'message': 'Lead captured successfully', 'id': lead.id},
            status=status.HTTP_201_CREATED
        )


class AdminLeadListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        search = request.query_params.get('search', '').strip()

        queryset = WebsiteLead.objects.all()

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search)
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

        serializer = WebsiteLeadSerializer(page_obj.object_list, many=True)

        return Response({
            'results': serializer.data,
            'total': total,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
        })
