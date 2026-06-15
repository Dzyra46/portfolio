import httpx
from datetime import datetime, timezone
import uuid
import re
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import get_settings
from app.core.errors import (
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    AppException,
)
from app.models.project_github_metadata import ProjectGithubMetadata
from app.models.projects import Project

settings = get_settings()

class GithubService:
    def __init__(self, session: Session):
        self.session = session
        self.base_url = "https://api.github.com"
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    def sync_user_repositories(self):
        username = settings.GITHUB_USERNAME
        if not username:
            raise BadRequestException(detail="GITHUB_USERNAME not configured")

        repos = []
        page = 1
        per_page = 100
        
        try:
            with httpx.Client(headers=self.headers, timeout=10.0) as client:
                while True:
                    response = client.get(
                        f"{self.base_url}/users/{username}/repos",
                        params={"per_page": per_page, "page": page, "type": "owner", "sort": "updated"}
                    )
                    response.raise_for_status()
                    
                    data = response.json()
                    if not data:
                        break
                        
                    repos.extend(data)
                    page += 1
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise UnauthorizedException(detail="Invalid GitHub Token")
            elif e.response.status_code == 403:
                raise AppException(detail="GitHub API Rate Limit Exceeded", status_code=429)
            elif e.response.status_code == 404:
                raise NotFoundException(detail="GitHub User Not Found")
            else:
                raise AppException(detail=f"GitHub API Error: {e}", status_code=502)
        except httpx.RequestError as e:
            raise AppException(detail=f"GitHub API Connection Error: {e}", status_code=503)

        # Upsert repos into DB
        now = datetime.now(timezone.utc)
        fetched_github_ids = set()
        
        for repo in repos:
            github_id = repo.get("id")
            fetched_github_ids.add(github_id)
            stmt = select(ProjectGithubMetadata).where(ProjectGithubMetadata.github_id == github_id)
            db_repo = self.session.execute(stmt).scalar_one_or_none()
            
            pushed_at_str = repo.get("pushed_at")
            pushed_at = datetime.fromisoformat(pushed_at_str.replace('Z', '+00:00')) if pushed_at_str else None
            
            if not db_repo:
                db_repo = ProjectGithubMetadata(
                    github_id=github_id,
                    name=repo.get("name", ""),
                    full_name=repo.get("full_name", ""),
                    description=repo.get("description"),
                    url=repo.get("html_url", ""),
                    homepage=repo.get("homepage"),
                    language=repo.get("language"),
                    stars=repo.get("stargazers_count", 0),
                    forks=repo.get("forks_count", 0),
                    topics=repo.get("topics", []),
                    last_pushed_at=pushed_at,
                    synced_at=now
                )
                self.session.add(db_repo)
            else:
                db_repo.name = repo.get("name", "")
                db_repo.full_name = repo.get("full_name", "")
                db_repo.description = repo.get("description")
                db_repo.url = repo.get("html_url", "")
                db_repo.homepage = repo.get("homepage")
                db_repo.language = repo.get("language")
                db_repo.stars = repo.get("stargazers_count", 0)
                db_repo.forks = repo.get("forks_count", 0)
                db_repo.topics = repo.get("topics", [])
                db_repo.last_pushed_at = pushed_at
                db_repo.synced_at = now

        # Handle deleted/archived repositories (Soft Deletes)
        all_metadata = self.session.execute(select(ProjectGithubMetadata)).scalars().all()
        for meta in all_metadata:
            if meta.github_id not in fetched_github_ids and meta.is_active:
                meta.is_active = False
                # Cascade to drafted project
                if meta.project_id:
                    linked_project = self.session.get(Project, meta.project_id)
                    if linked_project and linked_project.is_published:
                        linked_project.is_published = False

        self.session.commit()
        
        # Fire Webhook to Next.js
        try:
            if settings.FRONTEND_URL and settings.REVALIDATION_SECRET:
                with httpx.Client(timeout=5.0) as webhook_client:
                    webhook_client.post(
                        f"{settings.FRONTEND_URL}/api/revalidate?secret={settings.REVALIDATION_SECRET}",
                        json={"path": "/admin/github"}
                    )
        except Exception as e:
            import logging
            logging.error(f"Webhook to Next.js failed: {e}")

        return {"status": "success", "count": len(repos)}

    def import_repository_to_project(self, github_id: int):
        stmt = select(ProjectGithubMetadata).where(ProjectGithubMetadata.github_id == github_id)
        repo = self.session.execute(stmt).scalar_one_or_none()
        
        if not repo:
            raise NotFoundException(detail="Repository not found in synced metadata")

        project = None
        if repo.project_id:
            project = self.session.get(Project, repo.project_id)
            
        if not project:
            stmt_proj = select(Project).where(Project.github_url == repo.url)
            project = self.session.execute(stmt_proj).scalar_one_or_none()

        def make_slug(name):
            # Check slug uniqueness implicitly, but basic sanitization first
            base_slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            if not base_slug:
                base_slug = "project"
            return base_slug

        if not project:
            # Create a full new project
            # ensure unique slug
            base_slug = make_slug(repo.name)
            slug = base_slug
            counter = 1
            while self.session.execute(select(Project).where(Project.slug == slug)).scalar_one_or_none():
                slug = f"{base_slug}-{counter}"
                counter += 1

            project = Project(
                title=repo.name.replace("-", " ").replace("_", " ").title(),
                slug=slug,
                summary=repo.description or "No description provided.",
                github_url=repo.url,
                live_url=repo.homepage,
                is_published=False,
                featured=False,
            )
            self.session.add(project)
            self.session.flush() # to get the UUID
            
            repo.project_id = project.id
            self.session.commit()
            return {"status": "Created", "project_id": str(project.id)}
        else:
            if not project.github_url:
                project.github_url = repo.url
            if not project.live_url and repo.homepage:
                project.live_url = repo.homepage
            
            if not repo.project_id:
                repo.project_id = project.id
                
            self.session.commit()
            return {"status": "Safely Updated", "project_id": str(project.id)}

