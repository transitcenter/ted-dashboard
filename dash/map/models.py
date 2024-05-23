from django.db import models


# Create your models here.
class DataStory(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()


class Reference(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
