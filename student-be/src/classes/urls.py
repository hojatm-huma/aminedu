from django.urls import path
from classes.views import (
    KlassRegistrationListView,
    KlassScheduleListView,
    RegistrationExerciseDetailView,
    RegistrationExerciseListView,
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
    path(
        "klass/registration/",
        KlassRegistrationListView.as_view(),
        name="klass-registration",
    ),
    path(
        "klass/registration/<int:pk>/exercises/",
        RegistrationExerciseListView.as_view(),
        name="klass-registration-exercises",
    ),
    path(
        "klass/registration/<int:registration_pk>/exercises/<int:pk>/",
        RegistrationExerciseDetailView.as_view(),
        name="klass-registration-exercise-detail",
    ),
]
