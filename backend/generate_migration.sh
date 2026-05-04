#!/bin/bash
set -e
docker compose up -d db
echo "Waiting for DB to start..."
sleep 3
docker compose run --rm api pip install pgvector
docker compose run --rm api alembic revision --autogenerate -m "Initial schema"
