# PrivateGPT

Secure enterprise-grade AI chat tool for internal knowledge bases.

## 📚 Documentation

For better understanding and management of the project, please refer to the following guides:

- 🏗️ **[Project Overview](./docs/PROJECT_OVERVIEW.md)**: Architecture, Tech Stack, and component details.
- 🚀 **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)**: Instructions for local setup and production deployment (Render).
- 🛠️ **[Troubleshooting](./docs/TROUBLESHOOTING.md)**: Fixes for common errors (Bedrock access, Redis, IDE settings).

---

## ⚡ Quick Start

### Backend
```bash
cd backend
python -m venv .venv
# Activate venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
