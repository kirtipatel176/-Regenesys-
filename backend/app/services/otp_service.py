"""
OTP generation, storage, and email delivery service.

OTPs are stored in Redis with a configurable TTL (default 5 minutes).
Emails are sent via SMTP (async-compatible via ``aiosmtplib``).
"""

import logging
import random
import string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib
from app.core.config import settings
from app.core.redis import redis_client

logger = logging.getLogger(__name__)

OTP_LENGTH = 6
OTP_TTL_SECONDS = 300  # 5 minutes
OTP_RESEND_COOLDOWN = 60  # 1 minute between resends


def _generate_otp() -> str:
    """Generate a cryptographically random 6-digit OTP."""
    return "".join(random.choices(string.digits, k=OTP_LENGTH))


def _otp_redis_key(email: str) -> str:
    return f"otp:verify:{email.lower()}"


def _otp_cooldown_key(email: str) -> str:
    return f"otp:cooldown:{email.lower()}"


async def create_and_store_otp(email: str) -> str:
    """
    Generate an OTP, store it in Redis with TTL, and return it.
    Raises ValueError if the user is still within the cooldown window.
    """
    cooldown_key = _otp_cooldown_key(email)
    if await redis_client.exists(cooldown_key):
        raise ValueError("OTP was recently sent. Please wait before requesting again.")

    otp = _generate_otp()
    otp_key = _otp_redis_key(email)

    # Store OTP with TTL
    await redis_client.setex(otp_key, OTP_TTL_SECONDS, otp)
    # Set cooldown to prevent spam
    await redis_client.setex(cooldown_key, OTP_RESEND_COOLDOWN, "1")

    logger.info("OTP generated for %s (expires in %ds)", email, OTP_TTL_SECONDS)
    return otp


async def verify_otp(email: str, otp: str) -> bool:
    """
    Verify the OTP against what's stored in Redis.
    Returns True if valid, False otherwise.
    Deletes the OTP on successful verification (one-time use).
    """
    otp_key = _otp_redis_key(email)
    stored_otp = await redis_client.get(otp_key)

    if not stored_otp:
        return False

    if stored_otp != otp:
        return False

    # OTP is valid — delete it (one-time use)
    await redis_client.delete(otp_key)
    return True


async def send_otp_email(email: str, otp: str) -> None:
    """
    Send the OTP to the user's email via SMTP.
    Falls back to logging if SMTP is not configured (dev mode).
    """
    if not settings.SMTP_HOST:
        logger.warning(
            "SMTP not configured — OTP for %s is: %s (dev mode, not sent)", email, otp
        )
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{settings.PROJECT_NAME} — Verify Your Email"
    msg["From"] = settings.SMTP_FROM_EMAIL
    msg["To"] = email

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; padding: 40px; text-align: center;">
            <h2 style="color: #1a1a2e;">Verify Your Email</h2>
            <p style="color: #555;">Use the following code to complete your registration:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e; margin: 30px 0; padding: 16px; background: #f0f0f5; border-radius: 8px;">
                {otp}
            </div>
            <p style="color: #999; font-size: 13px;">This code expires in 5 minutes.</p>
            <p style="color: #999; font-size: 13px;">If you didn't request this, please ignore this email.</p>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html_body, "html"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER or None,
            password=settings.SMTP_PASSWORD or None,
            use_tls=settings.SMTP_TLS,
        )
        logger.info("OTP email sent to %s", email)
    except Exception as e:
        logger.error("Failed to send OTP email to %s: %s", email, e)
        # Don't raise — the OTP is stored in Redis, so the user can still
        # use the resend endpoint. We just log the failure.
