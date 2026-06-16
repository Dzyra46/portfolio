# My Personal Portfolio Platform

A full-stack personal portfolio website built to showcase my projects, skills, and experience. It includes the public-facing portfolio itself, as well as a custom, secure administration dashboard so I can manage my content without needing to edit the codebase.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & custom components
- **Animations**: Framer Motion
- **Package Manager**: Bun

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Database ORM**: SQLAlchemy 2.0
- **Data Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt hashing

### Infrastructure & Database
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Migrations**: Alembic
- **CI/CD**: GitHub Actions (Deployed to Azure Web Apps)

---

## ✨ Features

### Public Portfolio
- **Dynamic Content**: All sections (Hero, About, Projects, Experience, Education, Skills) are fetched from the backend database.
- **Dark-Mode Design**: A clean, responsive dark-themed UI built for developers.
- **Analytics Tracking**: Lightweight, custom tracking for page views and interactions (no third-party tracking scripts).
- **Contact Form**: Visitors can send messages that go straight to the admin dashboard.

### Admin Dashboard
- **Protected Access**: JWT-based authentication to secure the `/admin` routes.
- **Content Management**: A simple CRUD interface to manage all portfolio data.
- **GitHub Sync**: Connects to the GitHub API to fetch repositories, allowing me to easily draft and publish my projects.
- **Messages Inbox**: Read and manage contact form submissions.
- **Analytics**: A basic dashboard to view aggregate interaction data.

---

## 📁 Project Structure

This is a monorepo containing both the frontend and backend applications.

```text
portfolio/
├── frontend/                 # Next.js Application
│   ├── src/app/              # App Router (Public & Admin pages)
│   ├── src/components/       # React Components
│   ├── src/lib/api/          # API Client
│   └── package.json          
├── backend/                  # FastAPI Application
│   ├── app/                  # Application code (api, models, schemas, services)
│   ├── alembic/              # Database migrations
│   ├── tests/                # Test suite
│   ├── create_admin.py       # Seed script for initial admin user
│   └── pyproject.toml        
├── docs/                     # Additional project documentation
└── docker-compose.yml        # Docker Compose configuration for local dev
```

---

## 💻 Local Development Setup

To run this project locally, you'll need **Docker Desktop** installed.

### 1. Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd portfolio
```

### 2. Configure Environment Variables
Duplicate the `.env.example` file in the root directory and rename it to `.env`. Fill in the required variables (like your database password and a random JWT secret).

You may also need to configure the specific `.env` files for the frontend and backend if you are running them outside of Docker.

### 3. Start the Docker Services
```bash
docker compose up --build -d
```

### 4. Run Database Migrations & Create Admin User
Initialize the database tables:
```bash
docker compose exec backend alembic upgrade head
```

Run the seed script to generate your first admin account:
```bash
docker compose exec backend python create_admin.py
```

### 5. Access the Application
- **Public Website**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Backend API Docs**: `http://localhost:8000/docs`

---

## ☁️ Deployment

The project is built around Docker containers, making it easy to deploy to any container-hosting service. 

Currently, the frontend and backend each have their own `Dockerfile` optimized for production. A GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`) is used to automatically build the Docker images, push them to a registry, and deploy them to Azure Web Apps on every push to the `main` branch.
