
class LogHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            print(f"DEBUG: Authorization Header: {auth_header}")
        else:
            print("DEBUG: No Authorization Header found")
        response = self.get_response(request)
        return response
