import asyncio
from app.db.neo4j import get_neo4j_session

async def count_nodes():
    async with get_neo4j_session() as session:
        try:
            result = await session.run("MATCH (n) RETURN count(n) AS count")
            record = await result.single()
            print(f"Total nodes in Neo4j: {record['count']}")
            
            result = await session.run("MATCH (c:Chunk) RETURN count(c) AS count")
            record = await result.single()
            print(f"Total Chunks: {record['count']}")
            
            result = await session.run("MATCH (k:Concept) RETURN count(k) AS count")
            record = await result.single()
            print(f"Total Concepts: {record['count']}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(count_nodes())
