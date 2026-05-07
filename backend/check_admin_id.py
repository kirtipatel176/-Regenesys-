import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def check_admin_id():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).filter(User.email == "admin@regenesys.com"))
        user = result.scalars().first()
        if user:
            print(f"Admin User ID: {user.id}")
        else:
            print("Admin user not found in Postgres.")

if __name__ == "__main__":
    asyncio.run(check_admin_id())
