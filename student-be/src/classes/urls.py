from django.urls import path
from classes.views import (
    KlassScheduleListView,
    RetrieveProfileView,
)

urlpatterns = [
    path(
        "students/profile/",
        RetrieveProfileView.as_view(),
        name="profile",
    ),
    path(
        "klass/schedule/",
        KlassScheduleListView.as_view(),
        name="klass-schedule",
    ),
]
