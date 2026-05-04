from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.redis import check_rate_limit, clear_rate_limit
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.token import RefreshRequest, Token, TokenPayload
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_in: UserCreate, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email, password_hash=security.get_password_hash(user_in.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    client_ip = request.client.host if request.client else "unknown"
    rate_limit_key = f"login_attempts:{form_data.username}:{client_ip}"

    # Max 5 attempts in 15 minutes (900 seconds)
    is_allowed = await check_rate_limit(rate_limit_key, max_attempts=5, timeout=900)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again later.",
        )

    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Login successful, clear rate limit
    await clear_rate_limit(rate_limit_key)

    access_token = security.create_access_token(user.id)
    refresh_token_str, jti = security.create_refresh_token(user.id)

    # Save refresh token in DB
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    db_token = RefreshToken(
        user_id=user.id,
        token_jti=jti,
        expires_at=expires_at,
        user_agent=request.headers.get("user-agent"),
        ip_address=client_ip,
    )
    db.add(db_token)
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request_data: RefreshRequest,
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
):
    try:
        payload = jwt.decode(
            request_data.refresh_token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM],
        )
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type"
            )

        token_jti = payload.get("jti")
        user_id = payload.get("sub")

        if not token_jti or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
            )

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    # Check token in DB
    result = await db.execute(
        select(RefreshToken).filter(RefreshToken.token_jti == token_jti)
    )
    db_token = result.scalars().first()

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found"
        )
    if db_token.revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )
    if db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired"
        )

    # Check user
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found or inactive"
        )

    # Revoke old token
    db_token.revoked = True

    # Generate new tokens
    access_token = security.create_access_token(user.id)
    new_refresh_token_str, new_jti = security.create_refresh_token(user.id)

    new_expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    client_ip = request.client.host if request.client else "unknown"

    new_db_token = RefreshToken(
        user_id=user.id,
        token_jti=new_jti,
        expires_at=new_expires_at,
        user_agent=request.headers.get("user-agent"),
        ip_address=client_ip,
    )
    db.add(new_db_token)
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token_str,
        "token_type": "bearer",
    }


@router.post("/logout")
async def logout(
    request_data: RefreshRequest,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    try:
        payload = jwt.decode(
            request_data.refresh_token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM],
        )
        token_jti = payload.get("jti")
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    if token_jti:
        result = await db.execute(
            select(RefreshToken).filter(
                RefreshToken.token_jti == token_jti,
                RefreshToken.user_id == current_user.id,
            )
        )
        db_token = result.scalars().first()
        if db_token:
            db_token.revoked = True
            await db.commit()

    return {"message": "Successfully logged out"}


@router.post("/logout-all")
async def logout_all(
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    # Revoke all unrevoked tokens for the user
    result = await db.execute(
        select(RefreshToken).filter(
            RefreshToken.user_id == current_user.id, RefreshToken.revoked == False
        )
    )
    tokens = result.scalars().all()

    for token in tokens:
        token.revoked = True

    await db.commit()
    return {"message": "Successfully logged out from all sessions"}
