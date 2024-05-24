from django.shortcuts import render
from map.models import AcademicReference, MediaReference, IndustryReference, DataStory


def about(request):
    return render(request, "map/about.html")


def changelog(request):
    return render(request, "map/changelog.html")


def charts(request):
    return render(request, "map/charts.html")


def landing(request):
    return render(request, "map/landing.html")


def map(request):
    return render(request, "map/map.html")


def data(request):
    return render(request, "map/data.html")


def references(request):
    academic_references = AcademicReference.objects.all().order_by("-year")
    industry_references = IndustryReference.objects.all().order_by("-date")
    media_references = MediaReference.objects.all().order_by("-date")
    data_stories = DataStory.objects.all().order_by("-date")

    context = {
        "academic_references": academic_references,
        "data_stories": data_stories,
        "media_references": media_references,
        "industry_references": industry_references,
    }
    return render(request, "map/references.html", context)
