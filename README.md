# Advanced Agentic Portfolio 🚀

A modern, highly performant, and fully dynamic portfolio website built with a cutting-edge tech stack. This repository contains both the public-facing portfolio and a secure administration dashboard for managing content dynamically.

## 🛠️ Technology Stack

### Frontend (User Interface & Admin Dashboard)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Custom UI components
- **Animations**: Framer Motion & CSS Micro-interactions
- **Package Manager**: Bun
- **Features**: Server Components, Client Components, Dynamic Caching, Responsive Design

### Backend (API & Business Logic)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Database ORM**: SQLAlchemy 2.0
- **Data Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt hashing
- **Features**: RESTful architecture, Secure Admin Routes, Automatic Swagger Docs, Dependency Injection

### Infrastructure & Database
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose (Multi-stage builds)
- **Migrations**: Alembic

---

## ✨ Features

### 🌍 Public Portfolio
- **Dynamic Content**: Displays real-time data fetched from the backend (Hero, About, Projects, Experience, Education, Skills, Certificates, Testimonials, Contact).
- **Dark-Mode First Design**: A premium glassmorphism aesthetic tailored for software engineers.
- **Analytics Tracking**: Custom built-in tracking for page views, project clicks, and social media clicks without blocking page rendering.
- **Contact Form**: Secure form for visitors to send messages directly to the admin dashboard.
- **SEO Optimized**: Server-rendered pages with optimal metadata and semantic HTML.

### 🔒 Secure Admin Dashboard
- **Protected Routes**: JWT-based authentication for the `/admin` area.
- **Full Content Management (CRUD)**: Manage all portfolio sections (Profile, Projects, Skills, Experience, Education, Certificates, Testimonials) without touching code.
- **GitHub Repository Sync**: Selectively sync and curate repositories from GitHub to showcase as projects.
- **Messages Inbox**: Read and manage messages sent from the public contact form.
- **Analytics Dashboard**: View aggregate counts of page views and interactions.
- **Instant Cache Invalidation**: The Next.js frontend uses Next Cache Tags to instantly update the live site when the database is updated.

---

## 📁 Project Structure

This is a monorepo containing both frontend and backend codebases.

```text
portfolio-antigravity/
├── frontend/                 # Next.js Application
│   ├── src/app/              # App Router (Public & Admin pages)
│   ├── src/components/       # React Components (public, admin, ui, motion)
│   ├── src/lib/api/          # API Client for fetching from backend
│   └── package.json          # Bun dependencies and scripts
├── backend/                  # FastAPI Application
│   ├── app/                  # Application code (api, core, models, schemas, services, repositories)
│   ├── alembic/              # Database migration scripts
│   ├── tests/                # Backend test suite
│   ├── create_admin.py       # Script to generate initial admin user
│   └── pyproject.toml        # Python dependencies
├── infra/                    # Infrastructure configurations (if any)
├── docs/                     # Additional documentation
├── docker-compose.yml        # Docker Compose for local development
└── docker-compose.prod.yml   # Docker Compose for production overrides
```

---

## 💻 Local Development Setup

To run this project locally on your machine, you need **Docker Desktop** installed.

### 1. Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd portfolio-antigravity
```

### 2. Configure Environment Variables
Duplicate the `.env.example` file in the root directory and rename it to `.env`. Fill in the required secrets (like your database password and JWT secret).
*(Note: The root `.gitignore` will ensure your `.env` file is never pushed to GitHub).*

Do the same for the frontend and backend specific `.env.example` files if they require independent configurations:
- `frontend/.env.example` -> `frontend/.env.local`
- `backend/.env.example` -> `backend/.env`

### 3. Start the Docker Services
```bash
docker compose up --build -d
```

### 4. Run Database Migrations & Create Admin User
```bash
# Run the migrations to build your database tables
docker compose exec backend alembic upgrade head

# Run the seed script to generate your initial admin account
docker compose exec backend python create_admin.py
```

### 5. Access the Application
- **Public Portfolio**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin/login`
- **Backend API Docs**: `http://localhost:8000/docs`

---

## ☁️ Deployment Architecture

This project is built using isolated Docker containers, making it perfect for enterprise cloud deployments (Azure, AWS, DigitalOcean, etc.).

Both the `frontend/` and `backend/` directories contain production-ready `Dockerfile`s optimized for deployment via GitHub Actions or cloud-native container services. The `.github/workflows/build-and-deploy.yml` provides a CI/CD pipeline template.
