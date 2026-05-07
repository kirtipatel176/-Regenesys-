# Troubleshooting & Known Issues

This guide covers common problems encountered during development and deployment, and how to fix them.

## 🔴 Common Errors

### 1. AWS Bedrock: `ResourceNotFoundException`
- **Problem**: You receive an "Access Denied" or "Legacy Model" error when calling Claude models.
- **Cause**: Model access is not enabled in your AWS region.
- **Fix**: 
    1. Log in to the [AWS Console (us-east-1)](https://us-east-1.console.aws.amazon.com/bedrock/home).
    2. Go to **Bedrock > Model access**.
    3. Click **Edit** and Request access for **Anthropic Claude 3.5 Sonnet**.

### 2. Redis Connection Failed (`getaddrinfo failed`)
- **Problem**: The backend logs show an error connecting to `red-xxxxx:6379`.
- **Cause**: You are trying to connect to a private Render Redis URL from your local machine.
- **Fix**: Update `REDIS_URL` in your `.env` to a local Redis instance (`redis://localhost:6379`) or a public endpoint.

### 3. IDE: `Cannot find module 'sqlalchemy'`
- **Problem**: Your editor (VS Code) shows red squiggles under imports even though packages are installed.
- **Cause**: The IDE is using the system Python instead of the virtual environment.
- **Fix**: Press `Ctrl+Shift+P`, type **"Python: Select Interpreter"**, and choose the one in `backend/.venv/`.

### 4. SQLAlchemy: `Unexpected keyword argument` in Models
- **Problem**: IDE warns about `User(email=...)` not taking arguments.
- **Cause**: Static analysis failure with SQLAlchemy's declarative base.
- **Fix**: We have added explicit `__init__` methods to the models to resolve this for IDEs.

## 📝 Diagnostic Tools

Use the scripts in `backend/scratch/` to verify individual components:
- `test_bedrock_integration.py`: Tests the LLM connection.
- `check_admin_id.py`: Verifies admin user exists in Postgres.
- `check_neo4j.py`: Verifies graph database connectivity.

## 🛠️ Still Having Issues?
Check the logs using:
```bash
# Backend logs
docker-compose logs backend
# Or if running locally
tail -f backend/app.log
```
