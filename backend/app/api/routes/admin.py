"""
Admin routes — protected CRUD operations for portfolio content.
"""

import os
import shutil
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.admin_user import AdminUser
from app.models.profile import Profile
from app.models.projects import Project
from app.models.skills import Skill
from app.models.experiences import Experience
from app.models.educations import Education
from app.models.certificates import Certificate
from app.models.testimonials import Testimonial
from app.models.contact_messages import ContactMessage
from app.models.analytics_events import AnalyticsEvent

from app.schemas.portfolio import (
    ProfileResponse, ProfileUpdate,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    SkillCreate, SkillUpdate, SkillResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    EducationCreate, EducationUpdate, EducationResponse,
    CertificateCreate, CertificateUpdate, CertificateResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    ContactMessageResponse, ContactMessageUpdate,
    AnalyticsEventResponse, PaginatedResponse
)

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin)
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    
    ext = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/{UPLOAD_DIR}/{new_filename}"}

# --- Profile ---
@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    if not profile:
        # Create a default profile if none exists
        profile = Profile(full_name="Admin", title="Developer")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(full_name="Admin", title="Developer")
        db.add(profile)
        db.flush()
        
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
        
    db.commit()
    db.refresh(profile)
    return profile


# --- Projects ---
@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Project).filter(Project.is_deleted == False).order_by(Project.sort_order).all()

@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_projects(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_projects(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id, Project.is_deleted == False).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    for field, value in project_in.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_projects(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id, Project.is_deleted == False).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.is_deleted = True
    db.commit()
    return None

# --- Skills ---
@router.get("/skills", response_model=List[SkillResponse])
def list_skills(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Skill).filter(Skill.is_deleted == False).order_by(Skill.sort_order).all()

@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skills(
    skill_in: SkillCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/skills/{skill_id}", response_model=SkillResponse)
def update_skills(
    skill_id: UUID,
    skill_in: SkillUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    skill = db.query(Skill).filter(Skill.id == skill_id, Skill.is_deleted == False).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    for field, value in skill_in.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
        
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skills(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    skill = db.query(Skill).filter(Skill.id == skill_id, Skill.is_deleted == False).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    skill.is_deleted = True
    db.commit()
    return None

# --- Experiences ---
@router.get("/experiences", response_model=List[ExperienceResponse])
def list_experiences(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Experience).filter(Experience.is_deleted == False).order_by(Experience.sort_order).all()

@router.post("/experiences", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experiences(
    experience_in: ExperienceCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    experience = Experience(**experience_in.model_dump())
    db.add(experience)
    db.commit()
    db.refresh(experience)
    return experience

@router.put("/experiences/{experience_id}", response_model=ExperienceResponse)
def update_experiences(
    experience_id: UUID,
    experience_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    experience = db.query(Experience).filter(Experience.id == experience_id, Experience.is_deleted == False).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
        
    for field, value in experience_in.model_dump(exclude_unset=True).items():
        setattr(experience, field, value)
        
    db.commit()
    db.refresh(experience)
    return experience

@router.delete("/experiences/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experiences(
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    experience = db.query(Experience).filter(Experience.id == experience_id, Experience.is_deleted == False).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
        
    experience.is_deleted = True
    db.commit()
    return None

# --- Educations ---
@router.get("/educations", response_model=List[EducationResponse])
def list_educations(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Education).filter(Education.is_deleted == False).order_by(Education.sort_order).all()

@router.post("/educations", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_educations(
    education_in: EducationCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    education = Education(**education_in.model_dump())
    db.add(education)
    db.commit()
    db.refresh(education)
    return education

@router.put("/educations/{education_id}", response_model=EducationResponse)
def update_educations(
    education_id: UUID,
    education_in: EducationUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    education = db.query(Education).filter(Education.id == education_id, Education.is_deleted == False).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
        
    for field, value in education_in.model_dump(exclude_unset=True).items():
        setattr(education, field, value)
        
    db.commit()
    db.refresh(education)
    return education

@router.delete("/educations/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_educations(
    education_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    education = db.query(Education).filter(Education.id == education_id, Education.is_deleted == False).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
        
    education.is_deleted = True
    db.commit()
    return None

# --- Certificates ---
@router.get("/certificates", response_model=List[CertificateResponse])
def list_certificates(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Certificate).filter(Certificate.is_deleted == False).order_by(Certificate.sort_order).all()

@router.post("/certificates", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificates(
    certificate_in: CertificateCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    certificate = Certificate(**certificate_in.model_dump())
    db.add(certificate)
    db.commit()
    db.refresh(certificate)
    return certificate

@router.put("/certificates/{certificate_id}", response_model=CertificateResponse)
def update_certificates(
    certificate_id: UUID,
    certificate_in: CertificateUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id, Certificate.is_deleted == False).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    for field, value in certificate_in.model_dump(exclude_unset=True).items():
        setattr(certificate, field, value)
        
    db.commit()
    db.refresh(certificate)
    return certificate

@router.delete("/certificates/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificates(
    certificate_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id, Certificate.is_deleted == False).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    certificate.is_deleted = True
    db.commit()
    return None

# --- Testimonials ---
@router.get("/testimonials", response_model=List[TestimonialResponse])
def list_testimonials(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Testimonial).filter(Testimonial.is_deleted == False).order_by(Testimonial.sort_order).all()

@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def create_testimonials(
    testimonial_in: TestimonialCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    testimonial = Testimonial(**testimonial_in.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonials(
    testimonial_id: UUID,
    testimonial_in: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id, Testimonial.is_deleted == False).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    for field, value in testimonial_in.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
        
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonials(
    testimonial_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id, Testimonial.is_deleted == False).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    testimonial.is_deleted = True
    db.commit()
    return None

# --- Contact Messages ---
@router.get("/messages", response_model=PaginatedResponse[ContactMessageResponse])
def list_messages(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    query = db.query(ContactMessage)
    if status:
        query = query.filter(ContactMessage.status == status)
    total = query.count()
    items = query.order_by(desc(ContactMessage.created_at)).offset(offset).limit(limit).all()
    return {"items": items, "total": total, "limit": limit, "offset": offset}

@router.put("/messages/{message_id}", response_model=ContactMessageResponse)
def update_message(
    message_id: UUID,
    message_in: ContactMessageUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
        
    message.status = message_in.status
    db.commit()
    db.refresh(message)
    return message

# --- Analytics Events ---
@router.get("/analytics", response_model=PaginatedResponse[AnalyticsEventResponse])
def list_analytics(
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    total = db.query(AnalyticsEvent).count()
    items = db.query(AnalyticsEvent).order_by(desc(AnalyticsEvent.created_at)).offset(offset).limit(limit).all()
    return {"items": items, "total": total, "limit": limit, "offset": offset}

@router.get("/analytics/summary")
def analytics_summary(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    """Aggregate analytics by event type."""
    from sqlalchemy import func
    results = db.query(
        AnalyticsEvent.event_type,
        func.count(AnalyticsEvent.id).label("count")
    ).group_by(AnalyticsEvent.event_type).all()
    
    summary = {r.event_type: r.count for r in results}
    total = sum(summary.values())
    return {"summary": summary, "total": total}


# --- Social Links ---
from app.models.social_links import SocialLink
from app.schemas.portfolio import SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse

@router.get("/social-links", response_model=List[SocialLinkResponse])
def list_social_links(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    if not profile:
        return []
    return db.query(SocialLink).filter(SocialLink.profile_id == profile.id).order_by(SocialLink.sort_order).all()

@router.post("/social-links", response_model=SocialLinkResponse, status_code=status.HTTP_201_CREATED)
def create_social_link(
    link_in: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Create a profile first")
    link = SocialLink(profile_id=profile.id, **link_in.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

@router.put("/social-links/{link_id}", response_model=SocialLinkResponse)
def update_social_link(
    link_id: UUID,
    link_in: SocialLinkUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in link_in.model_dump(exclude_unset=True).items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link

@router.delete("/social-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(
    link_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(link)
    db.commit()
    return None

