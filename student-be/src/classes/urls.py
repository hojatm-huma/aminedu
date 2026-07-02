from django.urls import path
from classes.views import (
    RetrieveProfileView,
    RetrieveWeeklyScheduleView,
    ListExercisesView,
    SubmitExerciseView,
)

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
    # Exercises
    path(
        "exercises/",
        ListExercisesView.as_view(),
        name="list_exercises",
    ),
    path(
        "exercises/<int:exercise_id>/submit/",
        SubmitExerciseView.as_view(),
        name="submit_exercise",
    ),
]
