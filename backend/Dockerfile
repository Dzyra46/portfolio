# syntax=docker/dockerfile:1
# ---- Build Stage ----
FROM python:3.12-alpine AS builder

WORKDIR /app

# Build deps for psycopg2-binary wheels
RUN --mount=type=cache,target=/etc/apk/cache \
    apk add gcc musl-dev libpq-dev

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --prefix=/install -r requirements.txt

# ---- Production Stage ----
FROM python:3.12-alpine

WORKDIR /app

# libpq for psycopg2 runtime + non-root user in one layer
RUN apk add --no-cache libpq && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup

COPY --from=builder /install /usr/local

COPY alembic.ini .
COPY alembic/ alembic/
COPY app/ app/

# Create uploads directory and give appuser permission
RUN mkdir -p uploads && chown appuser:appgroup uploads

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO /dev/null http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
