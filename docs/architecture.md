# Architecture

## Overview

Personal developer portfolio platform — a full-stack application with an award-winning interactive public website, canonical admin-managed content system, and Docker-based deployment.

## Target Audience

| Audience | What they need |
|----------|---------------|
| HR / Recruiters | Quick understanding of developer capabilities |
| Professional connections | Portfolio showcase and contact |
| Technical peers | Code quality and project depth |
| Potential collaborators | Skill set and availability |

## Primary Goals

1. Present the developer as a strong full-stack engineer.
2. Showcase selected projects with strong storytelling.
3. Demonstrate frontend, backend, database, admin, analytics, and Docker deployment skills.
4. Use PostgreSQL as the canonical source of content.
5. Allow content updates through an admin dashboard.
6. Track useful visitor and interaction analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js App Router, TypeScript, Bun, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy 2.x or SQLModel |
| Migrations | Alembic |
| Auth | Secure password hashing + JWT/cookie-based authentication |
| Deployment | Docker, Docker Compose |
| Reverse Proxy | Nginx (optional) |
| Animations | Framer Motion / Motion, GSAP (only where it adds real value) |

## Monorepo Structure

```
personal-portfolio-platform/
├── frontend/                          # Next.js application
│   ├── src/
│   │   ├── app/                       # App Router pages
│   │   │   ├── page.tsx               # Public homepage
│   │   │   ├── projects/[slug]/       # Project detail pages
│   │   │   ├── admin/                 # Admin dashboard pages
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── profile/
│   │   │   │   ├── projects/
│   │   │   │   ├── skills/
│   │   │   │   ├── experience/
│   │   │   │   ├── certificates/
│   │   │   │   ├── testimonials/
│   │   │   │   ├── messages/
│   │   │   │   └── analytics/
│   │   │   └── api/                   # Next.js API routes (if needed)
│   │   ├── components/
│   │   │   ├── public/                # Public portfolio sections
│   │   │   ├── admin/                 # Dashboard components
│   │   │   ├── ui/                    # Reusable primitives
│   │   │   └── motion/               # Animation wrappers
│   │   ├── lib/
│   │   │   ├── api/                   # API client
│   │   │   ├── analytics/            # Tracking helpers
│   │   │   ├── auth/                  # Auth utilities
│   │   │   ├── seo/                   # SEO helpers
│   │   │   └── utils/                 # General utilities
│   │   ├── styles/                    # Global styles
│   │   └── types/                     # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   ├── bun.lock
│   └── next.config.ts
│
├── backend/                           # FastAPI application
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry point
│   │   ├── core/                      # Configuration, DB, security
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   ├── database.py
│   │   │   └── errors.py
│   │   ├── api/routes/                # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── public.py
│   │   │   ├── profile.py
│   │   │   ├── projects.py
│   │   │   ├── skills.py
│   │   │   ├── experience.py
│   │   │   ├── certificates.py
│   │   │   ├── testimonials.py
│   │   │   ├── contact.py
│   │   │   ├── analytics.py
│   │   │   └── github.py
│   │   ├── models/                    # SQLAlchemy models
│   │   ├── schemas/                   # Pydantic schemas
│   │   ├── services/                  # Business logic
│   │   ├── repositories/             # Database operations
│   │   ├── dependencies/             # FastAPI dependencies
│   │   └── tests/                    # Backend tests
│   ├── alembic/                       # Migration scripts
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── README.md
│
├── infra/                             # Infrastructure configs
│   ├── nginx/
│   │   └── default.conf
│   └── scripts/
│
├── docker-compose.yml                 # Development compose
├── docker-compose.prod.yml            # Production compose
├── .env.example                       # Environment variable docs
├── README.md                          # Project README
└── docs/                              # Documentation
    ├── architecture.md
    ├── api.md
    ├── database.md
    ├── deployment.md
    ├── workflows.md
    └── checklists/
```

## Design Direction

- **Theme**: Dark-mode-first with purple/cyan accent palette.
- **Typography**: Bold, modern (Google Fonts: Inter, Outfit, or similar).
- **Layout**: Cinematic with smooth scroll storytelling.
- **Cards**: Premium glass cards with subtle 3D/depth effects.
- **Interactions**: Microinteractions, hover effects, entrance animations.
- **Style**: Technical dashboard-inspired details.
- **Readability**: Recruiter-friendly — developer role understood within 5 seconds.
- **Responsive**: Mobile, tablet, and desktop layouts.
- **Motion**: Lightweight animations that respect `prefers-reduced-motion`.

## MVP Priority Order

| Priority | Features |
|----------|----------|
| **P1 — Foundation** | Docker Compose, FastAPI health, PostgreSQL, admin auth, public profile/projects/skills APIs, public homepage, admin CRUD (profile, skills, projects) |
| **P2 — Content** | Experience, education, certificates, testimonials, contact form, contact message inbox |
| **P3 — Intelligence** | Analytics tracking, admin analytics dashboard, GitHub repository sync, project detail pages |
| **P4 — Polish** | Advanced motion, SEO polish, Open Graph image, sitemap, Nginx production config |
