"""
Portfolio service containing business logic for public and admin operations.
"""

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import asc

from app.models.profile import Profile
from app.models.skills import Skill
from app.models.projects import Project
from app.models.experiences import Experience
from app.models.educations import Education
from app.models.certificates import Certificate
from app.models.testimonials import Testimonial


class PortfolioService:
    def __init__(self, db: Session):
        self.db = db

    def get_profile(self) -> Profile | None:
        """Fetch the developer profile."""
        # Typically there's only one profile
        return self.db.query(Profile).first()

    def get_published_skills(self) -> List[Skill]:
        """Fetch all published skills, ordered by sort_order."""
        return self.db.query(Skill).filter(
            Skill.is_published == True,
            Skill.is_deleted == False
        ).order_by(asc(Skill.sort_order)).all()

    def get_published_projects(self, featured_only: bool = False) -> List[Project]:
        """Fetch published projects, optionally filtering by featured."""
        query = self.db.query(Project).filter(Project.is_published == True, Project.is_deleted == False)
        if featured_only:
            query = query.filter(Project.featured == True)
        return query.order_by(asc(Project.sort_order)).all()

    def get_project_by_slug(self, slug: str) -> Project | None:
        return self.db.query(Project).filter(
            Project.slug == slug, 
            Project.is_published == True, 
            Project.is_deleted == False
        ).first()

    def get_published_experiences(self) -> List[Experience]:
        """Fetch published work experiences."""
        return self.db.query(Experience).filter(
            Experience.is_published == True,
            Experience.is_deleted == False
        ).order_by(asc(Experience.sort_order)).all()

    def get_published_educations(self) -> List[Education]:
        """Fetch published education entries."""
        return self.db.query(Education).filter(
            Education.is_published == True,
            Education.is_deleted == False
        ).order_by(asc(Education.sort_order)).all()

    def get_published_certificates(self) -> List[Certificate]:
        """Fetch published certificates."""
        return self.db.query(Certificate).filter(
            Certificate.is_published == True,
            Certificate.is_deleted == False
        ).order_by(asc(Certificate.sort_order)).all()

    def get_published_testimonials(self, featured_only: bool = False) -> List[Testimonial]:
        """Fetch published testimonials."""
        query = self.db.query(Testimonial).filter(Testimonial.is_published == True, Testimonial.is_deleted == False)
        if featured_only:
            query = query.filter(Testimonial.featured == True)
        return query.order_by(asc(Testimonial.sort_order)).all()
