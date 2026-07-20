from datetime import date

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from classes.choices import FieldOfStudy, Gender, Stage
from classes.models import (
    Exercise,
    ExerciseComment,
    ExerciseFile,
    ExerciseSubmission,
    Klass,
    KlassRegistration,
    Lesson,
    Student,
    Teacher,
)

User = get_user_model()


class RegistrationExerciseDetailViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student1",
            password="pass1234",
            first_name="Ali",
            last_name="Ahmadi",
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
            username="teacher1",
            password="pass1234",
            first_name="Sara",
            last_name="Rezaei",
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
        self.exercise = Exercise.objects.create(
            klass=self.klass,
            created_by=self.teacher,
            title="Homework 1",
            description="Solve the equations",
            due_date=date(2026, 1, 10),
        )

    def _url(self, registration_pk, exercise_pk):
        return reverse(
            "klass-registration-exercise-detail",
            args=[registration_pk, exercise_pk],
        )

    def test_requires_authentication(self):
        response = self.client.get(
            self._url(self.registration.pk, self.exercise.pk)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_returns_exercise_details(self):
        ExerciseFile.objects.create(
            exercise=self.exercise,
            file=SimpleUploadedFile("worksheet.pdf", b"content"),
        )
        ExerciseSubmission.objects.create(
            exercise=self.exercise,
            student=self.student,
            file=SimpleUploadedFile("answer.pdf", b"content"),
        )
        ExerciseComment.objects.create(
            exercise=self.exercise,
            commenter=self.user,
            comment="Great work",
        )

        self.client.force_authenticate(self.user)
        response = self.client.get(
            self._url(self.registration.pk, self.exercise.pk)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["title"], "Homework 1")
        self.assertEqual(data["description"], "Solve the equations")
        self.assertEqual(data["due_date"], "2026-01-10")

        self.assertEqual(len(data["files"]), 1)
        self.assertIn("worksheet", data["files"][0]["file"])

        self.assertEqual(len(data["submissions"]), 1)
        submission = data["submissions"][0]
        self.assertTrue(submission["name"].startswith("answer"))
        self.assertIn("answer", submission["url"])
        self.assertIn("created_at", submission)

        self.assertEqual(len(data["comments"]), 1)
        comment = data["comments"][0]
        self.assertEqual(comment["comment"], "Great work")
        self.assertEqual(comment["commenter"], "Ali Ahmadi")
        self.assertIn("created_at", comment)

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
        response = self.client.get(
            self._url(other_registration.pk, self.exercise.pk)
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_access_exercise_of_another_class(self):
        other_klass = Klass.objects.create(
            lesson=self.lesson, teacher=self.teacher
        )
        other_exercise = Exercise.objects.create(
            klass=other_klass,
            created_by=self.teacher,
            title="Other",
            due_date=date(2026, 1, 5),
        )

        self.client.force_authenticate(self.user)
        response = self.client.get(
            self._url(self.registration.pk, other_exercise.pk)
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
