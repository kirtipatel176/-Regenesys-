from typing import AsyncGenerator

import pytest
from app.main import app
from httpx import ASGITransport, AsyncClient


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client
