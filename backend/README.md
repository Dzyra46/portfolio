# Portfolio Backend

FastAPI backend for the personal portfolio platform.

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy 2.x
- **Migrations**: Alembic
- **Auth**: bcrypt + JWT (PyJWT)
- **Validation**: Pydantic v2

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── core/
│   │   ├── config.py        # Environment-based configuration
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   ├── security.py      # Password hashing + JWT utilities
│   │   └── errors.py        # Error handling + exception handlers
│   ├── api/routes/           # Route handlers (thin controllers)
│   ├── models/               # SQLAlchemy database models
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Business logic layer
│   ├── repositories/         # Database access layer
│   ├── dependencies/         # FastAPI dependencies (e.g. DB session)
│   └── tests/                # Backend tests
├── alembic/                  # Migration scripts
├── alembic.ini               # Alembic configuration
├── pyproject.toml            # Python project configuration
├── requirements.txt          # Production dependencies
└── Dockerfile                # Multi-stage Alpine Docker build
```

## Prerequisites

- Python 3.12+
- PostgreSQL 16 (or use Docker)
- pip or uv

## Local Development Setup

### 1. Create virtual environment

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -e ".[dev]"
```

### 3. Configure environment

```bash
# Copy and edit environment variables
cp ../.env.example .env
# Edit .env with your local database credentials
```

### 4. Start PostgreSQL

Using Docker (recommended):
```bash
docker compose -f ../docker-compose.yml up db -d
```

Or use a local PostgreSQL installation.

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Start the development server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.

## Docker

The backend uses a multi-stage Alpine-based Dockerfile with BuildKit cache mounts for fast rebuilds during development.

### Build and run with Docker Compose

```bash
# From the project root (BuildKit is enabled by default in modern Docker)
docker compose up --build
```

### Build backend image only

```bash
cd backend
docker build -t portfolio-backend .
```

> **Note:** BuildKit cache mounts (`--mount=type=cache`) persist pip and apk downloads across builds, so only new/changed packages are fetched on rebuild.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Application health check |
| `GET` | `/health/db` | Database connectivity check |
| `POST` | `/api/v1/auth/login` | Admin login (placeholder) |
| `GET` | `/api/v1/public/profile` | Public profile (placeholder) |

## Database Migrations

```bash
# Generate a new migration
alembic revision --autogenerate -m "description"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View current migration status
alembic current

# View migration history
alembic history
```

## Architecture

The backend follows a layered architecture:

1. **Routes** — HTTP handlers, request validation, response serialization
2. **Services** — Business logic, orchestration
3. **Repositories** — Database queries via SQLAlchemy
4. **Models** — Database table definitions
5. **Schemas** — Pydantic request/response shapes

Route handlers stay thin. Business logic belongs in services. Database access belongs in repositories.
