from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from classes.models import Student, WeeklySchedule, Exercise, ExerciseSubmission
from classes.serializers import (
    RetrieveWeeklyScheduleSerializer,
    RetrieveProfileSerializer,
    ExerciseSerializer,
    ExerciseSubmissionSerializer,
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


class ListExercisesView(generics.ListAPIView):
    """
    Returns all exercises for lessons in the student's weekly schedule.
    Each exercise includes the student's submission status (if any).
    """
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            student = self.request.user.student_profile
        except Exception:
            return Exercise.objects.none()

        # Lessons from the student's schedule
        lesson_ids = (
            WeeklySchedule.objects.filter(students=student)
            .values_list("classes__lesson_id", flat=True)
            .distinct()
        )
        return Exercise.objects.filter(lesson_id__in=lesson_ids).select_related(
            "lesson", "created_by", "created_by__user"
        )


class SubmitExerciseView(generics.CreateAPIView):
    """
    POST multipart/form-data with `file` to submit (or re-submit) an exercise.
    If the student already submitted, the old file is replaced.
    """
    serializer_class = ExerciseSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        exercise = get_object_or_404(Exercise, pk=self.kwargs["exercise_id"])

        try:
            student = request.user.student_profile
        except Exception:
            return Response(
                {"detail": "Student profile not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update or create submission
        submission, created = ExerciseSubmission.objects.get_or_create(
            exercise=exercise,
            student=student,
            defaults={"file": request.FILES.get("file")},
        )

        if not created:
            # Re-submission: replace the file
            submission.file = request.FILES.get("file")
            submission.save()

        serializer = ExerciseSubmissionSerializer(submission, context={"request": request})
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=http_status)
