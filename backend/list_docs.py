import asyncio
import os
import sys

# Add current directory to path so 'app' can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.document import Document
from sqlalchemy import select

async def list_file_paths():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Document))
        docs = result.scalars().all()
        print("Documents in Postgres:")
        for d in docs:
            print(f"Original Name: {d.original_name} | Storage Path: {d.storage_path}")

if __name__ == "__main__":
    asyncio.run(list_file_paths())
