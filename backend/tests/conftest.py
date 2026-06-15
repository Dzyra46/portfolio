import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db, Base
from app.dependencies.auth import get_current_admin
from app.models.admin_user import AdminUser

# Use in-memory SQLite for tests to run them quickly and isolated
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session() -> Generator:
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop tables
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session) -> Generator:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    def override_get_current_admin():
        return AdminUser(id="123e4567-e89b-12d3-a456-426614174000", username="testadmin", email="test@test.com", is_active=True)

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()
