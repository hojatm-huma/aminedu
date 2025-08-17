from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from classes.models import Student, WeeklySchedule
from classes.serializers import (
    RetrieveWeeklyScheduleSerializer,
    RetrieveProfileSerializer,
)


class RetrieveWeeklyScheduleView(generics.ListAPIView):
    serializer_class = RetrieveWeeklyScheduleSerializer

    def get_queryset(self):
        return WeeklySchedule.objects.filter(
            students__user=self.request.user,
        ).order_by("classes__day_of_week", "classes__starts_at")


class RetrieveProfileView(generics.RetrieveAPIView):
    serializer_class = RetrieveProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Student.objects.filter(
            user=self.request.user,
        ).first()
