from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("changelog", views.changelog, name="changelog"),
    path("about", views.about, name="about"),
]
