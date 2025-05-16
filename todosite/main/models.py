from django.contrib.auth import get_user_model
from django.db import models


class TaskModel(models.Model):
    class TaskStatus(models.TextChoices):
        IN_PROGRESS  = 'в процессе'
        COMPLETED = 'завершено'
    name = models.CharField(max_length=100, null=False, blank=False, verbose_name='Название')
    description = models.TextField(max_length=250, null=False, blank=True, verbose_name='Описание')
    status = models.CharField(max_length=11, choices=TaskStatus.choices, default=TaskStatus.IN_PROGRESS, verbose_name='Статус')
    start_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата начала')
    end_date = models.DateTimeField(null=True, blank=True, verbose_name='Дата завершения')
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, related_name='user')

    def __str__(self):
        return f"Задача - {self.name}"
