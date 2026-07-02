from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from classes.models import (
    Student, Teacher, WeeklySchedule,
    Exercise, ExerciseSubmission,
    Handout, CounselingSession, CounselingRegistration,
    Exam, ExamResult,
)
from classes.permissions import IsTeacher, IsStudent
from classes.serializers import (
    RetrieveWeeklyScheduleSerializer,
    RetrieveProfileSerializer,
    # Student
    ExerciseSerializer,
    ExerciseSubmissionSerializer,
    HandoutSerializer,
    CounselingSessionSerializer,
    ExamSerializer,
    # Teacher create/manage
    ExerciseCreateSerializer,
    ExerciseSubmissionDetailSerializer,
    HandoutCreateSerializer,
    CounselingSessionCreateSerializer,
    CounselingRegistrationSerializer,
    ExamCreateSerializer,
    ExamResultSerializer,
)


# ════════════════════════════════════════════════════════════════
#  SHARED / STUDENT VIEWS
# ════════════════════════════════════════════════════════════════

class RetrieveWeeklyScheduleView(generics.ListAPIView):
    serializer_class = RetrieveWeeklyScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WeeklySchedule.objects.filter(
            students__user=self.request.user,
        ).order_by("classes__day_of_week", "classes__starts_at")


class RetrieveProfileView(generics.RetrieveAPIView):
    serializer_class = RetrieveProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Student.objects.filter(user=self.request.user).first()


# ── Me (role detection) ───────────────────────────────────────────────────────

class MeView(APIView):
    """Returns the current user's role and basic info."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = "unknown"
        name = f"{user.first_name} {user.last_name}".strip() or user.username

        if hasattr(user, "teacher_profile"):
            role = "teacher"
        elif hasattr(user, "student_profile"):
            role = "student"

        return Response({"role": role, "name": name, "username": user.username})


# ── Student: Exercises ────────────────────────────────────────────────────────

class ListExercisesView(generics.ListAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        student = self.request.user.student_profile
        lesson_ids = (
            WeeklySchedule.objects.filter(students=student)
            .values_list("classes__lesson_id", flat=True)
            .distinct()
        )
        return Exercise.objects.filter(lesson_id__in=lesson_ids).select_related(
            "lesson", "created_by", "created_by__user"
        )


class SubmitExerciseView(generics.CreateAPIView):
    serializer_class = ExerciseSubmissionSerializer
    permission_classes = [IsStudent]

    def create(self, request, *args, **kwargs):
        exercise = get_object_or_404(Exercise, pk=self.kwargs["exercise_id"])
        student = request.user.student_profile

        submission, created = ExerciseSubmission.objects.get_or_create(
            exercise=exercise,
            student=student,
            defaults={"file": request.FILES.get("file")},
        )
        if not created:
            submission.file = request.FILES.get("file")
            submission.save()

        serializer = ExerciseSubmissionSerializer(submission, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# ── Student: Handouts ─────────────────────────────────────────────────────────

class ListHandoutsView(generics.ListAPIView):
    serializer_class = HandoutSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        student = self.request.user.student_profile
        lesson_ids = (
            WeeklySchedule.objects.filter(students=student)
            .values_list("classes__lesson_id", flat=True)
            .distinct()
        )
        return Handout.objects.filter(lesson_id__in=lesson_ids).select_related(
            "lesson", "uploaded_by", "uploaded_by__user"
        )


# ── Student: Counseling Sessions ──────────────────────────────────────────────

class ListCounselingSessionsView(generics.ListAPIView):
    serializer_class = CounselingSessionSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        from django.utils import timezone
        return CounselingSession.objects.filter(
            session_date__gte=timezone.now().date()
        ).annotate_registered() if hasattr(CounselingSession.objects, "annotate_registered") \
            else CounselingSession.objects.filter(
                session_date__gte=timezone.now().date()
            ).prefetch_related("registrations")


class RegisterCounselingView(APIView):
    """Student registers (or cancels) a counseling session."""
    permission_classes = [IsStudent]

    def post(self, request, session_id):
        session = get_object_or_404(CounselingSession, pk=session_id)
        student = request.user.student_profile

        if session.is_cancelled:
            return Response({"detail": "Session is cancelled."}, status=status.HTTP_400_BAD_REQUEST)
        if session.registered_count >= session.capacity:
            return Response({"detail": "Session is full."}, status=status.HTTP_400_BAD_REQUEST)

        reg, created = CounselingRegistration.objects.get_or_create(session=session, student=student)
        if not created:
            return Response({"detail": "Already registered."}, status=status.HTTP_200_OK)
        return Response({"detail": "Registered successfully."}, status=status.HTTP_201_CREATED)

    def delete(self, request, session_id):
        session = get_object_or_404(CounselingSession, pk=session_id)
        student = request.user.student_profile
        CounselingRegistration.objects.filter(session=session, student=student).delete()
        return Response({"detail": "Registration cancelled."}, status=status.HTTP_204_NO_CONTENT)


# ── Student: Exams ────────────────────────────────────────────────────────────

class ListExamsView(generics.ListAPIView):
    serializer_class = ExamSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        student = self.request.user.student_profile
        lesson_ids = (
            WeeklySchedule.objects.filter(students=student)
            .values_list("classes__lesson_id", flat=True)
            .distinct()
        )
        return Exam.objects.filter(lesson_id__in=lesson_ids).select_related(
            "lesson", "created_by", "created_by__user"
        ).prefetch_related("results")


# ════════════════════════════════════════════════════════════════
#  TEACHER VIEWS
# ════════════════════════════════════════════════════════════════

# ── Teacher: Exercises ────────────────────────────────────────────────────────

class TeacherExerciseListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacher]

    def get_serializer_class(self):
        return ExerciseCreateSerializer if self.request.method == "POST" else ExerciseSerializer

    def get_queryset(self):
        teacher = self.request.user.teacher_profile
        return Exercise.objects.filter(created_by=teacher).select_related("lesson")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.teacher_profile)


class TeacherExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExerciseCreateSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Exercise.objects.filter(created_by=self.request.user.teacher_profile)


class TeacherExerciseSubmissionsView(generics.ListAPIView):
    """Teacher views all student submissions for a specific exercise."""
    serializer_class = ExerciseSubmissionDetailSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        exercise = get_object_or_404(
            Exercise,
            pk=self.kwargs["exercise_id"],
            created_by=self.request.user.teacher_profile,
        )
        return exercise.submissions.select_related("student", "student__user")


# ── Teacher: Handouts ─────────────────────────────────────────────────────────

class TeacherHandoutListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacher]

    def get_serializer_class(self):
        return HandoutCreateSerializer if self.request.method == "POST" else HandoutSerializer

    def get_queryset(self):
        return Handout.objects.filter(uploaded_by=self.request.user.teacher_profile)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user.teacher_profile)


class TeacherHandoutDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = HandoutSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Handout.objects.filter(uploaded_by=self.request.user.teacher_profile)


# ── Teacher: Counseling Sessions ──────────────────────────────────────────────

class TeacherCounselingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacher]

    def get_serializer_class(self):
        return CounselingSessionCreateSerializer if self.request.method == "POST" else CounselingSessionSerializer

    def get_queryset(self):
        return CounselingSession.objects.filter(
            counselor=self.request.user.teacher_profile
        ).prefetch_related("registrations")

    def perform_create(self, serializer):
        serializer.save(counselor=self.request.user.teacher_profile)


class TeacherCounselingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CounselingSessionCreateSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return CounselingSession.objects.filter(counselor=self.request.user.teacher_profile)


class TeacherCounselingRegistrationsView(generics.ListAPIView):
    """Teacher sees who registered for a session."""
    serializer_class = CounselingRegistrationSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        session = get_object_or_404(
            CounselingSession,
            pk=self.kwargs["session_id"],
            counselor=self.request.user.teacher_profile,
        )
        return session.registrations.select_related("student", "student__user")


# ── Teacher: Exams ────────────────────────────────────────────────────────────

class TeacherExamListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacher]

    def get_serializer_class(self):
        return ExamCreateSerializer if self.request.method == "POST" else ExamSerializer

    def get_queryset(self):
        return Exam.objects.filter(created_by=self.request.user.teacher_profile).select_related("lesson")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.teacher_profile)


class TeacherExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExamCreateSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        return Exam.objects.filter(created_by=self.request.user.teacher_profile)


class TeacherExamResultsView(generics.ListCreateAPIView):
    """Teacher views or sets student results for an exam."""
    serializer_class = ExamResultSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        exam = get_object_or_404(
            Exam,
            pk=self.kwargs["exam_id"],
            created_by=self.request.user.teacher_profile,
        )
        return exam.results.select_related("student", "student__user")

    def perform_create(self, serializer):
        exam = get_object_or_404(
            Exam,
            pk=self.kwargs["exam_id"],
            created_by=self.request.user.teacher_profile,
        )
        serializer.save(exam=exam)
