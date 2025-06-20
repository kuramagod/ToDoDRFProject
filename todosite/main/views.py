from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, viewsets

from .models import TaskModel
from .serializers import TaskSerializer

@csrf_exempt
def task_list(request):
    tasks = TaskModel.objects.all()
    return render(request, "main/mainpage.html", {"tasks": tasks})

class TaskViewSet(viewsets.ModelViewSet):
    queryset = TaskModel.objects.all()
    serializer_class = TaskSerializer
