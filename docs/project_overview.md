## Overview

This project is a learning management system. Coordinating interaction between students and teachers.

## Student Backend
Student backend code resides in `student-be`. It is written in django. We use django-restframework.

- All endpoint are in REST and respect REST principles.
- Don't make a django app too big. When it's rational create a separate django app.
- Implement TDD. If you want to change a test ask for permission.
- Use uv to run python commands or install dependencies
- If you change a model, update diagrams in `docs/models_diagram.md`

## Student Frontend

Student frontend code resides in `student-fe`. It is written in Next.js.

- We use npm to manage packages
- Use swr to call server apis if required
