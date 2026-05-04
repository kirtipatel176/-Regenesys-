import uuid
import contextvars
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.redis import check_rate_limit

# Context var for tracking request IDs in structured logs
request_id_contextvars = contextvars.ContextVar("request_id", default="-")

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", uuid.uuid4().hex)
        request_id_contextvars.set(request_id)
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

class GlobalRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        rate_limit_key = f"global_rate_limit:{client_ip}"
        
        # Allow 100 req per 60 sec globally per IP (ignore health endpoints)
        if not request.url.path.startswith("/health"):
            is_allowed = await check_rate_limit(rate_limit_key, max_attempts=100, timeout=60)
            if not is_allowed:
                return Response(status_code=429, content="Too Many Requests")
                
        return await call_next(request)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
        return response
