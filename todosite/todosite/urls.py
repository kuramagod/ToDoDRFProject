from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from debug_toolbar.toolbar import debug_toolbar_urls
from main.views import *

router = routers.SimpleRouter()
router.register(r"tasks", TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('api/v1/', include(router.urls))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + debug_toolbar_urls()
