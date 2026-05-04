.PHONY: dev test lint migrate shell

dev:
	docker-compose up --build

test:
	docker-compose run --rm api pytest app/tests/ -v

lint:
	docker-compose run --rm api bash -c "ruff check app && isort --check app && black --check app"

migrate:
	docker-compose run --rm api alembic upgrade head

shell:
	docker-compose run --rm api bash
