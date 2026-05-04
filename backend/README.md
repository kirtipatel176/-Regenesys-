# Private AI Chat Tool - Backend

This is the backend for the Private AI Chat Tool. It provides a robust, asynchronous REST API for user authentication, document uploading and chunking, and AI-powered Q&A using the Gemini API.

## Tech Stack
- **Framework:** FastAPI
- **Database:** PostgreSQL with `pgvector`
- **ORM:** SQLAlchemy 2.0 (async)
- **Migrations:** Alembic
- **Background Jobs:** Celery & Redis
- **AI Integration:** Google Gemini (Generative AI SDK)
- **Document Parsing:** PyMuPDF & python-docx

## Setup

1. Copy `.env.example` to `.env` and fill in the values, especially `GEMINI_API_KEY`.
   ```bash
   cp .env.example .env
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Run migrations (in a new terminal):
   ```bash
   docker-compose exec api alembic upgrade head
   ```

## Development

- API runs on `http://localhost:8000`
- Swagger UI available at `http://localhost:8000/docs`

### Commands
Generate a new migration:
```bash
docker-compose exec api alembic revision --autogenerate -m "Description"
```

## Production Deployment

The project is fully prepared for scale out utilizing `docker-compose.prod.yml`, Nginx, Gunicorn, and Redis limits.

1. **Environment Setup**
Copy `.env.prod` to `.env` and assign secure credentials (specifically `SECRET_KEY`, `SENTRY_DSN`, and `GEMINI_API_KEY`).

2. **Boot the Cluster**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

3. **Run Migrations**
```bash
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
```

4. **Monitoring & Backups**
- Sentry integration automatically hooks into FastAPI via `SENTRY_DSN`
- JSON Structured logging handles stdout logs natively.
- Use `bash scripts/backup_db.sh` to extract a full Postgres vector dump locally.

