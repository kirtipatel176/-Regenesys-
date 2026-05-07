import asyncio
import os
import sys

# Add current directory to path so 'app' can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.user import User, RoleEnum
from app.core.security import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with AsyncSessionLocal() as db:
        try:
            # Check if admin already exists
            result = await db.execute(select(User).filter(User.email == "admin@regenesys.com"))
            user = result.scalars().first()
            
            if user:
                print("Admin user already exists. Updating password...")
                user.password_hash = get_password_hash("admin123")
                user.is_verified = True
                user.role = RoleEnum.admin
            else:
                print("Creating admin user...")
                user = User(
                    email="admin@regenesys.com",
                    password_hash=get_password_hash("admin123"),
                    is_verified=True,
                    is_active=True,
                    role=RoleEnum.admin
                )
                db.add(user)
            
            await db.commit()
            print("✅ Admin user setup successful!")

            # Check if standard user exists
            result = await db.execute(select(User).filter(User.email == "user@regenesys.com"))
            user = result.scalars().first()
            if not user:
                print("Creating standard user...")
                user = User(
                    email="user@regenesys.com",
                    password_hash=get_password_hash("User@1234"),
                    is_verified=True,
                    is_active=True,
                    role=RoleEnum.user
                )
                db.add(user)
                await db.commit()
                print("✅ Standard user setup successful!")
            else:
                print("Standard user already exists.")

        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(create_admin())
