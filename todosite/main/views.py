from django.shortcuts import render
from rest_framework import generics, viewsets

from .models import TaskModel
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = TaskModel.objects.all()
    serializer_class = TaskSerializer
