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

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

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


class Exercise(models.Model):
    lesson = models.ForeignKey(
        "Lesson",
        on_delete=models.CASCADE,
        related_name="exercises",
        verbose_name=_("Lesson"),
    )

    created_by = models.ForeignKey(
        "Teacher",
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

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
    )

    def __str__(self):
        return f"{self.lesson.name} — {self.title}"

    class Meta:
        verbose_name = _("Exercise")
        verbose_name_plural = _("Exercises")
        ordering = ["due_date"]


class ExerciseSubmission(models.Model):
    exercise = models.ForeignKey(
        "Exercise",
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Exercise"),
    )

    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Student"),
    )

    file = models.FileField(
        upload_to="submissions/%Y/%m/",
        verbose_name=_("File"),
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Submitted At"),
    )

    # ── Grading (filled by teacher) ─────────────────────────────────────────
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


# ── Handout ───────────────────────────────────────────────────────────────────

class Handout(models.Model):
    lesson = models.ForeignKey(
        "Lesson",
        on_delete=models.CASCADE,
        related_name="handouts",
        verbose_name=_("Lesson"),
    )
    uploaded_by = models.ForeignKey(
        "Teacher",
        on_delete=models.CASCADE,
        related_name="handouts",
        verbose_name=_("Uploaded By"),
    )
    title = models.CharField(max_length=200, verbose_name=_("Title"))
    description = models.TextField(blank=True, verbose_name=_("Description"))
    file = models.FileField(upload_to="handouts/%Y/%m/", verbose_name=_("File"))
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Uploaded At"))

    class Meta:
        verbose_name = _("Handout")
        verbose_name_plural = _("Handouts")
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.lesson.name} — {self.title}"


# ── Counseling ────────────────────────────────────────────────────────────────

class CounselingSession(models.Model):
    counselor = models.ForeignKey(
        "Teacher",
        on_delete=models.CASCADE,
        related_name="counseling_sessions",
        verbose_name=_("Counselor"),
    )
    title = models.CharField(max_length=200, verbose_name=_("Title"))
    session_date = models.DateField(verbose_name=_("Date"))
    starts_at = models.TimeField(verbose_name=_("Starts At"))
    ends_at = models.TimeField(verbose_name=_("Ends At"))
    capacity = models.PositiveIntegerField(default=20, verbose_name=_("Capacity"))
    is_cancelled = models.BooleanField(default=False, verbose_name=_("Cancelled"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Counseling Session")
        verbose_name_plural = _("Counseling Sessions")
        ordering = ["session_date", "starts_at"]

    def __str__(self):
        return f"{self.session_date} {self.starts_at} — {self.title}"

    @property
    def registered_count(self):
        return self.registrations.count()


class CounselingRegistration(models.Model):
    session = models.ForeignKey(
        "CounselingSession",
        on_delete=models.CASCADE,
        related_name="registrations",
        verbose_name=_("Session"),
    )
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="counseling_registrations",
        verbose_name=_("Student"),
    )
    registered_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Registered At"))

    class Meta:
        unique_together = ("session", "student")
        verbose_name = _("Counseling Registration")
        verbose_name_plural = _("Counseling Registrations")

    def __str__(self):
        return f"{self.student.user.username} → {self.session.title}"


# ── Exam ──────────────────────────────────────────────────────────────────────

class Exam(models.Model):
    lesson = models.ForeignKey(
        "Lesson",
        on_delete=models.CASCADE,
        related_name="exams",
        verbose_name=_("Lesson"),
    )
    created_by = models.ForeignKey(
        "Teacher",
        on_delete=models.CASCADE,
        related_name="exams",
        verbose_name=_("Created By"),
    )
    title = models.CharField(max_length=200, verbose_name=_("Title"))
    exam_date = models.DateField(verbose_name=_("Exam Date"))
    starts_at = models.TimeField(verbose_name=_("Starts At"))
    total_score = models.PositiveSmallIntegerField(default=20, verbose_name=_("Total Score"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Exam")
        verbose_name_plural = _("Exams")
        ordering = ["exam_date", "starts_at"]

    def __str__(self):
        return f"{self.lesson.name} — {self.title} ({self.exam_date})"


class ExamResult(models.Model):
    exam = models.ForeignKey(
        "Exam",
        on_delete=models.CASCADE,
        related_name="results",
        verbose_name=_("Exam"),
    )
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="exam_results",
        verbose_name=_("Student"),
    )
    score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name=_("Score"),
    )
    graded_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Graded At"))

    class Meta:
        unique_together = ("exam", "student")
        verbose_name = _("Exam Result")
        verbose_name_plural = _("Exam Results")

    def __str__(self):
        return f"{self.student.user.username}: {self.score}/{self.exam.total_score}"


# ── Q&A ───────────────────────────────────────────────────────────────────────

class Question(models.Model):
    class Status(models.TextChoices):
        PENDING  = "pending",  _("Pending")
        ANSWERED = "answered", _("Answered")

    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="questions",
        verbose_name=_("Student"),
    )

    subject = models.CharField(max_length=100, verbose_name=_("Subject"))
    topic   = models.CharField(max_length=200, verbose_name=_("Topic"))
    body    = models.TextField(verbose_name=_("Body"))

    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Submitted At"))
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name=_("Status"),
    )

    # ── Answer (filled by teacher) ───────────────────────────────────────────
    answer = models.TextField(blank=True, verbose_name=_("Answer"))
    answered_by = models.ForeignKey(
        "Teacher",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="answered_questions",
        verbose_name=_("Answered By"),
    )
    answered_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Answered At"))

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.student.user.username}: {self.topic} [{self.status}]"
