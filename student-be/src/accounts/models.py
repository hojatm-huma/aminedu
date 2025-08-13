from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from accounts.choices import FieldOfStudy, Stage, Gender


class User(AbstractUser):
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    national_code = models.CharField(
        max_length=10,
        unique=True,
        blank=False,
        null=False,
        verbose_name=_("National Code"),
    )

    field_of_study = models.CharField(
        max_length=20,
        blank=False,
        choices=FieldOfStudy.choices,
        verbose_name=_("Field of Study"),
    )

    stage = models.CharField(
        max_length=20,
        blank=False,
        choices=Stage.choices,
        verbose_name=_("Stage"),
    )

    gender = models.CharField(
        max_length=10,
        blank=False,
        choices=Gender.choices,
        verbose_name=_("Gender"),
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=False,
        verbose_name=_("Phone Number"),
    )

    supervisor_phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=False,
        verbose_name=_("Supervisor Phone Number"),
    )

    province = models.CharField(
        max_length=50,
        blank=True,
        null=False,
        verbose_name=_("Province"),
    )

    city = models.CharField(
        max_length=50,
        blank=True,
        null=False,
        verbose_name=_("City"),
    )

    village = models.CharField(
        max_length=50,
        blank=True,
        null=False,
        verbose_name=_("Village"),
    )

    address = models.CharField(
        max_length=255,
        blank=True,
        null=False,
        verbose_name=_("Address"),
    )

    postcode = models.CharField(
        max_length=10,
        blank=True,
        null=False,
        verbose_name=_("Postcode"),
    )

    has_smartphone = models.BooleanField(
        default=False,
        verbose_name=_("Has Smartphone"),
    )

    eager_to_join_english_class = models.BooleanField(
        default=False,
        verbose_name=_("Eager to Join English Class"),
    )

    eager_to_join_book_club = models.BooleanField(
        default=False,
        verbose_name=_("Eager to Join Book Club"),
    )

    eager_to_join_thinking_club = models.BooleanField(
        default=False,
        verbose_name=_("Eager to Join Thinking Class"),
    )

    def __str__(self):
        return self.username
