from django.shortcuts import render


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
