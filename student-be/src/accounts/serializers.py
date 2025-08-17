class RetrieveProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving user profile information.
    """
    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_picture')

    def validate(self, data):
        """
        Custom validation logic can be added here if needed.
        """
        return data