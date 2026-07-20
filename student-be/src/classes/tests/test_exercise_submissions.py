from datetime import date

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from classes.choices import FieldOfStudy, Gender, Stage
from classes.models import (
    Exercise,
    ExerciseSubmission,
    Klass,
    KlassRegistration,
    Lesson,
    Student,
    Teacher,
)

User = get_user_model()


class ExerciseSubmissionCreateViewTests(APITestCase):
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
        self.exercise = Exercise.objects.create(
            klass=self.klass,
            created_by=self.teacher,
            title="Homework 1",
            due_date=date(2026, 1, 10),
        )

    def _url(self, registration_pk, exercise_pk):
        return reverse(
            "klass-registration-exercise-submissions",
            args=[registration_pk, exercise_pk],
        )

    def test_requires_authentication(self):
        response = self.client.post(
            self._url(self.registration.pk, self.exercise.pk),
            {"file": SimpleUploadedFile("answer.pdf", b"content")},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_creates_submission_for_current_student(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self._url(self.registration.pk, self.exercise.pk),
            {"file": SimpleUploadedFile("answer.pdf", b"content")},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExerciseSubmission.objects.count(), 1)
        submission = ExerciseSubmission.objects.get()
        self.assertEqual(submission.exercise, self.exercise)
        self.assertEqual(submission.student, self.student)
        self.assertIn("answer", submission.file.name)

    def test_cannot_submit_to_another_students_registration(self):
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
        response = self.client.post(
            self._url(other_registration.pk, self.exercise.pk),
            {"file": SimpleUploadedFile("answer.pdf", b"content")},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(ExerciseSubmission.objects.count(), 0)

    def test_cannot_submit_to_exercise_of_another_class(self):
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
        response = self.client.post(
            self._url(self.registration.pk, other_exercise.pk),
            {"file": SimpleUploadedFile("answer.pdf", b"content")},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(ExerciseSubmission.objects.count(), 0)
