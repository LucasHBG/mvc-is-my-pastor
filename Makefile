# Makefile for MVC Pastor Monorepo
# Usage: make <target>

# Default target
.DEFAULT_GOAL := help

# Help target - shows available commands
help:
	@echo "MVC Pastor Monorepo - Available targets:"
	@echo ""
	@echo "🏗️  Infrastructure:"
	@echo "  db-setup      - Setup database (schema + seeds + fixtures)"
	@echo "  db-prod       - Setup production database (schema + seeds only)"
	@echo "  db-reset      - Reset database (WARNING: deletes all data)"
	@echo "  db-down       - Stop database containers"
	@echo ""
	@echo "🎯 Frontend (delegated to client/):"
	@echo "  client-install    - Install frontend dependencies"
	@echo "  client-dev        - Start Angular development server"
	@echo "  client-build      - Build frontend for production"
	@echo "  client-test       - Run frontend tests"
	@echo "  client-setup-env  - Setup frontend environment files"
	@echo ""
	@echo "🚀 Full Stack:"
	@echo "  dev           - Start both database and frontend"
	@echo "  setup-all     - Complete setup (database + frontend)"
	@echo "  clean-all     - Clean all build artifacts"
	@echo ""
	@echo "📚 Documentation:"
	@echo "  help          - Show this help message"

# Frontend targets (delegate to client/)
client-install:
	@echo "📦 Installing frontend dependencies..."
	cd client && make install

client-dev:
	@echo "🚀 Starting Angular development server..."
	cd client && make dev

client-build:
	@echo "🏗️  Building frontend for production..."
	cd client && make build

client-test:
	@echo "🧪 Running frontend tests..."
	cd client && make test

client-setup-env:
	@echo "⚙️  Setting up frontend environment..."
	cd client && make setup-env

client-clean:
	@echo "🧹 Cleaning frontend artifacts..."
	cd client && make clean

# Full stack development
dev:
	@echo "🚀 Starting full development environment..."
	@echo "📀 Starting database..."
	./setup-database.sh
	@echo "🎯 Starting frontend (will open in new process)..."
	cd client && make dev

# Complete setup for new developers
setup-all:
	@echo "🎯 Complete monorepo setup..."
	@echo "📀 Setting up database..."
	./setup-database.sh
	@echo "� Installing frontend dependencies..."
	cd client && make install
	@echo "⚙️  Setting up frontend environment..."
	cd client && make setup-env
	@echo ""
	@echo "✅ Full setup complete!"
	@echo "💡 Use 'make dev' to start development"

# Clean everything
clean-all:
	@echo "🧹 Cleaning all artifacts..."
	cd client && make clean
	docker-compose down -v
	@echo "✅ All artifacts cleaned"

# Database targets
db-setup:
	@echo "🔧 Setting up database (all environments)..."
	./setup-database.sh

db-prod:
	@echo "🏭 Setting up production database (schema + seeds only)..."
	./setup-database-production.sh

db-reset:
	@echo "⚠️  WARNING: This will delete ALL database data!"
	@read -p "Are you sure? (y/N): " -n 1 -r; \
	echo; \
	if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		docker-compose down -v; \
		echo "🗑️  Database reset completed"; \
	else \
		echo "Operation cancelled"; \
	fi

db-down:
	@echo "⏹️  Stopping database containers..."
	docker-compose down

# Full setup for new developers
setup: install setup-env
	@echo ""
	@echo "🎉 Setup complete!"
	@echo "📖 Remember to update environment files with your Google Client IDs"
	@echo "📚 See ENVIRONMENT_SETUP.md for details"

# Phony targets (not files)
.PHONY: help dev setup-all clean-all client-install client-dev client-build client-test client-setup-env client-clean db-setup db-prod db-reset db-down
