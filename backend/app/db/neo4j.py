"""
Neo4j async driver management.

The driver is a module-level singleton (cheap to keep alive; the driver
manages its own connection pool internally).  Call `close_neo4j_driver()`
during application shutdown to cleanly drain all connections.

Usage in FastAPI endpoints / dependencies:
    from app.db.neo4j import get_neo4j_session
    ...
    async with get_neo4j_session() as session:
        result = await session.run("MATCH (n) RETURN n LIMIT 1")
"""

import logging

from app.core.config import settings
from neo4j import AsyncDriver, AsyncGraphDatabase, AsyncSession

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Singleton driver
# ---------------------------------------------------------------------------

_driver: AsyncDriver | None = None


def get_neo4j_driver() -> AsyncDriver:
    """Return (or lazily create) the module-level Neo4j async driver."""
    global _driver
    if _driver is None:
        _driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
            # Keep a small connection pool suitable for a single-node dev setup;
            # increase max_connection_pool_size for production.
            max_connection_pool_size=50,
        )
        logger.info("Neo4j async driver created (URI=%s)", settings.NEO4J_URI)
    return _driver


async def close_neo4j_driver() -> None:
    """Gracefully close the driver and drain all pooled connections.
    Call this from the FastAPI lifespan shutdown hook.
    """
    global _driver
    if _driver is not None:
        await _driver.close()
        _driver = None
        logger.info("Neo4j async driver closed.")


async def ping_neo4j() -> bool:
    """Return True if the Neo4j server is reachable, False otherwise.
    Used by the lifespan startup check and /health/deep endpoint.
    """
    try:
        driver = get_neo4j_driver()
        await driver.verify_connectivity()
        return True
    except Exception as exc:
        logger.error("Neo4j connectivity check failed: %s", exc)
        return False


# ---------------------------------------------------------------------------
# FastAPI dependency helper
# ---------------------------------------------------------------------------


def get_neo4j_session() -> AsyncSession:  # type: ignore[return]
    """
    Return an async Neo4j session as a context manager.

    Typical usage in a service / Celery task (NOT as a FastAPI Depends,
    since FastAPI Depends expects an async generator):

        async with get_neo4j_session() as session:
            await session.run(...)

    For FastAPI endpoint injection use `neo4j_session_dep` below.
    """
    driver = get_neo4j_driver()
    return driver.session()


async def neo4j_session_dep():
    """
    FastAPI dependency that yields a Neo4j async session and auto-closes it.

    Example:
        @router.get("/example")
        async def example(neo4j: AsyncSession = Depends(neo4j_session_dep)):
            result = await neo4j.run("MATCH (n) RETURN n LIMIT 1")
    """
    async with get_neo4j_session() as session:
        yield session
