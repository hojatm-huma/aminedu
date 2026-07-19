from django.contrib import admin

from classes.models import (
    Student,
    Lesson,
    Klass,
    KlassSchedule,
    KlassRegistration,
    Teacher,
    Exercise,
    ExerciseFile,
    ExerciseSubmission,
    ExerciseComment,
)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "national_code",
        "field_of_study",
        "stage",
        "gender",
        "province",
        "city",
        "created_at",
    )
    list_filter = ("field_of_study", "stage", "gender", "province")
    search_fields = (
        "national_code",
        "phone_number",
        "user__first_name",
        "user__last_name",
        "user__username",
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "field_of_study", "stage", "created_at")
    list_filter = ("field_of_study", "stage")
    search_fields = ("name",)


class KlassScheduleInline(admin.TabularInline):
    model = KlassSchedule
    extra = 1


@admin.register(Klass)
class KlassAdmin(admin.ModelAdmin):
    list_display = ("id", "lesson", "teacher", "created_at")
    list_filter = ("lesson__field_of_study", "lesson__stage")
    search_fields = ("lesson__name", "teacher__user__last_name")
    raw_id_fields = ("lesson", "teacher")
    inlines = (KlassScheduleInline,)


@admin.register(KlassSchedule)
class KlassScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "klass", "day_of_week", "starts_at", "ends_at")
    list_filter = ("day_of_week",)
    raw_id_fields = ("klass",)


@admin.register(KlassRegistration)
class KlassRegistrationAdmin(admin.ModelAdmin):
    list_display = ("id", "klass", "created_at")
    raw_id_fields = ("klass",)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "created_at")
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__username",
    )
    raw_id_fields = ("user",)


class ExerciseFileInline(admin.TabularInline):
    model = ExerciseFile
    extra = 1


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "klass", "created_by", "due_date", "created_at")
    list_filter = ("due_date", "klass__lesson__field_of_study")
    search_fields = ("title", "description")
    raw_id_fields = ("klass", "created_by")
    date_hierarchy = "due_date"
    inlines = (ExerciseFileInline,)


@admin.register(ExerciseFile)
class ExerciseFileAdmin(admin.ModelAdmin):
    list_display = ("id", "exercise", "file", "created_at")
    raw_id_fields = ("exercise",)


@admin.register(ExerciseSubmission)
class ExerciseSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "exercise", "student", "grade", "graded_at")
    list_filter = ("graded_at",)
    search_fields = (
        "exercise__title",
        "student__user__username",
        "student__national_code",
    )
    raw_id_fields = ("exercise", "student")


@admin.register(ExerciseComment)
class ExerciseCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "commenter", "created_at")
