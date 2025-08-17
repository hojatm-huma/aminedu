from django.urls import path
from classes.views import RetrieveProfileView, RetrieveWeeklyScheduleView


urlpatterns = [
    path(
        "weekly-schedule/",
        RetrieveWeeklyScheduleView.as_view(),
        name="weekly_schedule",
    ),
    path(
        "student/profile/",
        RetrieveProfileView.as_view(),
        name="profile",
    ),
]
