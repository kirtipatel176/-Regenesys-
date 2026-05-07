import asyncio
import os
import sys

# Add current directory to path so 'app' can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables before importing app
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User


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
