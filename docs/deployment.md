# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed (BuildKit enabled — default in Docker 23+)
- Git
- (Optional for local dev without Docker) Bun, Python 3.12+, PostgreSQL

## Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure all required variables (see `.env.example` for documentation).

## Local Development with Docker

### Start all services
```bash
docker compose up --build
```

### Start in detached mode
```bash
docker compose up -d --build
```

### View logs
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Stop services
```bash
docker compose down
```

### Reset database (destroys data)
```bash
docker compose down -v
docker compose up --build
```

## Local Development without Docker

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -e .
alembic upgrade head
python -m app.seed  # optional: seed data
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
bun install
bun run dev
```

### PostgreSQL
Ensure PostgreSQL is running locally and update `DATABASE_URL` in `.env`.

## Production Deployment

### Build production images
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Start production
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Run migrations in production
```bash
docker compose exec backend alembic upgrade head
```

### Health checks
```bash
# Backend
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000
```

## Service URLs

| Service | Development URL |
|---------|----------------|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| API Docs (Swagger) | `http://localhost:8000/docs` |
| PostgreSQL | `localhost:5432` |

## Environment Variables Reference

See [`.env.example`](file:///d:/NOZYRA/My_Documents/Portofolio/portfolio%20antigravity/.env.example) for the complete list with descriptions.

### Critical Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (min 32 chars) |
| `ADMIN_USERNAME` | Yes | Initial admin username |
| `ADMIN_PASSWORD` | Yes | Initial admin password (will be hashed) |
| `GITHUB_USERNAME` | No | GitHub username for repo sync |
| `GITHUB_TOKEN` | No | GitHub personal access token (backend only) |
| `CORS_ORIGINS` | Yes | Allowed CORS origins (comma-separated) |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL for frontend |

## Troubleshooting

### Backend can't connect to database
- Ensure PostgreSQL service is running: `docker compose ps`
- Check `DATABASE_URL` in `.env`
- Check PostgreSQL health: `docker compose exec db pg_isready`

### Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` points to the correct backend URL
- Check CORS configuration includes the frontend URL
- Verify backend is running: `curl http://localhost:8000/health`

### Migration errors
- Check migration history: `docker compose exec backend alembic history`
- Check current revision: `docker compose exec backend alembic current`
- Try fresh migration: `docker compose down -v && docker compose up --build`
