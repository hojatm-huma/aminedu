from django.db.models import Count
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from classes.models import (
    KlassRegistration,
    KlassSchedule,
    Student,
)
from classes.permissions import IsStudent
from classes.serializers import (
    KlassRegistrationSerializer,
    KlassScheduleSerializer,
    RetrieveProfileSerializer,
)


class RetrieveProfileView(generics.RetrieveAPIView):
    serializer_class = RetrieveProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Student.objects.filter(user=self.request.user).first()


class KlassRegistrationListView(generics.ListAPIView):
    """List the classes the current student is registered in.

    Each item includes the class name, the teacher's name and the
    number of exercises defined for the class.
    """

    serializer_class = KlassRegistrationSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            KlassRegistration.objects.filter(
                student__user=self.request.user
            )
            .select_related(
                "klass__lesson",
                "klass__teacher__user",
            )
            .annotate(exercise_count=Count("klass__exercise"))
        )


class KlassScheduleListView(generics.ListAPIView):
    """List the schedules of the classes the current student is registered in.

    Optionally filtered by ``day_of_week`` and always ordered by ``starts_at``.
    """

    serializer_class = KlassScheduleSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        queryset = (
            KlassSchedule.objects.filter(
                klass__registrations__student__user=self.request.user
            )
            .select_related("klass__lesson", "klass__teacher__user")
            .order_by("starts_at")
        )

        day_of_week = self.request.query_params.get("day_of_week")
        if day_of_week:
            queryset = queryset.filter(day_of_week=day_of_week)

        return queryset
