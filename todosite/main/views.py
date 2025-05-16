from django.shortcuts import render
from rest_framework import generics

from .models import TaskModel
from .serializers import TaskSerializer


class TaskApiView(generics.ListAPIView):
    queryset = TaskModel.objects.all()
    serializer_class = TaskSerializer