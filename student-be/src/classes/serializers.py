from rest_framework import serializers
from classes.models import (
    Class, Student, WeeklySchedule, Lesson, Teacher,
    Exercise, ExerciseSubmission,
    Handout, CounselingSession, CounselingRegistration,
    Exam, ExamResult,
)
from rest_framework.fields import SerializerMethodField


# ── Shared ────────────────────────────────────────────────────────────────────

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "name", "field_of_study"]


class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Teacher
        fields = ["id", "full_name"]


# ── Weekly Schedule (student) ─────────────────────────────────────────────────

class RetrieveClassSerializer(serializers.ModelSerializer):
    lesson = serializers.CharField(source="lesson.name")
    teacher = serializers.CharField(source="teacher.full_name")

    class Meta:
        model = Class
        fields = ["id", "lesson", "teacher", "day_of_week", "starts_at", "ends_at"]


class RetrieveWeeklyScheduleSerializer(serializers.ModelSerializer):
    classes = RetrieveClassSerializer(many=True)

    class Meta:
        model = WeeklySchedule
        fields = ["id", "name", "classes"]


# ── Student profile (student) ─────────────────────────────────────────────────

class RetrieveProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name  = serializers.CharField(source="user.last_name")

    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "national_code"]

    def get_first_name(self, obj: Student):
        return obj.first_name

    def get_last_name(self, obj: Student):
        return obj.last_name


# ── Exercise (student) ────────────────────────────────────────────────────────

class ExerciseSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseSubmission
        fields = ["id", "file", "submitted_at"]
        read_only_fields = ["submitted_at"]


class ExerciseSerializer(serializers.ModelSerializer):
    lesson_name = serializers.CharField(source="lesson.name", read_only=True)
    teacher_name = serializers.CharField(source="created_by.full_name", read_only=True)
    submission = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = [
            "id", "title", "description", "due_date", "created_at",
            "lesson", "lesson_name", "teacher_name", "submission",
        ]

    def get_submission(self, obj: Exercise):
        request = self.context.get("request")
        if not request:
            return None
        try:
            student = request.user.student_profile
            sub = obj.submissions.get(student=student)
            return ExerciseSubmissionSerializer(sub, context=self.context).data
        except (ExerciseSubmission.DoesNotExist, Exception):
            return None


# ── Handout ───────────────────────────────────────────────────────────────────

class HandoutSerializer(serializers.ModelSerializer):
    lesson_name  = serializers.CharField(source="lesson.name",        read_only=True)
    teacher_name = serializers.CharField(source="uploaded_by.full_name", read_only=True)

    class Meta:
        model = Handout
        fields = [
            "id", "title", "description", "file", "uploaded_at",
            "lesson", "lesson_name", "teacher_name",
        ]
        read_only_fields = ["uploaded_at", "lesson_name", "teacher_name"]


class HandoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handout
        fields = ["id", "lesson", "title", "description", "file"]


# ── Counseling ────────────────────────────────────────────────────────────────

class CounselingRegistrationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = CounselingRegistration
        fields = ["id", "student_name", "registered_at"]
        read_only_fields = ["registered_at"]


class CounselingSessionSerializer(serializers.ModelSerializer):
    counselor_name   = serializers.CharField(source="counselor.full_name", read_only=True)
    registered_count = serializers.IntegerField(read_only=True)
    is_registered    = serializers.SerializerMethodField()

    class Meta:
        model = CounselingSession
        fields = [
            "id", "title", "session_date", "starts_at", "ends_at",
            "capacity", "is_cancelled", "counselor_name",
            "registered_count", "is_registered",
        ]

    def get_is_registered(self, obj: CounselingSession):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "student_profile"):
            return None
        return obj.registrations.filter(student=request.user.student_profile).exists()


class CounselingSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselingSession
        fields = ["id", "title", "session_date", "starts_at", "ends_at", "capacity"]


# ── Exam ──────────────────────────────────────────────────────────────────────

class ExamResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = ExamResult
        fields = ["id", "student_name", "score", "graded_at"]
        read_only_fields = ["graded_at"]


class ExamSerializer(serializers.ModelSerializer):
    lesson_name  = serializers.CharField(source="lesson.name",        read_only=True)
    teacher_name = serializers.CharField(source="created_by.full_name", read_only=True)
    my_result    = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = [
            "id", "title", "exam_date", "starts_at", "total_score",
            "lesson", "lesson_name", "teacher_name", "my_result",
        ]

    def get_my_result(self, obj: Exam):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "student_profile"):
            return None
        try:
            result = obj.results.get(student=request.user.student_profile)
            return ExamResultSerializer(result).data
        except ExamResult.DoesNotExist:
            return None


class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "lesson", "title", "exam_date", "starts_at", "total_score"]


# ── Teacher: Exercise submission list ─────────────────────────────────────────

class ExerciseSubmissionDetailSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = ExerciseSubmission
        fields = ["id", "student_name", "file", "submitted_at"]


class ExerciseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "lesson", "title", "description", "due_date"]
