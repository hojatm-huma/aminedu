from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import RetrieveProfileSerializer


class RetrieveProfile(RetrieveAPIView):
    serializer_class = RetrieveProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
