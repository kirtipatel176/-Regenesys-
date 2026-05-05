# Private AI Chat Tool — Backend Documentation

> **For Frontend Developers: Complete setup guide, API reference, and integration instructions.**

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Running the Backend](#running-the-backend)
5. [Verifying the Setup](#verifying-the-setup)
6. [Authentication Flow](#authentication-flow)
7. [API Reference](#api-reference)
   - [Auth APIs](#1-authentication-apis)
   - [Profile APIs](#2-profile-apis)
   - [Document APIs](#3-document-apis)
   - [Chat APIs](#4-chat-apis)
   - [Admin APIs](#5-admin-apis)
   - [Health APIs](#6-health-check-apis)
8. [Error Handling](#error-handling)
9. [CORS Configuration](#cors-configuration)
10. [Useful Links](#useful-links)

---

## Tech Stack

| Layer             | Technology                                         |
|-------------------|---------------------------------------------------|
| **Framework**     | Python 3.12, FastAPI                              |
| **Databases**     | PostgreSQL 16 (users, chat), Neo4j 5 (Graph RAG)  |
| **Cache/Queue**   | Redis 7 (rate-limiting, background jobs, OTP)      |
| **AI/LLM**        | AWS Bedrock (Claude 3.5 Sonnet) or Google Gemini  |
| **NLP**           | spaCy (keyword/concept extraction)                |
| **Background Jobs** | Celery                                          |
| **Auth**          | JWT (Access + Refresh tokens), OTP via Email       |
| **Containerization** | Docker & Docker Compose                        |

---

## Prerequisites

- **Docker** (v27+) and **Docker Compose** (v5+) installed on your machine
- A terminal / command line

> **You do NOT need to install Python, PostgreSQL, Neo4j, or Redis locally.** Docker handles everything.

---

## Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/MrVishalKuriya/private-gpt.git
cd private-gpt/backend
```

### Step 2: Create the `.env` file

Create a file named `.env` inside the `backend` folder and paste the following:

```env
PROJECT_NAME="Private AI Chat Tool"
SECRET_KEY="super_secret_key_change_in_production_min_32_characters"
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
BACKEND_CORS_ORIGINS='["http://localhost:3000","http://localhost:5173","http://localhost:8000"]'

POSTGRES_SERVER="db"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres_password"
POSTGRES_DB="app_db"
POSTGRES_PORT="5432"

REDIS_URL="redis://redis:6379/0"

UPLOAD_DIR="/storage/uploads"

# Neo4j Graph Database
NEO4J_URI="bolt://neo4j:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="neo4j_password"

# LLM Provider: "bedrock" or "gemini"
LLM_PROVIDER="bedrock"
# LLM_MODEL=""  # Leave blank to use provider default

# AWS Bedrock (used when LLM_PROVIDER=bedrock)
AWS_ACCESS_KEY_ID="your_aws_access_key_here"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key_here"
AWS_REGION="us-east-1"
BEDROCK_MAX_TOKENS=4096

# Gemini (used when LLM_PROVIDER=gemini)
GEMINI_API_KEY="your_gemini_api_key_here"

# SMTP for OTP emails (optional for dev — OTP is logged to console if not set)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASSWORD="your-app-password"
# SMTP_FROM_EMAIL="noreply@privategpt.ai"
# SMTP_TLS=true
```

> **Important:** Replace `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with real credentials to enable AI chat features.

---

## Running the Backend

### Step 1: Start all services

```bash
cd backend
docker compose up --build
```

This starts **5 services**: API, Celery Worker, PostgreSQL, Redis, Neo4j.  
Wait until you see `Application startup complete.` in the logs.

### Step 2: Run database migrations (in a second terminal)

```bash
cd backend
docker compose run --rm api alembic upgrade head
```

### Step 3: Download the NLP model

```bash
docker compose run --rm api python -m spacy download en_core_web_sm
```

### Step 4: Verify

```bash
curl http://localhost:8000/health/deep
```

Expected response:
```json
{"status": "ok", "database": "ok", "redis": "ok", "neo4j": "ok"}
```

> **Backend is now running at: `http://localhost:8000`**

---

## Verifying the Setup

| URL                              | What it is                        |
|----------------------------------|-----------------------------------|
| `http://localhost:8000/docs`     | Swagger UI (interactive API docs) |
| `http://localhost:8000/health`   | Quick health check                |
| `http://localhost:8000/health/deep` | Deep health check (all DBs)    |
| `http://localhost:7474`          | Neo4j Browser UI (user: `neo4j`, password: `neo4j_password`) |

---

## Authentication Flow

The backend uses **JWT-based authentication** with an **OTP email verification** step on registration.

### Complete Flow:

```
1. User registers      → POST /api/v1/auth/register
                          (account created as UNVERIFIED, OTP sent to email)

2. User verifies OTP   → POST /api/v1/auth/verify-otp
                          (account marked as VERIFIED)

3. User logs in        → POST /api/v1/auth/login
                          (returns access_token + refresh_token)

4. Use access_token    → Send in header: Authorization: Bearer <access_token>

5. Token expires       → POST /api/v1/auth/refresh
                          (returns new token pair)

6. User logs out       → POST /api/v1/auth/logout
```

### Token Details:

| Token            | Lifetime    | Where to store                     |
|------------------|-------------|-----------------------------------|
| `access_token`   | 15 minutes  | In-memory / state (NOT localStorage) |
| `refresh_token`  | 7 days      | HttpOnly cookie or secure storage  |

### Auth Header (for all protected routes):

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Dev Mode OTP:
Since SMTP is not configured by default, the OTP is **printed in the Docker console logs**.  
Look for: `OTP for user@email.com is: 123456`

---

## API Reference

**Base URL:** `http://localhost:8000/api/v1`

### 1. Authentication APIs

#### `POST /auth/register`
Register a new user. Sends a 6-digit OTP to the email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "MySecure@123"
}
```

**Password Rules:** Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "user",
  "is_active": true,
  "is_verified": false,
  "created_at": "2026-05-05T12:00:00Z",
  "updated_at": "2026-05-05T12:00:00Z"
}
```

---

#### `POST /auth/verify-otp`
Verify the OTP sent during registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

**Errors:**
- `404` — No account found with this email
- `400` — Already verified / Invalid or expired OTP

---

#### `POST /auth/resend-otp`
Resend the OTP. Rate-limited: 1 request per 60 seconds.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP has been resent to your email."
}
```

**Errors:**
- `429` — OTP was recently sent, wait before requesting again

---

#### `POST /auth/login`
Login with email and password. Returns JWT tokens.

**Request Body:** `application/x-www-form-urlencoded`
```
username=user@example.com&password=MySecure@123
```

> **Note:** The field is called `username` (OAuth2 standard) but you pass the email.

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errors:**
- `401` — Incorrect email or password
- `403` — Email not verified
- `429` — Too many failed attempts (max 5 in 15 min)

---

#### `POST /auth/refresh`
Get new tokens using a valid refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):** Same format as login response.

---

#### `POST /auth/logout` 🔒
Revoke the current refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### `POST /auth/logout-all` 🔒
Revoke ALL active refresh tokens for the user.

**Response (200):**
```json
{
  "message": "Successfully logged out from all sessions"
}
```

---

### 2. Profile APIs

> 🔒 All profile endpoints require `Authorization: Bearer <token>`

#### `GET /profile/me`
Get the current user's profile.

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "company_name": "Acme Inc",
  "timezone": "Asia/Kolkata"
}
```

---

#### `PUT /profile/me`
Update the current user's profile.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "company_name": "Acme Inc",
  "timezone": "Asia/Kolkata"
}
```

> All fields are optional. Send only the ones you want to update.

---

### 3. Document APIs

> 🔒 All document endpoints require `Authorization: Bearer <token>`

#### `POST /documents/upload`
Upload a document (PDF, DOCX, TXT). Max size: 25 MB.

**Request:** `multipart/form-data`
```
file: <binary file>
```

**Response (201):**
```json
{
  "id": "uuid",
  "filename": "abc123.pdf",
  "original_name": "Company Handbook.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1048576,
  "processing_status": "pending",
  "page_count": null,
  "created_at": "2026-05-05T12:00:00Z"
}
```

**Processing Status Flow:**
```
pending → processing → completed (or failed)
```

> **Important:** The document is available for chat ONLY after `processing_status` becomes `completed`. Poll `GET /documents/{id}` to check.

---

#### `GET /documents`
List all documents uploaded by the current user.

**Response (200):** Array of `DocumentResponse` objects.

---

#### `GET /documents/{id}`
Get a specific document by ID.

---

#### `DELETE /documents/{id}`
Delete a document. Also removes its graph data from Neo4j.

**Response:** `204 No Content`

---

### 4. Chat APIs

> 🔒 All chat endpoints require `Authorization: Bearer <token>`

#### `POST /chat/ask`
Ask a question. The AI answers based ONLY on the user's uploaded documents.

**Request Body:**
```json
{
  "session_id": null,
  "question": "What is the leave policy?"
}
```

- `session_id`: Pass `null` for a new conversation. Pass an existing UUID to continue a conversation.

**Response (200):**
```json
{
  "session_id": "uuid",
  "answer": "According to the Company Handbook (Page 12), employees get 24 days of paid leave per year...",
  "citations": [
    {"source_index": 1, "document_id": "uuid"}
  ],
  "sources": [
    {
      "document_id": "uuid",
      "filename": "Company Handbook.pdf",
      "page_number": 12,
      "content_snippet": "All employees are entitled to 24 days..."
    }
  ],
  "confidence_score": 0.95
}
```

---

#### `POST /chat/ask/stream`
Same as `/chat/ask` but returns a **Server-Sent Events (SSE)** stream for real-time "typing" effect.

**Request Body:** Same as `/chat/ask`.

**Response:** `text/event-stream`
```
According to the Company Handbook...
(Page 12), employees get...
24 days of paid leave per year...
```

**Frontend Integration Example (JavaScript):**
```javascript
const response = await fetch('/api/v1/chat/ask/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ question: 'What is the leave policy?' }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // Append `text` to your chat bubble
}
```

---

#### `GET /chat/sessions`
List all chat sessions for the current user (most recent first).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "What is the leave policy?",
    "created_at": "2026-05-05T12:00:00Z"
  }
]
```

---

#### `GET /chat/sessions/{id}/messages`
Get all messages in a specific chat session (ordered chronologically).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "role": "user",
    "content": "What is the leave policy?",
    "citations": null,
    "created_at": "2026-05-05T12:00:00Z"
  },
  {
    "id": "uuid",
    "role": "assistant",
    "content": "According to the Company Handbook...",
    "citations": [{"source_index": 1, "document_id": "uuid"}],
    "created_at": "2026-05-05T12:00:01Z"
  }
]
```

---

### 5. Admin APIs

> 🔒 All admin endpoints require `Authorization: Bearer <token>` with `role: admin`

#### `GET /admin/users?skip=0&limit=100`
List all users (paginated).

#### `PATCH /admin/users/{id}/status`
Activate/deactivate a user.

**Request Body:**
```json
{
  "is_active": false
}
```

#### `GET /admin/documents?skip=0&limit=100`
List ALL documents from all users.

#### `DELETE /admin/documents/{id}`
Delete any document (admin privilege).

#### `GET /admin/stats`
Get dashboard statistics.

**Response (200):**
```json
{
  "total_users": 42,
  "total_docs": 156,
  "processed_docs": 150,
  "failed_docs": 2,
  "total_chats_today": 89
}
```

---

### 6. Health Check APIs

> These are **public** — no authentication required.

#### `GET /health`
Quick check.
```json
{"status": "ok"}
```

#### `GET /health/deep`
Checks all database connections.
```json
{"status": "ok", "database": "ok", "redis": "ok", "neo4j": "ok"}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "detail": "Error message string"
}
```

### Common HTTP Status Codes:

| Code  | Meaning                                |
|-------|----------------------------------------|
| `200` | Success                                |
| `201` | Created (registration, upload)         |
| `204` | Deleted successfully (no body)         |
| `400` | Bad request / validation error         |
| `401` | Unauthorized (invalid/missing token)   |
| `403` | Forbidden (email not verified)         |
| `404` | Not found                              |
| `422` | Validation error (Pydantic)            |
| `429` | Rate limited                           |

### Validation Error Format (422):
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Password must be at least 8 characters long",
      "type": "value_error"
    }
  ]
}
```

---

## CORS Configuration

The backend allows requests from these origins by default:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8000` (API docs)

If your frontend runs on a different port, add it to `BACKEND_CORS_ORIGINS` in the `.env` file.

---

## Useful Links

| Resource                     | URL                                    |
|------------------------------|----------------------------------------|
| Swagger UI (API Docs)        | http://localhost:8000/docs             |
| ReDoc (Alternative Docs)     | http://localhost:8000/redoc            |
| OpenAPI JSON Spec            | http://localhost:8000/api/v1/openapi.json |
| Neo4j Browser                | http://localhost:7474                  |
| GitHub Repository            | https://github.com/MrVishalKuriya/private-gpt |

---

## Quick Commands Reference

```bash
# Start everything
docker compose up --build

# Run migrations
docker compose run --rm api alembic upgrade head

# Download NLP model
docker compose run --rm api python -m spacy download en_core_web_sm

# View API logs only
docker compose logs -f api

# View worker logs only
docker compose logs -f worker

# Stop everything
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```
