class RealIPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        meta = request.META
        remote_addr = meta.get('REMOTE_ADDR')
        if remote_addr in ('127.0.0.1', '::1', 'localhost'):
            xff = meta.get('HTTP_X_FORWARDED_FOR', '')
            if xff:
                real_ip = xff.split(',')[0].strip()
                if real_ip:
                    meta['REMOTE_ADDR'] = real_ip
            else:
                xri = meta.get('HTTP_X_REAL_IP', '')
                if xri:
                    meta['REMOTE_ADDR'] = xri.strip()
        return self.get_response(request)