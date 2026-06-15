# Advanced Agentic Portfolio 🚀

A modern, highly performant, and fully dynamic portfolio website built with a cutting-edge tech stack. This repository contains both the public-facing portfolio and a secure administration dashboard for managing content dynamically.

## 🛠️ Technology Stack

### Frontend (User Interface & Admin Dashboard)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Custom CSS
- **Animations**: Framer Motion & CSS Micro-interactions
- **Icons**: Lucide React
- **Features**: Server Components, Server Actions, Dynamic Caching, Responsive Design

### Backend (API & Business Logic)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database ORM**: SQLAlchemy 2.0
- **Data Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with Argon2/Bcrypt hashing
- **Features**: RESTful architecture, Secure Admin Routes, Automatic Swagger Docs

### Infrastructure & Database
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Migrations**: Alembic

---

## ✨ Features
1. **Dynamic Public Portfolio**: Features an interactive Hero, About, Projects, Experience, Education, Skills, Testimonials, Certificates, and Contact sections.
2. **Secure Admin Dashboard**: A protected `/admin` route that allows the owner to perform full CRUD (Create, Read, Update, Delete) operations on their portfolio data without touching code.
3. **Instant Cache Invalidation**: The Next.js frontend uses Next Cache Tags (`revalidateTag`) to instantly update the live site the moment the database is updated.
4. **Analytics Tracking**: Custom built-in tracking for page views, project clicks, and social media clicks.
5. **Dark-Mode First Design**: A premium glassmorphism aesthetic tailored for software engineers.

---

## 💻 Local Development Setup

To run this project locally on your machine, you need **Docker Desktop** installed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Configure Environment Variables**
   Duplicate the `.env.example` file in the root directory and rename it to `.env`. Fill in the required secrets (like your database password and JWT secret).
   *(Note: The root `.gitignore` will ensure your `.env` file is never pushed to GitHub).*

3. **Start the Docker Services**
   ```bash
   docker compose up --build -d
   ```

4. **Run Database Migrations & Create Admin User**
   ```bash
   # Run the migrations to build your database tables
   docker compose exec backend alembic upgrade head
   
   # Run the seed script to generate your initial admin account
   docker compose exec backend python create_admin.py
   ```

5. **Access the Application**
   - Public Portfolio: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin/login`
   - Backend API Docs: `http://localhost:8000/docs`

---

## ☁️ Deployment Architecture (Azure)

This project is built using isolated Docker containers, making it perfect for enterprise cloud deployments. 

The recommended deployment strategy for Microsoft Azure is:
- **Frontend**: Azure Web App for Containers (Linux)
- **Backend**: Azure Web App for Containers (Linux)
- **Database**: Azure Database for PostgreSQL Flexible Server

Both the `frontend/` and `backend/` directories contain production-ready `Dockerfile`s optimized for deployment via GitHub Actions or Azure Container Registry.
