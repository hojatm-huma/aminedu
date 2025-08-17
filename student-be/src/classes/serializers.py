from rest_framework import serializers
from classes.models import Class, Student, WeeklySchedule, Lesson, Teacher
from rest_framework.fields import SerializerMethodField


class RetrieveWeeklyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklySchedule
        fields = "__all__"

    class ClassSerializer(serializers.ModelSerializer):
        class Meta:
            model = Class
            fields = (
                "id",
                "lesson",
                "teacher",
                "starts_at",
                "ends_at",
                "day_of_week",
            )

        starts_at = SerializerMethodField()
        ends_at = SerializerMethodField()

        def get_starts_at(self, obj):
            if obj.starts_at:
                return obj.starts_at.strftime("%H:%M")
            return None

        def get_ends_at(self, obj):
            if obj.starts_at:
                return obj.starts_at.strftime("%H:%M")
            return None

        class TeacherSerializer(serializers.ModelSerializer):
            class Meta:
                model = Teacher
                fields = ["id", "full_name"]

        class LessonSerializer(serializers.ModelSerializer):
            class Meta:
                model = Lesson
                fields = ["id", "name"]

        lesson = LessonSerializer(read_only=True)
        teacher = TeacherSerializer(read_only=True)

    classes = ClassSerializer(many=True, read_only=True)


class RetrieveProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "first_name",
            "last_name",
            "national_code",
            "field_of_study",
            "stage",
            "gender",
            "phone_number",
            "supervisor_phone_number",
            "province",
            "city",
            "village",
            "address",
            "postcode",
        ]
        extra_kwargs = {
            "gender": {"source": "get_gender_display"},
            "stage": {"source": "get_stage_display"},
            "field_of_study": {"source": "get_field_of_study_display"},
        }

    def get_first_name(self, obj: Student):
        return obj.first_name

    def get_last_name(self, obj: Student):
        return obj.last_name
