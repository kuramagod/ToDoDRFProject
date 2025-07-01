from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from debug_toolbar.toolbar import debug_toolbar_urls
from main import views

router = routers.DefaultRouter()
router.register(r"tasks", views.TaskViewSet)
router.register(r"users", views.UserViewSet)
print(router.urls)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('api/v1/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + debug_toolbar_urls()
