from django.urls import path
from main import views


user_list = views.UserViewSet.as_view({ 'get': 'list' })
user_detail = views.UserViewSet.as_view({ 'get': 'retrieve' })

urlpatterns = [
    path('', views.TaskList.as_view(), name="task_list"),
    path('users/', user_list, name="user_list"),
    path('users/<int:pk>/', user_detail, name="user_detail"),
]