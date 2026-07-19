# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A learning management system coordinating interaction between students and teachers. Monorepo with two apps:

- `student-be/` — Django + Django REST Framework backend
- `student-fe/` — Next.js (App Router) frontend

**Read before making changes:**
- `docs/project_overview.md` — project scope and workflow conventions
- `docs/models_diagram.md` — mermaid class diagram of backend models (update this whenever models change)
- `docs/design_system.md` — UI design system ("Scholarly Sanctuary" / "Digital Atelier") — RTL Persian, no-line/no-divider rules, specific color tokens; consult before any frontend UI work

## Workflow convention

Plan with a strong model, get the plan approved by the user, then execute the approved plan with a cheaper/faster model.

## Backend (`student-be`)

Django 5.2 + DRF, managed with `uv`. Source root is `student-be/src` (manage.py lives there).

```bash
cd student-be/src
uv run python manage.py runserver
uv run python manage.py migrate
uv run python manage.py makemigrations
uv run python manage.py test                    # all tests
uv run python manage.py test classes.tests.test_registration_exercises   # single test module
uv run python manage.py test classes.tests.test_registration_exercises.RegistrationExerciseListViewTests.test_x  # single test
```

Or via Docker: `docker compose up` from `student-be/` (uses `compose.yaml`).

Config is env-driven via `.env` (see `.env.sample`): `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, `ALLOWED_ORIGINS`.

### Architecture

- Django apps: `accounts` (custom `User` model, JWT auth via `djangorestframework-simplejwt`) and `classes` (all domain/business models and APIs). `AUTH_USER_MODEL = "accounts.User"`.
- Auth: JWT only — `POST /accounts/token/` and `/accounts/token/refresh/`. `DEFAULT_PERMISSION_CLASSES` is `IsAuthenticated` globally; views must opt into anything more permissive.
- Domain model (see `docs/models_diagram.md`): `Student` and `Teacher` both wrap `accounts.User` via one-to-one profile relations (`user.student_profile`, `user.teacher_profile`). `Lesson` → `Klass` (taught by a `Teacher`) → `KlassSchedule` / `KlassRegistration` (enrolls a `Student`). `Exercise` belongs to a `Klass`, has `ExerciseFile`, `ExerciseSubmission` (per student, gradable), and `ExerciseComment`.
- All models inherit `BaseModel` (adds `created_at`).
- Role-based permissions live in `classes/permissions.py`: `IsTeacher`, `IsStudent`, `IsTeacherOrReadOnly` — checked via `hasattr(request.user, "teacher_profile"/"student_profile")`, not a role field.
- API docs generated via `drf-spectacular` (`DEFAULT_SCHEMA_CLASS`).
- Conventions (from `docs/project_overview.md`):
  - Endpoints are REST; URLs use plural nouns and `-` (not `_`).
  - Keep Django apps small and focused — split into a new app when a domain area grows, rather than growing `classes` indefinitely.
  - TDD: tests live under `<app>/tests/` (see `classes/tests/`); ask before changing an existing test's expected behavior.
  - Any model change must be reflected in `docs/models_diagram.md`.
  - Locale: `fa-IR` is the default language; apps have `locale/fa/` translation catalogs — verbose names use `gettext_lazy`.

## Frontend (`student-fe`)

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, managed with `npm`.

```bash
cd student-fe
npm run dev
npm run build
npm run lint
```

`NEXT_PUBLIC_API_URL` (see `.env.development`) points to the backend.

### Architecture

- `app/` — App Router pages. Dashboard is organized as sub-apps/modules under `app/Dashboard/<Module>/` (e.g. `Fanoos`, `Kada`, `Mehraneh`, `Safineh`, `Sanjeh`, `Poshtibani`, `Yas`, `Borna`, `Profile`, `Settings`, `Calendar`) — each a self-contained feature area.
- `components/` — shared React components.
- `libs/apis/` — axios wrappers per backend domain (`accounts.ts`, `classes.ts`, `students.ts`) built on the shared `client.ts` axios instance.
  - `libs/apis/client.ts` handles JWT auth: attaches `access_token` from `localStorage`, and on a 401 transparently refreshes via `refresh_token` (single in-flight refresh, deduped with `refreshPromise`), retrying the original request; redirects to `/login` and clears tokens if refresh fails.
- `libs/hooks/apis/` — thin SWR-style hooks wrapping the `libs/apis/*` functions for use in components (data fetching uses `swr`).
- `libs/types/` — TypeScript types mirroring backend API shapes.
- UI must follow `docs/design_system.md` — RTL-first (right-aligned, right = primary CTA position), no `1px solid` dividers/borders (use tonal surface shifts instead), no pure black text, Vazir font only, `xl` (1.5rem) corner radius on containers.

## CI/CD

- `.github/workflows/*` builds and pushes the backend Docker image to Docker Hub (`hmodaresi/aminedu`) on push to `main`.
- Frontend is built and synced as a static export (`out/`) to an S3 bucket (`student-fe`) on push to `main`.
