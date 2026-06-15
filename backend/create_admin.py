import os
import uuid
from app.core.database import SessionLocal
from app.models.admin_user import AdminUser
from app.core.security import hash_password

def create_admin():
    db = SessionLocal()
    admin_username = os.getenv("INITIAL_ADMIN_USERNAME", "admin")
    admin_password = os.getenv("INITIAL_ADMIN_PASSWORD", "admin123")
    
    try:
        # Check if admin already exists
        admin = db.query(AdminUser).filter(AdminUser.username == admin_username).first()
        if admin:
            print(f"Admin user '{admin_username}' already exists.")
            return

        # Create new admin
        hashed_pw = hash_password(admin_password)
        new_admin = AdminUser(
            id=uuid.uuid4(),
            username=admin_username,
            email=f"{admin_username}@example.com",
            hashed_password=hashed_pw,
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        print(f"Admin user created successfully! Username: {admin_username}")
    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
