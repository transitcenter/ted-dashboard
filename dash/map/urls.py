from django.urls import path

from . import views

urlpatterns = [
    path("", views.landing, name="landing"),
    path("charts", views.charts, name="charts"),
    path("map", views.map, name="map"),
    path("changelog", views.changelog, name="changelog"),
    path("about", views.about, name="about"),
    path("references", views.references, name="references"),
]
