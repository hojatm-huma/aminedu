from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from classes.models import (
    Student,
)
from classes.serializers import RetrieveProfileSerializer


class RetrieveProfileView(generics.RetrieveAPIView):
    serializer_class = RetrieveProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Student.objects.filter(user=self.request.user).first()
