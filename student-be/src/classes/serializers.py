from rest_framework import serializers
from classes.models import (
    Student,
)


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
