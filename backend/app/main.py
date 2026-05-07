import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.exceptions import ResponseValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.middleware import (
    GlobalRateLimitMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)
from app.core.redis import redis_client
from app.db.neo4j import close_neo4j_driver, get_neo4j_driver, ping_neo4j
from app.db.session import engine

# Initialize Production Logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize Sentry
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )
    logger.info("Sentry initialized")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ------------------------------------------------------------------ #
    # Startup (Non-blocking as much as possible)
    # ------------------------------------------------------------------ #
    logger.info("Application starting up...")

    # We'll run checks but not fail the whole app startup if one is slow
    # as Render has a strict port-binding timeout.
    try:
        # DB Connection Check
        async with engine.connect() as _:
            pass
        logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection check failed: {e}")

    # Redis Ping Check
    try:
        await redis_client.ping()
        logger.info("Redis connection successful.")
    except Exception as e:
        logger.error(f"Redis connection check failed: {e}")

    # Neo4j Connectivity Check
    try:
        get_neo4j_driver()
        if await ping_neo4j():
            logger.info("Neo4j connection successful.")
    except Exception as e:
        logger.error(f"Neo4j initialisation check failed: {e}")

    # 4. LLM Provider Check
    if settings.LLM_PROVIDER.lower() == "gemini" and (
        not settings.GEMINI_API_KEY or "your_gemini_api_key" in settings.GEMINI_API_KEY
    ):
        logger.warning(
            "LLM_PROVIDER is 'gemini' but GEMINI_API_KEY is missing or invalid."
        )
    elif settings.LLM_PROVIDER.lower() == "bedrock" and (
        not settings.AWS_ACCESS_KEY_ID or "your_aws" in settings.AWS_ACCESS_KEY_ID
    ):
        logger.warning(
            "LLM_PROVIDER is 'bedrock' but AWS credentials are missing or placeholder."
        )

    yield

    # ------------------------------------------------------------------ #
    # Shutdown Cleanup
    # ------------------------------------------------------------------ #
    logger.info("Application shutting down...")
    await engine.dispose()
    await redis_client.aclose()
    await close_neo4j_driver()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Add Request Tracking and Security Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(GlobalRateLimitMiddleware)
app.add_middleware(RequestIDMiddleware)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS] + [
        "https://private-gpt-ochre.vercel.app",
        "https://private-gpt-api.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/health/deep")
async def health_deep_check():
    db_status = "ok"
    try:
        async with engine.connect() as _:
            pass
    except Exception:
        db_status = "error"

    redis_status = "ok"
    try:
        await redis_client.ping()
    except Exception:
        redis_status = "error"

    neo4j_status = "ok" if await ping_neo4j() else "error"

    status = (
        "ok"
        if db_status == "ok" and redis_status == "ok" and neo4j_status == "ok"
        else "error"
    )
    return {
        "status": status,
        "database": db_status,
        "redis": redis_status,
        "neo4j": neo4j_status,
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "error_message": str(exc),
            "error_type": str(type(exc)),
        },
    )


@app.exception_handler(ResponseValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Response validation error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Response Validation Error", "errors": exc.errors()},
    )
