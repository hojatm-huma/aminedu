from datetime import time

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from classes.choices import DayOfWeek, FieldOfStudy, Gender, Stage
from classes.models import (
    Klass,
    KlassRegistration,
    KlassSchedule,
    Lesson,
    Student,
    Teacher,
)

User = get_user_model()


class KlassScheduleListViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student1", password="pass1234"
        )
        self.student = Student.objects.create(
            user=self.user,
            national_code="1234567890",
            field_of_study=FieldOfStudy.MATH,
            stage=Stage.TENTH,
            gender=Gender.MALE,
            phone_number="0900",
            supervisor_phone_number="0901",
            province="P",
            city="C",
            village="V",
            address="A",
            postcode="0000000000",
        )

        teacher_user = User.objects.create_user(
            username="teacher1", password="pass1234"
        )
        self.teacher = Teacher.objects.create(user=teacher_user)
        self.lesson = Lesson.objects.create(
            name="Algebra",
            field_of_study=FieldOfStudy.MATH,
            stage=Stage.TENTH,
        )

        self.url = reverse("klass-schedule")

    def _make_schedule(self, day_of_week, starts_at, ends_at, register=True):
        klass = Klass.objects.create(lesson=self.lesson, teacher=self.teacher)
        if register:
            KlassRegistration.objects.create(klass=klass, student=self.student)
        return KlassSchedule.objects.create(
            klass=klass,
            day_of_week=day_of_week,
            starts_at=starts_at,
            ends_at=ends_at,
        )

    def test_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_returns_only_registered_klasses(self):
        self._make_schedule(DayOfWeek.SATURDAY, time(9, 0), time(10, 0))
        self._make_schedule(
            DayOfWeek.SATURDAY, time(11, 0), time(12, 0), register=False
        )

        self.client.force_authenticate(self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_ordered_by_starts_at(self):
        self._make_schedule(DayOfWeek.SATURDAY, time(12, 0), time(13, 0))
        self._make_schedule(DayOfWeek.SATURDAY, time(8, 0), time(9, 0))
        self._make_schedule(DayOfWeek.SATURDAY, time(10, 0), time(11, 0))

        self.client.force_authenticate(self.user)
        response = self.client.get(self.url)

        starts = [row["starts_at"] for row in response.data]
        self.assertEqual(starts, sorted(starts))

    def test_filter_by_day_of_week(self):
        self._make_schedule(DayOfWeek.SATURDAY, time(9, 0), time(10, 0))
        self._make_schedule(DayOfWeek.MONDAY, time(9, 0), time(10, 0))

        self.client.force_authenticate(self.user)
        response = self.client.get(
            self.url, {"day_of_week": DayOfWeek.MONDAY.value}
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["day_of_week"], DayOfWeek.MONDAY.value)
