from rest_framework import generics
from classes.models import WeeklySchedule
from classes.serializers import RetrieveWeeklyScheduleSerializer


class RetrieveWeeklyScheduleView(generics.ListAPIView):
    serializer_class = RetrieveWeeklyScheduleSerializer

    def get_queryset(self):
        return WeeklySchedule.objects.filter(
            students__user=self.request.user,
        ).order_by("classes__day_of_week", "classes__starts_at")
