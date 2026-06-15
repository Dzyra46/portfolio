from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.admin_user import AdminUser
from app.services.github_service import GithubService
from app.schemas.portfolio import ProjectGithubMetadataResponse
from app.models.project_github_metadata import ProjectGithubMetadata
from sqlalchemy import select

router = APIRouter()

@router.post("/sync", status_code=200)
def sync_github_repositories(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Triggers a synchronous sync of GitHub repositories."""
    try:
        service = GithubService(db)
        result = service.sync_user_repositories()
        return {"status": "success", "message": f"Successfully synced {result.get('count', 0)} repositories.", "count": result.get("count", 0)}
    except Exception as e:
        import logging
        logging.error(f"GitHub sync failed: {e}")
        raise e

@router.get("/repositories", response_model=List[ProjectGithubMetadataResponse])
def list_synced_repositories(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Lists all synced repositories."""
    stmt = select(ProjectGithubMetadata).order_by(ProjectGithubMetadata.last_pushed_at.desc())
    repos = db.execute(stmt).scalars().all()
    return repos

@router.post("/import/{github_id}")
def import_github_repository(
    github_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Imports or updates a GitHub repository into the canonical projects table."""
    service = GithubService(db)
    result = service.import_repository_to_project(github_id)
    return result
