from rest_framework import serializers
from classes.models import Class, WeeklySchedule, Lesson, Teacher


class RetrieveWeeklyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklySchedule
        fields = "__all__"

    class ClassSerializer(serializers.ModelSerializer):
        class Meta:
            model = Class
            fields = ("id", "lesson", "teacher", "starts_at", "ends_at")

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
