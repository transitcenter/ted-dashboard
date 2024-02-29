from django.shortcuts import render


def about(request):
    return render(request, "map/about.html")


def index(request):
    return render(request, "map/index.html")


def changelog(request):
    return render(request, "map/changelog.html")
