# Deployment Guide

This document outlines the steps to set up and deploy the PrivateGPT platform both locally and to production environments like Render.

## 💻 Local Development Setup

### 1. Backend Setup
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv .venv`.
3. Activate it: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`.
5. Configure `.env`: Copy `.env.example` to `.env` and fill in the required keys.
6. Run migrations: `alembic upgrade head`.
7. Start the server: `uvicorn app.main:app --reload`.

### 2. Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

---

## 🚀 Production Deployment (Render)

The project is pre-configured for Render using `render.yaml`.

### 1. Prerequisites
- A GitHub repository with the code.
- A Render account.
- Instances of:
    - **PostgreSQL** (Managed by Render).
    - **Redis** (Managed by Render).
    - **Neo4j** (AuraDB or self-hosted).

### 2. Deployment Steps
1. Connect your GitHub repo to Render.
2. Render will automatically detect the `render.yaml` file and set up the blueprint.
3. **Environment Variables**: Ensure all variables in `backend/.env` are added to the Render "Secret Group" or individual service settings.
4. **Build Command**: `pip install -r requirements.txt`.
5. **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker app.main:app`.

### 📦 Docker Deployment
You can also use the provided `docker-compose.yml` for a containerized setup:
```bash
docker-compose up --build
```

---

## 🔑 Required Environment Variables

| Variable | Description |
| --- | --- |
| `SECRET_KEY` | Generate with `openssl rand -hex 32` |
| `POSTGRES_SERVER` | Database host |
| `REDIS_URL` | Redis connection string |
| `AWS_ACCESS_KEY_ID` | AWS IAM Key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret |
| `NEO4J_URI` | Neo4j connection string |
