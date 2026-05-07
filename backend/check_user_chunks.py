import asyncio
from app.db.neo4j import get_neo4j_session

async def check_user_chunks():
    async with get_neo4j_session() as session:
        try:
            result = await session.run("MATCH (c:Chunk) RETURN c.user_id as user_id, count(c) as count")
            records = await result.data()
            print("Chunks by User ID:")
            for rec in records:
                print(f"User ID: {rec['user_id']} | Count: {rec['count']}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_user_chunks())
