from django.urls import path
from classes.views import RetrieveWeeklyScheduleView


urlpatterns = [
    path(
        "weekly-schedule/",
        RetrieveWeeklyScheduleView.as_view(),
        name="weekly_schedule",
    ),
]
