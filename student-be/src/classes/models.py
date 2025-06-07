from django.db import models
from django.utils.translation import gettext_lazy as _


class WeeklySchedule(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        blank=False,
        null=False,
        verbose_name=_("Schedule Name"),
    )

    classes = models.ManyToManyField(
        "Class",
        related_name="weekly_schedules",
        verbose_name=_("Classes"),
    )


class Student(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="student_profile",
        verbose_name=_("User"),
    )

    weekly_schedule = models.ForeignKey(
        "WeeklySchedule",
        on_delete=models.CASCADE,
        related_name="students",
        verbose_name=_("Weekly Schedule"),
    )

    class Meta:
        verbose_name = _("Student")
        verbose_name_plural = _("Students")


class Class(models.Model):
    lesson = models.ForeignKey(
        "Lesson",
        on_delete=models.CASCADE,
        related_name="classes",
        verbose_name=_("Lesson"),
    )

    teacher = models.ForeignKey(
        "Teacher",
        on_delete=models.CASCADE,
        related_name="classes",
        verbose_name=_("Teacher"),
    )

    starts_at = models.TimeField(
        blank=False,
        null=False,
        verbose_name=_("Starts At"),
    )

    ends_at = models.TimeField(
        blank=False,
        null=False,
        verbose_name=_("Ends At"),
    )


class Lesson(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        blank=False,
        null=False,
        verbose_name=_("Lesson Name"),
    )

    field_of_study = models.CharField(
        max_length=20,
        blank=False,
        verbose_name=_("Field of Study"),
    )


class Teacher(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        verbose_name=_("User"),
    )

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"
