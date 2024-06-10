from django.db import models
import datetime


# Create your models here.
class DataStory(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField(default=None)
    date = models.DateField(default=datetime.date.today)

    class Meta:
        verbose_name = "TransitCenter Publication"
        verbose_name_plural = "TransitCenter Publications"

    def __str__(self):
        return self.title


class AcademicReference(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    journal = models.CharField(max_length=200)
    year = models.IntegerField()
    description = models.TextField()
    url = models.URLField()

    def __str__(self):
        return self.title


class IndustryReference(models.Model):
    title = models.CharField(max_length=400)
    organization = models.CharField(max_length=200)
    date = models.DateField()
    url = models.URLField()

    def __str__(self):
        return f"{self.title} ({self.organization})"


class MediaReference(models.Model):
    title = models.CharField(max_length=400)
    publication = models.CharField(max_length=200)
    date = models.DateField()
    url = models.URLField()

    def __str__(self):
        return self.title


class Alert(models.Model):
    title = models.CharField(max_length=400)
    description = models.TextField()
    date = models.DateField()
    active = models.BooleanField()

    def __str__(self):
        return self.title + f" ({self.active})"


class Changelog(models.Model):
    date = models.DateField()
    version = models.CharField(max_length=20)
    description = models.TextField()

    def __str__(self):
        return self.date.strftime("%Y-%m-%d") + " (" + self.version + ")"
