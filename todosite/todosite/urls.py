from django.contrib import admin
from django.urls import path, include

from main.views import TaskApiView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/tasklist/', TaskApiView.as_view())
]
