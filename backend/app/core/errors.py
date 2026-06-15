"""
Consistent error handling and error response shapes.

Defines custom exception classes and FastAPI exception handlers
that return a uniform error JSON shape across all endpoints.
"""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


# --- Custom Exceptions ---


class AppException(Exception):
    """Base application exception with status code and detail message."""

    def __init__(
        self,
        detail: str = "An error occurred",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFoundException(AppException):
    """Resource not found."""

    def __init__(self, detail: str = "Resource not found"):
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class UnauthorizedException(AppException):
    """Authentication required or failed."""

    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(AppException):
    """Insufficient permissions."""

    def __init__(self, detail: str = "Forbidden"):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class BadRequestException(AppException):
    """Invalid request."""

    def __init__(self, detail: str = "Bad request"):
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)


class ConflictException(AppException):
    """Resource conflict (e.g. duplicate)."""

    def __init__(self, detail: str = "Conflict"):
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


# --- Error Response Shape ---


def _error_response(status_code: int, detail: str) -> JSONResponse:
    """Build a consistent error JSON response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "detail": detail,
            "status_code": status_code,
        },
    )


# --- Exception Handlers ---


def register_exception_handlers(app: FastAPI) -> None:
    """Register all custom exception handlers on the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
        return _error_response(exc.status_code, exc.detail)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        # Return first validation error in a user-friendly format.
        # Do not expose raw pydantic internals in production.
        errors = exc.errors()
        if errors:
            first = errors[0]
            loc = " → ".join(str(part) for part in first.get("loc", []))
            msg = first.get("msg", "Validation error")
            detail = f"{loc}: {msg}" if loc else msg
        else:
            detail = "Validation error"
        return _error_response(status.HTTP_422_UNPROCESSABLE_ENTITY, detail)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        _request: Request, exc: Exception  # noqa: ARG001
    ) -> JSONResponse:
        # Never expose stack traces in production.
        # Log the real error server-side (logging setup is a future concern).
        return _error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Internal server error",
        )
