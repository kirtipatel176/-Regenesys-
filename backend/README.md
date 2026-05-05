# 🧠 Private AI Chat Tool — Document-Based Q&A Platform

> A production-grade, privacy-first AI assistant that answers questions **exclusively from your uploaded documents** — powered by **Google Gemini**, **Neo4j graph traversal**, and **FastAPI**.

No hallucinations. No outside knowledge. Just your documents.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [RAG Pipeline](#rag-pipeline)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development (Without Docker)](#local-development-without-docker)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Graph Database Schema](#graph-database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [Running Tests](#running-tests)
- [Linting & Formatting](#linting--formatting)
- [Database Migrations](#database-migrations)
- [Production Deployment](#production-deployment)
- [Makefile Shortcuts](#makefile-shortcuts)

---

## Overview

**Private AI Chat Tool** is a self-hosted, document-grounded AI Q&A system. It is designed for:

- 🏢 **Internal company knowledge bases** — securely chat with internal SOPs, policies, and manuals
- 🎓 **Student learning systems** — ask questions directly from course material
- 📄 **Document-based Q&A platforms** — build private, auditable AI assistants

### Core Guarantees

| Guarantee | How it's enforced |
|---|---|
| **Answers only from uploaded documents** | System prompt strictly forbids using outside knowledge; prompt-injection in documents is also blocked |
| **Per-user data isolation** | Every Neo4j node and Postgres row is tagged with `user_id`; all queries are scoped |
| **No vector embeddings** | Retrieval uses Neo4j graph traversal + keyword matching — zero ML inference at query time |
| **Privacy-first** | Files stay on your own server; Gemini API is only called for text generation (not storage) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client / Frontend                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │  Nginx (Reverse  │
              │     Proxy)       │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  FastAPI (API)   │  ← uvicorn / gunicorn
              │  /api/v1/...     │
              └───┬─────┬───────┘
                  │     │
         ┌────────┘     └──────────┐
         ▼                         ▼
┌─────────────────┐    ┌───────────────────┐
│   PostgreSQL     │    │   Neo4j 5          │
│  (Users, Docs,  │    │  (Knowledge Graph) │
│  Chat history)  │    │  Document→Chunk    │
└─────────────────┘    │  →Concept nodes    │
                       └───────────────────┘
         ▲
         │ async task
┌────────────────┐
│ Celery Worker  │  ← document processing pipeline
└────────┬───────┘
         │
┌────────┴───────┐
│  Redis          │  ← task broker + rate-limit store
└────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Google Gemini API       │
│  • Text generation       │
│  • Multimodal OCR (PDF)  │
└─────────────────────────┘
```

---

## RAG Pipeline

The Retrieval-Augmented Generation (RAG) pipeline runs in two phases:

### Phase 1 — Ingestion (background, triggered on upload)

```
User uploads file (PDF / DOCX / TXT)
         │
         ▼
  [1] Save file to disk
         │
         ▼
  [2] parse_document()
       • PDF  → PyMuPDF text extraction
               → Gemini multimodal OCR fallback (scanned pages)
       • DOCX → python-docx paragraph extraction
       • TXT  → raw UTF-8 read
         │
         ▼
  [3] chunk_text()
       • tiktoken-aware (cl100k_base)
       • 800-token windows, 120-token overlap
       • Tracks page number & section header per chunk
         │
         ▼
  [4] build_document_graph()  — writes to Neo4j
       • (:Document) node
       • (:Section) nodes per heading
       • (:Chunk) nodes per text window
       • (:Concept) nodes from NLP keyword extraction (spaCy)
       • Relationships: HAS_SECTION, HAS_CHUNK, MENTIONS, NEXT_CHUNK
         │
         ▼
  [5] Document.processing_status → "completed"  (Postgres)
```

### Phase 2 — Retrieval & Generation (real-time, on user question)

```
User sends question
         │
         ▼
  [1] extract_query_keywords()
       • spaCy lemmatisation (regex fallback)
         │
         ▼
  [2] Cypher graph traversal on Neo4j
       • Match keywords → Concept nodes → MENTIONS → Chunk nodes
       • Score chunks by number of matched concepts (relevance density)
       • Expand top chunks via NEXT_CHUNK edges (context window)
       • Fallback: content CONTAINS search if no concept matches
         │
         ▼
  [3] Format context string from top-K chunks
         │
         ▼
  [4] Gemini 2.5 Pro generates grounded answer
       • Temperature = 0.0 (deterministic)
       • Prompt explicitly forbids hallucination
       • Prompt-injection guard inside <documents> tags
         │
         ▼
  [5] Return answer + citations + source snippets
       • Saved to chat_messages table (Postgres)
       • Available as sync response or SSE stream
```

---

## Project Structure

```
document-ai/
└── backend/
    ├── app/
    │   ├── main.py                  # FastAPI app, lifespan hooks, middleware
    │   ├── api/
    │   │   └── v1/
    │   │       ├── api.py           # Route aggregation
    │   │       ├── deps.py          # Shared FastAPI dependencies
    │   │       └── endpoints/
    │   │           ├── auth.py      # Register, Login, Refresh, Logout
    │   │           ├── profile.py   # User profile CRUD
    │   │           ├── documents.py # Upload, List, Get, Delete documents
    │   │           ├── chat.py      # Ask (sync + stream), Sessions, Messages
    │   │           └── admin.py     # Admin: users, documents, stats
    │   ├── ai/
    │   │   ├── concept_extractor.py # spaCy keyword extraction (ingestion + query)
    │   │   ├── retrieval.py         # Neo4j graph traversal retrieval engine
    │   │   └── chat.py              # Gemini prompt construction + generation
    │   ├── core/
    │   │   ├── config.py            # Pydantic settings (reads .env)
    │   │   ├── security.py          # JWT creation/verification, password hashing
    │   │   ├── middleware.py        # Security headers, request IDs, rate limiting
    │   │   ├── logging_config.py    # Structured JSON logging
    │   │   └── redis.py             # Redis client + rate-limit helpers
    │   ├── db/
    │   │   ├── base_class.py        # SQLAlchemy declarative base
    │   │   ├── session.py           # Postgres async session factory
    │   │   └── neo4j.py             # Neo4j async driver + FastAPI dependency
    │   ├── models/                  # SQLAlchemy ORM models
    │   │   ├── user.py              # User (id, email, password_hash, role)
    │   │   ├── profile.py           # Profile (full_name, avatar, company)
    │   │   ├── document.py          # Document (metadata, processing_status)
    │   │   ├── chat.py              # ChatSession + ChatMessage
    │   │   ├── refresh_token.py     # RefreshToken (JTI, revocation)
    │   │   ├── audit.py             # AuditLog (admin actions)
    │   │   └── mixins.py            # TimestampMixin (created_at, updated_at)
    │   ├── schemas/                 # Pydantic request/response schemas
    │   │   ├── user.py
    │   │   ├── token.py
    │   │   ├── profile.py
    │   │   ├── document.py
    │   │   ├── chat.py
    │   │   └── admin.py
    │   ├── services/
    │   │   └── graph_builder.py     # Neo4j ingestion: builds full document graph
    │   ├── workers/
    │   │   ├── celery_app.py        # Celery configuration
    │   │   ├── tasks.py             # process_document_task (parse→chunk→graph)
    │   │   └── document_parser.py   # PDF/DOCX/TXT parsing + chunking
    │   └── tests/
    ├── alembic/                     # Database migrations
    ├── nginx/
    │   └── nginx.conf               # Reverse proxy config
    ├── storage/                     # Uploaded files (mounted volume)
    ├── docker-compose.yml           # Dev stack
    ├── docker-compose.prod.yml      # Production stack
    ├── Dockerfile
    ├── requirements.txt
    ├── Makefile
    ├── gunicorn_conf.py
    └── .env.example
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **API Framework** | FastAPI 0.111 (async, auto-docs) |
| **ASGI Server** | Uvicorn (dev) / Gunicorn + Uvicorn workers (prod) |
| **Relational DB** | PostgreSQL 16 (users, documents, chat history) |
| **Graph DB** | Neo4j 5 (knowledge graph — documents, chunks, concepts) |
| **ORM** | SQLAlchemy 2.0 (async) + Alembic migrations |
| **Cache / Broker** | Redis 7 (rate limiting + Celery broker/backend) |
| **Background Jobs** | Celery 5 (document processing pipeline) |
| **AI Model** | Google Gemini 2.5 Pro (text generation + multimodal OCR) |
| **NLP** | spaCy `en_core_web_sm` (keyword/concept extraction) |
| **Document Parsing** | PyMuPDF (PDF), python-docx (DOCX), built-in (TXT) |
| **Chunking** | tiktoken `cl100k_base` tokenizer |
| **Auth** | JWT (access + refresh tokens), bcrypt password hashing |
| **Monitoring** | Sentry (errors + performance traces) |
| **Reverse Proxy** | Nginx |
| **Containerisation** | Docker + Docker Compose |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) v2+
- A **Google Gemini API Key** — get one at [aistudio.google.com](https://aistudio.google.com)
- (Optional, for local dev) Python 3.11+

---

## Quick Start (Docker)

### 1. Clone the repository

```bash
git clone <your-repo-url> document-ai
cd document-ai/backend
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set at minimum:

```env
SECRET_KEY="replace-with-a-random-32+-character-string"
GEMINI_API_KEY="your-gemini-api-key-here"
```

All other defaults work out of the box with Docker Compose.

### 3. Start all services

```bash
docker-compose up --build
```

This starts:
| Service | Port | Purpose |
|---|---|---|
| `api` | `8000` | FastAPI application |
| `worker` | — | Celery document processor |
| `db` | `5432` | PostgreSQL 16 |
| `redis` | `6379` | Redis 7 |
| `neo4j` | `7474` / `7687` | Neo4j 5 (browser UI + Bolt) |

### 4. Run database migrations

```bash
docker-compose run --rm api alembic upgrade head
```

### 5. Download the spaCy NLP model (inside the container)

```bash
docker-compose run --rm api python -m spacy download en_core_web_sm
```

> ⚠️ If you skip this step, the system will fall back to a lightweight regex keyword extractor automatically — the pipeline still works but with slightly lower concept precision.

### 6. Verify everything is running

```bash
# Basic health
curl http://localhost:8000/health

# Deep health (checks Postgres + Redis + Neo4j)
curl http://localhost:8000/health/deep
```

Expected response:
```json
{
  "status": "ok",
  "database": "ok",
  "redis": "ok",
  "neo4j": "ok"
}
```

### 7. Open the interactive API docs

Visit **http://localhost:8000/api/v1/openapi.json** or the Swagger UI at **http://localhost:8000/docs**

### 8. Open the Neo4j Browser (optional)

Visit **http://localhost:7474** — log in with `neo4j` / `neo4j_password`

---

## Local Development (Without Docker)

### 1. Create a virtual environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 2. Start backing services

You still need Postgres, Redis, and Neo4j. The easiest way is to run only the infra services via Docker:

```bash
docker-compose up db redis neo4j
```

### 3. Configure `.env`

```env
POSTGRES_SERVER="localhost"
REDIS_URL="redis://localhost:6379/0"
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="neo4j_password"
GEMINI_API_KEY="your-key-here"
SECRET_KEY="at-least-32-chars"
UPLOAD_DIR="./storage/uploads"
```

### 4. Run migrations

```bash
alembic upgrade head
```

### 5. Start the API server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Start the Celery worker (separate terminal)

```bash
celery -A app.workers.celery_app worker --loglevel=info
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | ✅ | — | JWT signing key (min 32 chars) |
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key |
| `NEO4J_URI` | ✅ | `bolt://localhost:7687` | Neo4j Bolt connection URI |
| `NEO4J_USER` | ✅ | `neo4j` | Neo4j username |
| `NEO4J_PASSWORD` | ✅ | `neo4j_password` | Neo4j password |
| `POSTGRES_SERVER` | ✅ | `localhost` | PostgreSQL host |
| `POSTGRES_USER` | ✅ | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | ✅ | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | ✅ | `app_db` | PostgreSQL database name |
| `POSTGRES_PORT` | — | `5432` | PostgreSQL port |
| `REDIS_URL` | ✅ | `redis://localhost:6379/0` | Redis connection URL |
| `UPLOAD_DIR` | — | `/storage/uploads` | Path where uploaded files are stored |
| `MAX_UPLOAD_SIZE` | — | `26214400` (25 MB) | Maximum file upload size in bytes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | — | `15` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | — | `7` | Refresh token lifetime |
| `BACKEND_CORS_ORIGINS` | — | `[]` | JSON array of allowed CORS origins |
| `SENTRY_DSN` | — | `""` | Sentry DSN for error monitoring |
| `ENVIRONMENT` | — | `dev` | `dev` / `staging` / `prod` |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login (returns access + refresh tokens) |
| `POST` | `/auth/refresh` | Public | Exchange refresh token for new tokens |
| `POST` | `/auth/logout` | 🔒 User | Revoke current refresh token |
| `POST` | `/auth/logout-all` | 🔒 User | Revoke all refresh tokens |

**Register example:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

**Login example:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -F "username=user@example.com" \
  -F "password=yourpassword"
# Returns: {"access_token": "...", "refresh_token": "...", "token_type": "bearer"}
```

---

### Profile — `/profile`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/profile/me` | 🔒 User | Get current user's profile |
| `PUT` | `/profile/me` | 🔒 User | Update profile (name, avatar, company, timezone) |

---

### Documents — `/documents`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/documents/upload` | 🔒 User | Upload a PDF, DOCX, or TXT file |
| `GET` | `/documents` | 🔒 User | List all your documents |
| `GET` | `/documents/{id}` | 🔒 User | Get document details by ID |
| `DELETE` | `/documents/{id}` | 🔒 User | Delete document (removes file + graph) |

**Upload example:**
```bash
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/document.pdf"
```

After upload, the system returns immediately with `processing_status: "pending"`. The Celery worker processes it in the background — poll the `GET /documents/{id}` endpoint to check for `"completed"`.

**Supported file types:** `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`
**Max file size:** 25 MB

---

### Chat — `/chat`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/chat/ask` | 🔒 User | Ask a question (synchronous JSON response) |
| `POST` | `/chat/ask/stream` | 🔒 User | Ask a question (Server-Sent Events stream) |
| `GET` | `/chat/sessions` | 🔒 User | List all chat sessions |
| `GET` | `/chat/sessions/{id}/messages` | 🔒 User | Get all messages in a session |

**Ask a question (sync):**
```bash
curl -X POST http://localhost:8000/api/v1/chat/ask \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the key terms of the contract?"}'
```

Response:
```json
{
  "session_id": "uuid",
  "answer": "According to the contract (Section 3, Page 2)...",
  "citations": [
    {"source_index": 1, "document_id": "uuid"}
  ],
  "sources": [
    {
      "document_id": "uuid",
      "filename": "contract.pdf",
      "page_number": 2,
      "content_snippet": "The key terms include..."
    }
  ],
  "confidence_score": 0.95
}
```

**Continue in an existing session:**
```bash
curl -X POST http://localhost:8000/api/v1/chat/ask \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "<session-uuid>", "question": "Can you elaborate on clause 5?"}'
```

**Streaming (SSE):**
```bash
curl -N -X POST http://localhost:8000/api/v1/chat/ask/stream \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "Summarize this document."}'
```

---

### Admin — `/admin`

> Requires `role: admin`. Set a user as admin directly in the database, or seed one.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/users` | 🔑 Admin | List all registered users |
| `PATCH` | `/admin/users/{id}/status` | 🔑 Admin | Activate / deactivate a user |
| `GET` | `/admin/documents` | 🔑 Admin | List all documents (all users) |
| `DELETE` | `/admin/documents/{id}` | 🔑 Admin | Delete any document |
| `GET` | `/admin/stats` | 🔑 Admin | System stats (users, docs, chats today) |

**Get system stats:**
```bash
curl http://localhost:8000/api/v1/admin/stats \
  -H "Authorization: Bearer <admin_access_token>"
```

Response:
```json
{
  "total_users": 42,
  "total_docs": 128,
  "processed_docs": 125,
  "failed_docs": 3,
  "total_chats_today": 17
}
```

---

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Quick liveness check |
| `GET` | `/health/deep` | Checks Postgres + Redis + Neo4j connectivity |

---

## Graph Database Schema

The Neo4j graph represents each document as a structured knowledge graph:

```
(:Document {id, user_id, filename, original_name, mime_type, created_at})
    │
    └──[:HAS_SECTION]──▶ (:Section {name, document_id, user_id})
                                │
                                └──[:HAS_CHUNK]──▶ (:Chunk {
                                                       id,
                                                       document_id,
                                                       user_id,
                                                       chunk_index,
                                                       content,
                                                       page_number,
                                                       token_count,
                                                       section
                                                   })
                                                        │
                                                        ├──[:NEXT_CHUNK]──▶ (:Chunk)   # sequential
                                                        │
                                                        └──[:MENTIONS]──▶ (:Concept {name})
```

**Retrieval Cypher (simplified):**
```cypher
UNWIND $keywords AS kw
MATCH (k:Concept {name: kw})
      <-[:MENTIONS]-
      (c:Chunk {user_id: $user_id})
      <-[:HAS_CHUNK]-
      (s:Section)
      <-[:HAS_SECTION]-
      (d:Document {user_id: $user_id})
WITH c, d, count(k) AS relevance
ORDER BY relevance DESC
LIMIT 5
RETURN c.content, c.page_number, d.filename
```

---

## User Roles & Permissions

| Action | `user` | `admin` |
|---|---|---|
| Register / Login | ✅ | ✅ |
| Upload documents | ✅ | ✅ |
| View/delete own documents | ✅ | ✅ |
| Ask questions | ✅ | ✅ |
| View chat history | ✅ | ✅ |
| View **all** users | ❌ | ✅ |
| Activate/deactivate users | ❌ | ✅ |
| View/delete **all** documents | ❌ | ✅ |
| View system stats | ❌ | ✅ |

**Promote a user to admin (via psql):**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## Running Tests

```bash
# With Docker
make test

# Locally
pytest app/tests/ -v
```

---

## Linting & Formatting

```bash
# With Docker
make lint

# Locally
ruff check app
isort --check app
black --check app

# Auto-fix
ruff check app --fix
isort app
black app
```

---

## Database Migrations

```bash
# Apply all pending migrations
make migrate
# or
alembic upgrade head

# Create a new migration after model changes
python generate_migration.py "your migration description"
# or
alembic revision --autogenerate -m "your migration description"

# Downgrade one step
alembic downgrade -1
```

---

## Production Deployment

### 1. Use the production Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 2. Critical env var changes for production

```env
SECRET_KEY="<long-random-string-min-64-chars>"
GEMINI_API_KEY="<your-key>"
NEO4J_PASSWORD="<strong-password>"
POSTGRES_PASSWORD="<strong-password>"
ENVIRONMENT="prod"
SENTRY_DSN="<your-sentry-dsn>"
BACKEND_CORS_ORIGINS='["https://yourdomain.com"]'
```

### 3. Run migrations

```bash
docker-compose -f docker-compose.prod.yml run --rm api alembic upgrade head
```

### 4. Download spaCy model

```bash
docker-compose -f docker-compose.prod.yml run --rm api python -m spacy download en_core_web_sm
```

---

## Makefile Shortcuts

| Command | Description |
|---|---|
| `make dev` | Build and start all services with hot-reload |
| `make test` | Run the test suite |
| `make lint` | Run ruff + isort + black checks |
| `make migrate` | Apply Alembic migrations |
| `make shell` | Open a bash shell inside the API container |

---

## Security Notes

- **Rate limiting:** Login is limited to 5 attempts per 15 minutes per user+IP combination
- **Token rotation:** Refresh tokens are single-use and stored in Postgres with JTI tracking; logout immediately invalidates them
- **Prompt injection protection:** The LLM prompt explicitly instructs Gemini to treat all content inside `<documents>` tags as passive data only
- **User isolation:** Every Neo4j query filters by `user_id` — users can never retrieve content from another user's documents
- **File validation:** MIME type and file size are validated before any data is written to disk

---

## License

MIT License — see `LICENSE` for details.
