from rest_framework import serializers
from classes.models import (
    Exercise,
    KlassRegistration,
    KlassSchedule,
    Student,
)


class KlassScheduleSerializer(serializers.ModelSerializer):
    klass_id = serializers.IntegerField(source="klass.id", read_only=True)
    lesson = serializers.CharField(source="klass.lesson.name", read_only=True)
    teacher = serializers.CharField(source="klass.teacher.full_name", read_only=True)

    class Meta:
        model = KlassSchedule
        fields = [
            "id",
            "klass_id",
            "lesson",
            "teacher",
            "day_of_week",
            "starts_at",
            "ends_at",
        ]


class KlassRegistrationSerializer(serializers.ModelSerializer):
    klass_id = serializers.IntegerField(
        source="klass.id",
        read_only=True,
    )
    name = serializers.CharField(
        source="klass.lesson.name",
        read_only=True,
    )
    teacher = serializers.CharField(
        source="klass.teacher.full_name",
        read_only=True,
    )
    exercise_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = KlassRegistration
        fields = [
            "id",
            "klass_id",
            "name",
            "teacher",
            "exercise_count",
        ]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = [
            "id",
            "title",
            "due_date",
        ]


class RetrieveProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")

    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "national_code"]

    def get_first_name(self, obj: Student):
        return obj.first_name

    def get_last_name(self, obj: Student):
        return obj.last_name
