# Project Overview: PrivateGPT

PrivateGPT is a secure, enterprise-grade AI chat tool designed for interacting with internal knowledge bases using Retrieval-Augmented Generation (RAG). It allows users to upload documents, which are then parsed, indexed into a graph database (Neo4j), and used to provide context-aware responses via Large Language Models (LLMs).

## 🏗️ Architecture

The project follows a modern decoupled architecture:

### 1. Backend (FastAPI)
- **Framework**: FastAPI (Python 3.10+)
- **API Style**: RESTful with OAuth2 + JWT authentication.
- **Key Components**:
    - `app/api`: Request handlers and endpoints.
    - `app/ai`: LLM provider abstractions (Gemini, AWS Bedrock).
    - `app/services`: Business logic (OTP, RAG, Graph building).
    - `app/workers`: Background tasks (Celery) for heavy document processing.

### 2. Frontend (React)
- **Framework**: React with Vite.
- **Styling**: TailwindCSS (or Vanilla CSS with modern aesthetics).
- **Icons**: Lucide-React.
- **State Management**: React Context API (Auth, Document state).

### 3. Databases & Infrastructure
- **PostgreSQL**: Stores relational data (Users, Tokens, Document metadata).
- **Neo4j**: Graph database storing document chunks and semantic relationships for RAG.
- **Redis**: Used as a Celery broker, cache, and for rate-limiting.
- **AWS Bedrock**: Foundation model provider (Claude 3.5 Sonnet).

## 🛠️ Tech Stack Summary

| Component | Technology |
| --- | --- |
| **Backend** | FastAPI, SQLAlchemy, Pydantic, Celery |
| **Frontend** | React, Framer Motion, Axios |
| **Primary LLM** | AWS Bedrock (Claude 3.5 Sonnet) |
| **Graph DB** | Neo4j |
| **Vector/Relational DB** | PostgreSQL |
| **Task Queue** | Redis + Celery |

## 📁 Key Directories

- `backend/app`: Core backend application logic.
- `frontend/src`: React components and pages.
- `backend/alembic`: Database migrations.
- `backend/scratch`: Diagnostic scripts and integration tests.
