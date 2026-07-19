from django.db import models
from django.utils.translation import gettext_lazy as _
from classes.choices import DayOfWeek, FieldOfStudy, Gender, Stage


class BaseModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
    )

    class Meta:
        abstract = True


class Student(BaseModel):
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

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

    class Meta:
        verbose_name = _("Student")
        verbose_name_plural = _("Students")


class Lesson(BaseModel):
    name = models.CharField(
        max_length=100,
        unique=True,
        blank=False,
        null=False,
        verbose_name=_("Lesson Name"),
    )

    field_of_study = models.CharField(
        choices=FieldOfStudy.choices,
        blank=False,
        verbose_name=_("Field of Study"),
    )

    stage = models.CharField(
        choices=Stage.choices, blank=False, verbose_name=_("Stage")
    )

    def __str__(self):
        return f"{self.id} - {self.name}"


class Klass(BaseModel):
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

    def __str__(self):
        return f"{self.id} - {self.lesson}"


class KlassSchedule(BaseModel):
    klass = models.ForeignKey(
        Klass,
        on_delete=models.CASCADE,
        verbose_name=_("Class Schedule"),
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


class KlassRegistration(BaseModel):
    klass = models.ForeignKey(
        Klass,
        on_delete=models.CASCADE,
    )


class Teacher(BaseModel):
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


class Exercise(BaseModel):
    klass = models.ForeignKey(
        Klass,
        on_delete=models.CASCADE,
        verbose_name=_("Class"),
    )

    created_by = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="exercises",
        verbose_name=_("Created By"),
    )

    title = models.CharField(
        max_length=200,
        verbose_name=_("Title"),
    )

    description = models.TextField(
        blank=True,
        verbose_name=_("Description"),
    )

    due_date = models.DateField(
        verbose_name=_("Due Date"),
    )

    def __str__(self):
        return f"{self.lesson.name} — {self.title}"

    class Meta:
        verbose_name = _("Exercise")
        verbose_name_plural = _("Exercises")
        ordering = ["due_date"]


class ExerciseFile(BaseModel):
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
    )

    file = models.FileField()


class ExerciseSubmission(models.Model):
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Exercise"),
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Student"),
    )

    file = models.FileField(
        upload_to="submissions/%Y/%m/",
        verbose_name=_("File"),
    )

    grade = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("Grade"),
    )

    graded_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Graded At"),
    )

    class Meta:
        unique_together = ("exercise", "student")
        verbose_name = _("Exercise Submission")
        verbose_name_plural = _("Exercise Submissions")

    def __str__(self):
        return f"{self.student.user.username} → {self.exercise.title}"


class ExerciseComment(BaseModel):
    commenter = models.CharField(
        "accounts.User",
    )
