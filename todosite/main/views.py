from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import TaskModel
from .serializers import TaskSerializer, UserSerializer

@csrf_exempt
def task_list(request):
    user = request.user
    tasks = TaskModel.objects.filter(user=user)
    return render(request, "main/mainpage.html", {"tasks": tasks})

class TaskViewSet(viewsets.ModelViewSet):
    queryset = TaskModel.objects.all()
    serializer_class = TaskSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['get'])
    def get_user_id(self, request):
        user = request.user
        print(user.id)
        return Response({
            'id': user.id,
        })