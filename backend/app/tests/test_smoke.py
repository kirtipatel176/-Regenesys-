import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock

@pytest.fixture(autouse=True)
def mock_redis_globally(monkeypatch):
    mock = AsyncMock()
    mock.ping.return_value = True
    monkeypatch.setattr('app.core.redis.redis_client', mock)
    monkeypatch.setattr('app.core.middleware.check_rate_limit', AsyncMock(return_value=True))

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_deep_health_check(async_client: AsyncClient):
    response = await async_client.get("/health/deep")
    assert response.status_code == 200
    assert "database" in response.json()
    assert "redis" in response.json()

@pytest.mark.asyncio
async def test_auth_validation_register(async_client: AsyncClient):
    response = await async_client.post("/api/v1/auth/register", json={})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_auth_validation_login(async_client: AsyncClient):
    response = await async_client.post("/api/v1/auth/login", data={})
    assert response.status_code == 422

def test_migrations_import():
    import alembic.config
    assert alembic.config is not None

def test_startup_imports():
    from app.main import app
    assert app is not None
