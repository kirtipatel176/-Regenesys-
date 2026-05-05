import os

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Private AI Chat Tool"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")

    # Security
    SECRET_KEY: str = Field(
        ..., min_length=32, description="Must be at least 32 characters long"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BACKEND_CORS_ORIGINS: list[str] = []

    # Database (PostgreSQL)
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "app_db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Neo4j (Graph Database)
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "neo4j_password")

    # ------------------------------------------------------------------ #
    # LLM Provider Configuration
    # ------------------------------------------------------------------ #
    # Which provider to use: "gemini" or "bedrock"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "bedrock")
    # Override the default model for the selected provider (optional)
    LLM_MODEL: str = os.getenv("LLM_MODEL", "")

    # Gemini (used when LLM_PROVIDER=gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # AWS Bedrock (used when LLM_PROVIDER=bedrock)
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    BEDROCK_MAX_TOKENS: int = int(os.getenv("BEDROCK_MAX_TOKENS", "4096"))

    # File Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "storage/uploads")
    MAX_UPLOAD_SIZE: int = 25 * 1024 * 1024  # 25 MB

    # SMTP (for OTP emails)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@privategpt.ai")
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "true").lower() == "true"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
