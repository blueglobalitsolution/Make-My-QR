from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, public_file_view

router = DefaultRouter()
router.register(r"", FileViewSet, basename="file")

urlpatterns = [
    path("public/<int:file_id>/", public_file_view, name="public-file"),
    path("", include(router.urls)),
]
