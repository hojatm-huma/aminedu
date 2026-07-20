from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from classes.choices import FieldOfStudy, Gender, Stage
from classes.models import (
    Exercise,
    Klass,
    KlassRegistration,
    Lesson,
    Student,
    Teacher,
)

User = get_user_model()


class RegistrationExerciseListViewTests(APITestCase):
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
        self.klass = Klass.objects.create(
            lesson=self.lesson, teacher=self.teacher
        )
        self.registration = KlassRegistration.objects.create(
            klass=self.klass, student=self.student
        )

    def _url(self, pk):
        return reverse("klass-registration-exercises", args=[pk])

    def _make_exercise(self, title, due_date, klass=None):
        return Exercise.objects.create(
            klass=klass or self.klass,
            created_by=self.teacher,
            title=title,
            due_date=due_date,
        )

    def test_requires_authentication(self):
        response = self.client.get(self._url(self.registration.pk))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_returns_title_and_due_date(self):
        self._make_exercise("Homework 1", date(2026, 1, 10))

        self.client.force_authenticate(self.user)
        response = self.client.get(self._url(self.registration.pk))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            set(response.data[0].keys()), {"id", "title", "due_date"}
        )
        self.assertEqual(response.data[0]["title"], "Homework 1")
        self.assertEqual(response.data[0]["due_date"], "2026-01-10")

    def test_ordered_by_due_date(self):
        self._make_exercise("Later", date(2026, 3, 1))
        self._make_exercise("Earlier", date(2026, 1, 1))
        self._make_exercise("Middle", date(2026, 2, 1))

        self.client.force_authenticate(self.user)
        response = self.client.get(self._url(self.registration.pk))

        due_dates = [row["due_date"] for row in response.data]
        self.assertEqual(due_dates, sorted(due_dates))

    def test_only_returns_exercises_of_the_registered_klass(self):
        other_klass = Klass.objects.create(
            lesson=self.lesson, teacher=self.teacher
        )
        self._make_exercise("Mine", date(2026, 1, 5))
        self._make_exercise("Other", date(2026, 1, 6), klass=other_klass)

        self.client.force_authenticate(self.user)
        response = self.client.get(self._url(self.registration.pk))

        titles = [row["title"] for row in response.data]
        self.assertEqual(titles, ["Mine"])

    def test_cannot_access_another_students_registration(self):
        other_user = User.objects.create_user(
            username="student2", password="pass1234"
        )
        other_student = Student.objects.create(
            user=other_user,
            national_code="0987654321",
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
        other_registration = KlassRegistration.objects.create(
            klass=self.klass, student=other_student
        )

        self.client.force_authenticate(self.user)
        response = self.client.get(self._url(other_registration.pk))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
