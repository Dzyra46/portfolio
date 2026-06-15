"""
Public API routes — placeholder structure.
Public routes — read-only canonical content APIs.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.portfolio_service import PortfolioService
from app.schemas.portfolio import (
    ProfileResponse, 
    ProjectResponse, 
    SkillResponse, 
    ExperienceResponse,
    EducationResponse,
    CertificateResponse,
    TestimonialResponse,
    ContactMessageCreate,
    ContactMessageResponse,
    AnalyticsEventCreate,
    AnalyticsEventResponse
)

router = APIRouter()

def get_portfolio_service(db: Session = Depends(get_db)) -> PortfolioService:
    return PortfolioService(db)

@router.get("/profile", response_model=ProfileResponse | dict)
def get_profile(service: PortfolioService = Depends(get_portfolio_service)) -> dict:
    profile = service.get_profile()
    if not profile:
        return {}  # Empty response if no profile exists yet
    return profile

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(featured: bool = False, service: PortfolioService = Depends(get_portfolio_service)) -> List[ProjectResponse]:
    return service.get_published_projects(featured_only=featured)

@router.get("/projects/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str, service: PortfolioService = Depends(get_portfolio_service)) -> ProjectResponse:
    from fastapi import HTTPException
    project = service.get_project_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(service: PortfolioService = Depends(get_portfolio_service)) -> List[SkillResponse]:
    return service.get_published_skills()

@router.get("/experience", response_model=List[ExperienceResponse])
def get_experience(service: PortfolioService = Depends(get_portfolio_service)) -> List[ExperienceResponse]:
    return service.get_published_experiences()

@router.get("/education", response_model=List[EducationResponse])
def get_education(service: PortfolioService = Depends(get_portfolio_service)) -> List[EducationResponse]:
    return service.get_published_educations()

@router.get("/certificates", response_model=List[CertificateResponse])
def get_certificates(service: PortfolioService = Depends(get_portfolio_service)) -> List[CertificateResponse]:
    return service.get_published_certificates()

@router.get("/testimonials", response_model=List[TestimonialResponse])
def get_testimonials(featured: bool = False, service: PortfolioService = Depends(get_portfolio_service)) -> List[TestimonialResponse]:
    return service.get_published_testimonials(featured_only=featured)

@router.post("/messages", response_model=ContactMessageResponse, status_code=201)
def submit_contact_message(
    message_in: ContactMessageCreate, 
    db: Session = Depends(get_db)
):
    from app.models.contact_messages import ContactMessage
    message = ContactMessage(**message_in.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

@router.post("/analytics", response_model=AnalyticsEventResponse, status_code=201)
def submit_analytics_event(
    event_in: AnalyticsEventCreate, 
    db: Session = Depends(get_db)
):
    from app.models.analytics_events import AnalyticsEvent
    event = AnalyticsEvent(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/analytics/active-viewers", response_model=dict)
def get_active_viewers(
    page_path: str,
    db: Session = Depends(get_db)
):
    from app.models.analytics_events import AnalyticsEvent
    from datetime import datetime, timedelta, timezone
    from sqlalchemy import func
    
    five_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=5)
    
    count = db.query(func.count(func.distinct(AnalyticsEvent.user_agent)))\
        .filter(AnalyticsEvent.page_path == page_path)\
        .filter(AnalyticsEvent.event_type == "page_view")\
        .filter(AnalyticsEvent.created_at >= five_mins_ago)\
        .scalar()
        
    return {"active_viewers": count or 1}
