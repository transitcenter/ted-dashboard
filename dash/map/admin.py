from django.contrib import admin
from map.models import (
    AcademicReference,
    MediaReference,
    IndustryReference,
    DataStory,
    Changelog,
)


# Register your models here.
class DataStoryAdmin(admin.ModelAdmin):
    pass


class AcademicReferenceAdmin(admin.ModelAdmin):
    pass


class IndustryReferenceAdmin(admin.ModelAdmin):
    pass


class MediaReferenceAdmin(admin.ModelAdmin):
    pass


class ChangelogAdmin(admin.ModelAdmin):
    pass


admin.site.register(DataStory, DataStoryAdmin)
admin.site.register(AcademicReference, AcademicReferenceAdmin)
admin.site.register(IndustryReference, IndustryReferenceAdmin)
admin.site.register(MediaReference, MediaReferenceAdmin)
admin.site.register(Changelog, ChangelogAdmin)
