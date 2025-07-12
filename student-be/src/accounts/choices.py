from django.db import models
from django.utils.translation import gettext_lazy as _


class FieldOfStudy(models.TextChoices):
    MATH = "MATH", _("Mathematics")
    SCIENCE = "SCIENCE", _("Science")
    HUMANITIES = "HUMANITIES", _("Humanities")


class Stage(models.TextChoices):
    TENTH = "TENTH", _("Tenth Grade")
    ELEVENTH = "ELEVENTH", _("Eleventh Grade")
    TWELFTH = "TWELFTH", _("Twelfth Grade")
    GRADUATED = "GRADUATED", _("Graduated")


class Gender(models.TextChoices):
    MALE = "MALE", _("Male")
    FEMALE = "FEMALE", _("Female")
