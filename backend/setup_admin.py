import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User, RoleEnum
from app.core import security
from sqlalchemy.future import select

async def setup_admin():
    print("Checking for admin user...")
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).filter(User.email == "admin@regenesys.com"))
        user = result.scalars().first()
        
        if not user:
            print("Admin user not found. Creating...")
            user = User(
                email="admin@regenesys.com",
                password_hash=security.get_password_hash("password123"),
                is_active=True,
                is_verified=True,
                role=RoleEnum.admin
            )
            db.add(user)
            await db.commit()
            print("✅ Admin user created successfully with password: password123")
        else:
            print("Admin user exists. Ensuring Admin role and verified status...")
            user.role = RoleEnum.admin
            user.is_verified = True
            user.is_active = True
            user.password_hash = security.get_password_hash("password123") # Resetting to password123 for testing
            await db.commit()
            print("✅ Admin user updated successfully.")

if __name__ == "__main__":
    asyncio.run(setup_admin())
