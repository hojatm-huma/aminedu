from django.db import models
from django.utils.translation import gettext_lazy as _


class DayOfWeek(models.IntegerChoices):
    SATURDAY = 0
    SUNDAY = 1
    MONDAY = 2
    TUESDAY = 3
    WEDNESDAY = 4
    THURSDAY = 5
    FRIDAY = 6


class FieldOfStudy(models.TextChoices):
    SCIENCE = "Science", _("Science")
    MATH = "Math", _("Math")
    Humanities = "Humanities", _("Humanities")


class SchoolYear(models.TextChoices):
    ELEVENTH_YEAR = "Eleventh Year", _("Eleventh Year")
    TWELFTH_YEAR = "Twelfth Year", _("Twelfth Year")


class Gender(models.TextChoices):
    MALE = "Male", _("Male")
    FEMALE = "Female", _("Female")
