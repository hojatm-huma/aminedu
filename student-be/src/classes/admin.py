from django.contrib import admin
from classes.models import Class, Lesson, Student, Teacher, WeeklySchedule, Exercise, ExerciseSubmission


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
