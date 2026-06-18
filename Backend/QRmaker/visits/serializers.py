import re
from rest_framework import serializers
from .models import SiteVisit

class TrackVisitSerializer(serializers.Serializer):
    page = serializers.CharField(required=False, allow_blank=True, default='', max_length=500)

class SiteVisitSerializer(serializers.ModelSerializer):
    user_agent_short = serializers.SerializerMethodField()

    class Meta:
        model = SiteVisit
        fields = '__all__'

    def get_user_agent_short(self, obj):
        ua = obj.user_agent
        browser = 'Unknown'
        os = 'Unknown'
        if 'Chrome/' in ua and 'Edg/' not in ua:
            browser = 'Chrome'
        elif 'Firefox/' in ua:
            browser = 'Firefox'
        elif 'Safari/' in ua and 'Chrome/' not in ua:
            browser = 'Safari'
        elif 'Edg/' in ua:
            browser = 'Edge'
        elif 'OPR/' in ua or 'Opera' in ua:
            browser = 'Opera'
        if 'Android' in ua:
            os = 'Android'
        elif 'iPhone' in ua or 'iPad' in ua:
            os = 'iOS'
        elif 'Windows' in ua:
            os = 'Windows'
        elif 'Mac OS' in ua:
            os = 'macOS'
        elif 'Linux' in ua:
            os = 'Linux'
        return f'{browser} / {os}'
