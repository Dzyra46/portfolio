"""
Portfolio-related Pydantic schemas.
"""

from datetime import date, datetime
from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, EmailStr, HttpUrl, ConfigDict
from typing import TypeVar, Generic

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    limit: int
    offset: int


# --- Base Profile ---
class SocialLinkResponse(BaseModel):
    id: UUID
    platform: str
    url: str
    icon: Optional[str]
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class SocialLinkCreate(BaseModel):
    platform: str
    url: str
    icon: Optional[str] = None
    sort_order: int = 0


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None


class ProfileResponse(BaseModel):
    id: UUID
    full_name: str
    title: str
    bio: Optional[str]
    avatar_url: Optional[str]
    resume_url: Optional[str]
    location: Optional[str]
    email: Optional[str]
    social_links: List[SocialLinkResponse] = []
    model_config = ConfigDict(from_attributes=True)


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None


# --- Skills ---
class SkillResponse(BaseModel):
    id: UUID
    name: str
    category: str
    icon: Optional[str]
    proficiency_level: int
    is_published: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class SkillCreate(BaseModel):
    name: str
    category: str
    icon: Optional[str] = None
    proficiency_level: int = 0
    is_published: bool = True
    sort_order: int = 0


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    proficiency_level: Optional[int] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


# --- Projects ---
class ProjectGithubMetadataResponse(BaseModel):
    github_id: int
    full_name: str
    description: Optional[str]
    url: str
    language: Optional[str]
    stars: int
    forks: int
    topics: Optional[List[str] | Dict[str, Any]]
    model_config = ConfigDict(from_attributes=True)


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    description: Optional[str]
    summary: Optional[str]
    case_study: Optional[str]
    cover_image_url: Optional[str]
    live_url: Optional[str]
    github_url: Optional[str]
    is_published: bool
    featured: bool
    sort_order: int
    github_metadata: Optional[ProjectGithubMetadataResponse] = None
    skills: List[SkillResponse] = []
    model_config = ConfigDict(from_attributes=True)


class ProjectCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    summary: Optional[str] = None
    case_study: Optional[str] = None
    cover_image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    is_published: bool = False
    featured: bool = False
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    summary: Optional[str] = None
    case_study: Optional[str] = None
    cover_image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    is_published: Optional[bool] = None
    featured: Optional[bool] = None
    sort_order: Optional[int] = None


# --- Experiences ---
class ExperienceResponse(BaseModel):
    id: UUID
    company: str
    position: str
    location: Optional[str]
    start_date: date
    end_date: Optional[date]
    description: Optional[str]
    is_current: bool
    is_published: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class ExperienceCreate(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    is_current: bool = False
    is_published: bool = True
    sort_order: int = 0


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    is_current: Optional[bool] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


# --- Educations ---
class EducationResponse(BaseModel):
    id: UUID
    institution: str
    degree: str
    field_of_study: Optional[str]
    start_date: date
    end_date: Optional[date]
    description: Optional[str]
    is_published: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    is_published: bool = True
    sort_order: int = 0


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


# --- Certificates ---
class CertificateResponse(BaseModel):
    id: UUID
    name: str
    issuer: str
    credential_id: Optional[str]
    credential_url: Optional[str]
    issue_date: Optional[date]
    expiry_date: Optional[date]
    image_url: Optional[str]
    is_published: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class CertificateCreate(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None
    is_published: bool = True
    sort_order: int = 0


class CertificateUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


# --- Testimonials ---
class TestimonialResponse(BaseModel):
    id: UUID
    author_name: str
    author_title: Optional[str]
    author_company: Optional[str]
    author_avatar_url: Optional[str]
    content: str
    rating: int
    is_published: bool
    featured: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)


class TestimonialCreate(BaseModel):
    author_name: str
    author_title: Optional[str] = None
    author_company: Optional[str] = None
    author_avatar_url: Optional[str] = None
    content: str
    rating: int = 5
    is_published: bool = False
    featured: bool = False
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_title: Optional[str] = None
    author_company: Optional[str] = None
    author_avatar_url: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    is_published: Optional[bool] = None
    featured: Optional[bool] = None
    sort_order: Optional[int] = None

# --- Admin Specific ---
class AnalyticsEventCreate(BaseModel):
    event_type: str
    page_path: str
    target_id: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

class AnalyticsEventResponse(BaseModel):
    id: UUID
    event_type: str
    page_path: str
    target_id: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    metadata_json: Optional[Dict[str, Any]] = None
    model_config = ConfigDict(from_attributes=True)

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageResponse(BaseModel):
    id: UUID
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ContactMessageUpdate(BaseModel):
    status: str
