from django.urls import path
from classes.views import (
    # Shared
    MeView,
    RetrieveProfileView,
    RetrieveWeeklyScheduleView,
    # Student
    ListExercisesView,
    SubmitExerciseView,
    ListHandoutsView,
    ListCounselingSessionsView,
    RegisterCounselingView,
    ListExamsView,
    StudentQuestionListCreateView,
    # Teacher
    TeacherExerciseListCreateView,
    TeacherExerciseDetailView,
    TeacherExerciseSubmissionsView,
    GradeSubmissionView,
    TeacherHandoutListCreateView,
    TeacherHandoutDetailView,
    TeacherCounselingListCreateView,
    TeacherCounselingDetailView,
    TeacherCounselingRegistrationsView,
    TeacherExamListCreateView,
    TeacherExamDetailView,
    TeacherExamResultsView,
    TeacherQuestionListView,
    TeacherAnswerQuestionView,
)

urlpatterns = [
    # ── Shared ────────────────────────────────────────────────────────────────
    path("me/",               MeView.as_view(),                    name="me"),
    path("weekly-schedule/",  RetrieveWeeklyScheduleView.as_view(), name="weekly_schedule"),
    path("student/profile/",  RetrieveProfileView.as_view(),       name="profile"),

    # ── Student ───────────────────────────────────────────────────────────────
    path("exercises/",                          ListExercisesView.as_view(),           name="list_exercises"),
    path("exercises/<int:exercise_id>/submit/", SubmitExerciseView.as_view(),          name="submit_exercise"),
    path("handouts/",                           ListHandoutsView.as_view(),            name="list_handouts"),
    path("counseling-sessions/",                ListCounselingSessionsView.as_view(),  name="counseling_sessions"),
    path("counseling-sessions/<int:session_id>/register/", RegisterCounselingView.as_view(), name="register_counseling"),
    path("exams/",                              ListExamsView.as_view(),               name="list_exams"),
    path("questions/",                          StudentQuestionListCreateView.as_view(), name="student_questions"),

    # ── Teacher: Exercises ────────────────────────────────────────────────────
    path("teacher/exercises/",                              TeacherExerciseListCreateView.as_view(),  name="teacher_exercises"),
    path("teacher/exercises/<int:pk>/",                     TeacherExerciseDetailView.as_view(),      name="teacher_exercise_detail"),
    path("teacher/exercises/<int:exercise_id>/submissions/",TeacherExerciseSubmissionsView.as_view(), name="teacher_exercise_submissions"),
    path("teacher/submissions/<int:submission_id>/grade/",  GradeSubmissionView.as_view(),            name="grade_submission"),

    # ── Teacher: Handouts ─────────────────────────────────────────────────────
    path("teacher/handouts/",         TeacherHandoutListCreateView.as_view(), name="teacher_handouts"),
    path("teacher/handouts/<int:pk>/",TeacherHandoutDetailView.as_view(),     name="teacher_handout_detail"),

    # ── Teacher: Counseling ───────────────────────────────────────────────────
    path("teacher/counseling-sessions/",                              TeacherCounselingListCreateView.as_view(),     name="teacher_counseling"),
    path("teacher/counseling-sessions/<int:pk>/",                     TeacherCounselingDetailView.as_view(),         name="teacher_counseling_detail"),
    path("teacher/counseling-sessions/<int:session_id>/registrations/",TeacherCounselingRegistrationsView.as_view(), name="teacher_counseling_registrations"),

    # ── Teacher: Exams ────────────────────────────────────────────────────────
    path("teacher/exams/",                      TeacherExamListCreateView.as_view(), name="teacher_exams"),
    path("teacher/exams/<int:pk>/",             TeacherExamDetailView.as_view(),     name="teacher_exam_detail"),
    path("teacher/exams/<int:exam_id>/results/",TeacherExamResultsView.as_view(),   name="teacher_exam_results"),

    # ── Teacher: Q&A ──────────────────────────────────────────────────────────
    path("teacher/questions/",                          TeacherQuestionListView.as_view(),   name="teacher_questions"),
    path("teacher/questions/<int:question_id>/answer/", TeacherAnswerQuestionView.as_view(), name="teacher_answer_question"),
]
