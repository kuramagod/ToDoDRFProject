from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import TaskModel
from .permissions import IsOwner
from .serializers import TaskSerializer, UserSerializer


class TaskList(ListView):
    model = TaskModel
    template_name = "main/mainpage.html"
    context_object_name = "tasks"

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return TaskModel.objects.none()
        return TaskModel.objects.filter(user=user)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = TaskModel.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action == 'create':
            return []
        return [IsAuthenticated()]

    def get_queryset(self):
        return get_user_model().objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def get_user_id(self, request):
        user = request.user
        return Response({
            'id': user.id,
        })