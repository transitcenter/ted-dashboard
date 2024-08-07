from django.shortcuts import render
from map.models import (
    AcademicReference,
    MediaReference,
    IndustryReference,
    DataStory,
    Changelog,
    Alert,
)


def about(request):
    context = {"alerts": Alert.objects.filter(active=True).order_by("-date")}
    return render(request, "map/about.html", context)


def changelog(request):
    changelog = Changelog.objects.all().order_by("-date")
    alerts = Alert.objects.filter(active=True).order_by("-date")
    context = {"changelogs": changelog, "alerts": alerts}
    return render(request, "map/changelog.html", context)


def charts(request):
    return render(
        request,
        "map/charts.html",
        {"alerts": Alert.objects.filter(active=True).order_by("-date")},
    )


def landing(request):
    return render(
        request,
        "map/landing.html",
        {"alerts": Alert.objects.filter(active=True).order_by("-date")},
    )


def map(request):
    return render(request, "map/map.html")


def data(request):
    return render(
        request,
        "map/data.html",
        {"alerts": Alert.objects.filter(active=True).order_by("-date")},
    )


def references(request):
    academic_references = AcademicReference.objects.all().order_by("-year")
    industry_references = IndustryReference.objects.all().order_by("-date")
    media_references = MediaReference.objects.all().order_by("-date")
    data_stories = DataStory.objects.all().order_by("-date")
    alerts = Alert.objects.filter(active=True).order_by("-date")
    context = {
        "academic_references": academic_references,
        "data_stories": data_stories,
        "media_references": media_references,
        "industry_references": industry_references,
        "alerts": alerts,
    }
    return render(request, "map/references.html", context)
