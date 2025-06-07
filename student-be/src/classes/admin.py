from django.contrib import admin
from classes.models import Class, Lesson, Student, Teacher, WeeklySchedule


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
    list_display = ("user",)


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = (
        "lesson",
        "teacher",
        "starts_at",
        "ends_at",
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("name",)
