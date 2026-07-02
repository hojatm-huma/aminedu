from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    """Allows access only to users who have a teacher profile."""
    message = "Access restricted to teachers only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "teacher_profile")
        )


class IsStudent(BasePermission):
    """Allows access only to users who have a student profile."""
    message = "Access restricted to students only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "student_profile")
        )


class IsTeacherOrReadOnly(BasePermission):
    """
    Teachers have full write access.
    Students (and other authenticated users) have read-only access.
    """
    message = "Write access restricted to teachers only."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return hasattr(request.user, "teacher_profile")
