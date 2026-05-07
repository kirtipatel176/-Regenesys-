import asyncio

from app.db.neo4j import get_neo4j_session


async def list_concepts():
    async with get_neo4j_session() as session:
        try:
            result = await session.run("MATCH (k:Concept) RETURN k.name AS name LIMIT 20")
            records = await result.data()
            print("Top 20 Concepts in Graph:")
            for rec in records:
                print(f"- {rec['name']}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_concepts())
