#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="backend-db-1"
DB_USER="postgres"
DB_NAME="app_db"

mkdir -p "$BACKUP_DIR"
echo "Starting database backup..."

docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -Fc "$DB_NAME" > "$BACKUP_DIR/db_backup_$TIMESTAMP.dump"

echo "Backup completed successfully: $BACKUP_DIR/db_backup_$TIMESTAMP.dump"
