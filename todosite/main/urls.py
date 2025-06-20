from django.urls import path

from main.views import task_list

urlpatterns = [
    path('', task_list, name="task_list"),
]