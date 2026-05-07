import redis.asyncio as redis

from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def check_rate_limit(key: str, max_attempts: int, timeout: int) -> bool:
    """
    Checks if the number of attempts for a given key exceeds max_attempts.
    If not, increments the attempt count and returns True (allowed).
    If exceeded, returns False (blocked).
    """
    attempts = await redis_client.get(key)
    if attempts and int(attempts) >= max_attempts:
        return False

    pipe = redis_client.pipeline()
    pipe.incr(key)
    if not attempts:
        pipe.expire(key, timeout)
    await pipe.execute()
    return True


async def clear_rate_limit(key: str):
    await redis_client.delete(key)
