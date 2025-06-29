from rest_framework import serializers
from classes.models import Class, WeeklySchedule, Lesson, Teacher
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
