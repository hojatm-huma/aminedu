from django.contrib import admin
from classes.models import (
    Class, Lesson, Student, Teacher, WeeklySchedule,
    Exercise, ExerciseSubmission,
    Handout,
    CounselingSession, CounselingRegistration,
    Exam, ExamResult,
)


# Register your models here.
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "weekly_schedule",
    )
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )


@admin.register(WeeklySchedule)
class WeeklyScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = ("name",)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
    )


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "lesson",
        "teacher",
        "starts_at",
        "ends_at",
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "field_of_study",
    )


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "created_by", "due_date", "created_at")
    list_filter = ("lesson", "due_date")
    search_fields = ("title", "lesson__name", "created_by__user__last_name")
    date_hierarchy = "due_date"


@admin.register(ExerciseSubmission)
class ExerciseSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "exercise", "student", "submitted_at")
    list_filter = ("exercise__lesson",)
    search_fields = ("student__user__username", "exercise__title")


@admin.register(Handout)
class HandoutAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "uploaded_by", "uploaded_at")
    list_filter = ("lesson", "uploaded_by")
    search_fields = ("title", "lesson__name", "uploaded_by__user__last_name")


@admin.register(CounselingSession)
class CounselingSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "counselor", "session_date", "starts_at", "ends_at", "capacity", "is_cancelled")
    list_filter = ("session_date", "is_cancelled", "counselor")
    search_fields = ("title", "counselor__user__last_name")


@admin.register(CounselingRegistration)
class CounselingRegistrationAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "student", "registered_at")
    list_filter = ("session__session_date",)
    search_fields = ("student__user__username", "session__title")


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "lesson", "created_by", "exam_date", "starts_at", "total_score")
    list_filter = ("exam_date", "lesson")
    search_fields = ("title", "lesson__name", "created_by__user__last_name")


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ("id", "exam", "student", "score", "graded_at")
    list_filter = ("exam__lesson",)
    search_fields = ("student__user__username", "exam__title")

