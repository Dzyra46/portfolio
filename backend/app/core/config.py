"""
Environment-based application configuration.

All settings are loaded from environment variables with sensible defaults
for local development. Production deployments must set all required vars.
"""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- Application ---
    APP_NAME: str = "Portfolio Backend"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development | staging | production

    # --- Database ---
    DATABASE_URL: str = "postgresql://portfolio_user:portfolio_pass@localhost:5432/portfolio_db"

    # --- Security ---
    SECRET_KEY: str = "change-me-in-production-use-a-strong-random-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:3000"  # Comma-separated origins

    # --- Server ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # --- Integrations ---
    GITHUB_USERNAME: str = ""
    GITHUB_TOKEN: str | None = None
    FRONTEND_URL: str = "http://127.0.0.1:3000"
    REVALIDATION_SECRET: str = "secret-token"

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        """Block the default secret key in production/staging environments."""
        if v == "change-me-in-production-use-a-strong-random-secret":
            # Check if ENVIRONMENT was already parsed (available in info.data)
            env = (info.data or {}).get("ENVIRONMENT", "development")
            if env in ("production", "staging"):
                raise ValueError(
                    "SECRET_KEY must be changed from the default value "
                    "in production/staging. Set a strong random secret (>=32 chars)."
                )
            import warnings
            warnings.warn(
                "SECRET_KEY is set to the default value. "
                "Set a strong random secret (>=32 chars) for production.",
                UserWarning,
                stacklevel=2,
            )
        return v

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
