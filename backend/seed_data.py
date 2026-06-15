"""
Seed data script for local development.

Usage:
    python seed_data.py

WARNING: This script is for LOCAL DEVELOPMENT ONLY.
It will create sample data in the database.
Do NOT run in production.
"""

import sys
import os

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.profile import Profile
from app.models.social_links import SocialLink
from app.models.skills import Skill
from app.models.projects import Project
from app.models.experiences import Experience
from app.models.educations import Education
from app.models.certificates import Certificate
from app.models.testimonials import Testimonial


def seed():
    db = SessionLocal()

    try:
        # Check if data already exists
        existing_profile = db.query(Profile).first()
        if existing_profile:
            print("⚠️  Data already exists. Skipping seed.")
            print("   Delete existing data first if you want to re-seed.")
            return

        print("🌱 Seeding development data...")

        # --- Profile ---
        profile = Profile(
            full_name="Alex Developer",
            title="Full Stack Software Engineer",
            bio="Passionate software engineer with 5+ years of experience building scalable web applications. "
                "I specialize in React, Python, and cloud infrastructure. "
                "I love turning complex problems into elegant solutions.",
            location="San Francisco, CA",
            email="alex@example.dev",
            avatar_url="https://api.dicebear.com/8.x/avataaars/svg?seed=alex",
            resume_url="#",
        )
        db.add(profile)
        db.flush()
        print("  ✅ Profile created")

        # --- Social Links ---
        social_links = [
            SocialLink(profile_id=profile.id, platform="GitHub", url="https://github.com/example", sort_order=0),
            SocialLink(profile_id=profile.id, platform="LinkedIn", url="https://linkedin.com/in/example", sort_order=1),
            SocialLink(profile_id=profile.id, platform="Twitter", url="https://twitter.com/example", sort_order=2),
        ]
        db.add_all(social_links)
        print("  ✅ Social links created")

        # --- Skills ---
        skills = [
            Skill(name="React", category="Frontend", proficiency_level=95, is_published=True, sort_order=0),
            Skill(name="TypeScript", category="Frontend", proficiency_level=90, is_published=True, sort_order=1),
            Skill(name="Next.js", category="Frontend", proficiency_level=88, is_published=True, sort_order=2),
            Skill(name="Python", category="Backend", proficiency_level=92, is_published=True, sort_order=3),
            Skill(name="FastAPI", category="Backend", proficiency_level=85, is_published=True, sort_order=4),
            Skill(name="PostgreSQL", category="Database", proficiency_level=80, is_published=True, sort_order=5),
            Skill(name="Docker", category="DevOps", proficiency_level=82, is_published=True, sort_order=6),
            Skill(name="AWS", category="DevOps", proficiency_level=75, is_published=True, sort_order=7),
        ]
        db.add_all(skills)
        print("  ✅ Skills created")

        # --- Projects ---
        projects = [
            Project(
                title="E-Commerce Platform",
                slug="e-commerce-platform",
                summary="A full-stack e-commerce platform with real-time inventory, Stripe payments, and admin dashboard.",
                description="Built with Next.js, FastAPI, and PostgreSQL. Features include product search, cart management, order tracking, and analytics.",
                is_published=True,
                featured=True,
                sort_order=0,
            ),
            Project(
                title="Task Management App",
                slug="task-management-app",
                summary="Collaborative project management tool with real-time updates and team features.",
                description="A Trello-like application built with React and Node.js, featuring drag-and-drop, real-time notifications, and team workspaces.",
                is_published=True,
                featured=True,
                sort_order=1,
            ),
            Project(
                title="AI Chat Interface",
                slug="ai-chat-interface",
                summary="Modern chat UI for interacting with large language models, with streaming responses.",
                description="Built with Next.js and Python, featuring streaming responses, conversation history, and customizable system prompts.",
                is_published=True,
                featured=False,
                sort_order=2,
            ),
        ]
        db.add_all(projects)
        print("  ✅ Projects created")

        # --- Experience ---
        experiences = [
            Experience(
                company="TechCorp Inc.",
                position="Senior Software Engineer",
                location="San Francisco, CA",
                start_date="2022-01-01",
                is_current=True,
                description="Leading development of microservices architecture. Mentoring junior developers and driving technical decisions.",
                is_published=True,
                sort_order=0,
            ),
            Experience(
                company="StartupXYZ",
                position="Full Stack Developer",
                location="Remote",
                start_date="2019-06-01",
                end_date="2021-12-31",
                description="Built and maintained multiple client-facing applications. Introduced CI/CD pipelines and automated testing.",
                is_published=True,
                sort_order=1,
            ),
        ]
        db.add_all(experiences)
        print("  ✅ Experience created")

        # --- Education ---
        educations = [
            Education(
                institution="University of Technology",
                degree="Bachelor of Science",
                field_of_study="Computer Science",
                start_date="2015-09-01",
                end_date="2019-06-01",
                description="Graduated with honors. Focus on algorithms, distributed systems, and machine learning.",
                is_published=True,
                sort_order=0,
            ),
        ]
        db.add_all(educations)
        print("  ✅ Education created")

        # --- Certificates ---
        certificates = [
            Certificate(
                name="AWS Solutions Architect Associate",
                issuer="Amazon Web Services",
                issue_date="2023-03-15",
                expiry_date="2026-03-15",
                credential_id="AWS-SAA-123456",
                credential_url="https://aws.amazon.com/verification",
                is_published=True,
                sort_order=0,
            ),
            Certificate(
                name="Google Cloud Professional Developer",
                issuer="Google Cloud",
                issue_date="2023-08-01",
                credential_id="GCP-PD-789012",
                is_published=True,
                sort_order=1,
            ),
        ]
        db.add_all(certificates)
        print("  ✅ Certificates created")

        # --- Testimonials ---
        testimonials = [
            Testimonial(
                author_name="Jane Smith",
                author_title="Engineering Manager",
                author_company="TechCorp Inc.",
                content="One of the most talented engineers I've worked with. Alex consistently delivers high-quality work and brings creative solutions to complex problems.",
                rating=5,
                is_published=True,
                featured=True,
                sort_order=0,
            ),
            Testimonial(
                author_name="Mike Johnson",
                author_title="CTO",
                author_company="StartupXYZ",
                content="Alex transformed our development process. Their expertise in both frontend and backend made them invaluable to our team.",
                rating=5,
                is_published=True,
                featured=True,
                sort_order=1,
            ),
        ]
        db.add_all(testimonials)
        print("  ✅ Testimonials created")

        db.commit()
        print("\n🎉 Seed data created successfully!")
        print("   Run 'python create_admin.py' to create an admin user.")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
