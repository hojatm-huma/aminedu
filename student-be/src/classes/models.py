from django.db import models
from django.utils.translation import gettext_lazy as _
from classes.choices import DayOfWeek, FieldOfStudy, Gender, Stage


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

    national_code = models.CharField(
        max_length=10,
        unique=True,
        verbose_name=_("National Code"),
    )

    field_of_study = models.CharField(
        max_length=20,
        choices=FieldOfStudy.choices,
        verbose_name=_("Field of Study"),
    )

    stage = models.CharField(
        max_length=20,
        choices=Stage.choices,
        verbose_name=_("Stage"),
    )

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        verbose_name=_("Gender"),
    )

    phone_number = models.CharField(
        max_length=15,
        verbose_name=_("Phone Number"),
    )

    supervisor_phone_number = models.CharField(
        max_length=15,
        verbose_name=_("Supervisor Phone Number"),
    )

    province = models.CharField(
        max_length=50,
        verbose_name=_("Province"),
    )

    city = models.CharField(
        max_length=50,
        verbose_name=_("City"),
    )

    village = models.CharField(
        max_length=50,
        verbose_name=_("Village"),
    )

    address = models.CharField(
        max_length=255,
        verbose_name=_("Address"),
    )

    postcode = models.CharField(
        max_length=10,
        verbose_name=_("Postcode"),
    )

    weekly_schedule = models.ForeignKey(
        "WeeklySchedule",
        null=True,
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

    day_of_week = models.IntegerField(
        default=DayOfWeek.SATURDAY,
        choices=DayOfWeek.choices,
        verbose_name=_("Day of Week"),
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

    def __str__(self):
        return f"{self.id} - {self.lesson}"


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

    def __str__(self):
        return f"{self.id} - {self.name}"


class Teacher(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        verbose_name=_("User"),
    )

    def __str__(self):
        return f"{self.id} - {self.user.last_name}"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"
