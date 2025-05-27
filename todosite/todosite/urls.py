from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from main.views import *

router = routers.SimpleRouter()
router.register(r"task", TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls))
]
