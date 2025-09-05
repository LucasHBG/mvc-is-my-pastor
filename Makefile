# Makefile for Angular Qonto Project
# Usage: make <target>

# Variables
NODE_MODULES = node_modules
DIST_DIR = dist
SRC_ENV = src/environments
TEMPLATE_ENV = $(SRC_ENV)/environment.template.ts
TEMPLATE_PROD = $(SRC_ENV)/environment.prod.template.ts
ENV_FILE = $(SRC_ENV)/environment.ts
PROD_ENV_FILE = $(SRC_ENV)/environment.prod.ts

# Default target
.DEFAULT_GOAL := help

# Help target - shows available commands
help:
	@echo "Available targets:"
	@echo "  setup-env     - Create environment files from templates"
	@echo "  install       - Install npm dependencies"
	@echo "  dev           - Start development server"
	@echo "  build         - Build for production"
	@echo "  build-dev     - Build for development"
	@echo "  test          - Run tests"
	@echo "  lint          - Run linter"
	@echo "  clean         - Clean build artifacts"
	@echo "  clean-env     - Remove environment files (keeps templates)"
	@echo "  security-check - Check for potential credential leaks"
	@echo "  help          - Show this help message"

# Install dependencies
install: $(NODE_MODULES)

$(NODE_MODULES): package.json package-lock.json
	npm install
	@touch $(NODE_MODULES)

# Environment setup (dependency-based)
setup-env: $(ENV_FILE) $(PROD_ENV_FILE)

$(ENV_FILE): $(TEMPLATE_ENV)
	@if [ -f "$(ENV_FILE)" ]; then \
		echo "⚠️  $(ENV_FILE) already exists"; \
		read -p "Overwrite? (y/N): " -n 1 -r; \
		echo; \
		if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
			cp $(TEMPLATE_ENV) $(ENV_FILE); \
			echo "✅ Created $(ENV_FILE) from template"; \
		else \
			echo "Skipped $(ENV_FILE)"; \
		fi \
	else \
		cp $(TEMPLATE_ENV) $(ENV_FILE); \
		echo "✅ Created $(ENV_FILE) from template"; \
	fi

$(PROD_ENV_FILE): $(TEMPLATE_PROD)
	@if [ -f "$(PROD_ENV_FILE)" ]; then \
		echo "⚠️  $(PROD_ENV_FILE) already exists"; \
		read -p "Overwrite? (y/N): " -n 1 -r; \
		echo; \
		if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
			cp $(TEMPLATE_PROD) $(PROD_ENV_FILE); \
			echo "✅ Created $(PROD_ENV_FILE) from template"; \
		else \
			echo "Skipped $(PROD_ENV_FILE)"; \
		fi \
	else \
		cp $(TEMPLATE_PROD) $(PROD_ENV_FILE); \
		echo "✅ Created $(PROD_ENV_FILE) from template"; \
	fi

# Development server
dev: $(NODE_MODULES) $(ENV_FILE)
	ng serve

# Production build
build: $(NODE_MODULES) $(PROD_ENV_FILE)
	ng build --configuration production

# Development build
build-dev: $(NODE_MODULES) $(ENV_FILE)
	ng build --configuration development

# Test
test: $(NODE_MODULES)
	ng test

# Lint
lint: $(NODE_MODULES)
	ng lint

# Clean build artifacts
clean:
	rm -rf $(DIST_DIR)
	rm -rf .angular/cache

# Clean environment files (keep templates)
clean-env:
	@if [ -f "$(ENV_FILE)" ]; then \
		echo "Removing $(ENV_FILE)"; \
		rm $(ENV_FILE); \
	fi
	@if [ -f "$(PROD_ENV_FILE)" ]; then \
		echo "Removing $(PROD_ENV_FILE)"; \
		rm $(PROD_ENV_FILE); \
	fi
	@echo "✅ Environment files cleaned (templates preserved)"

# Security check for credentials
security-check:
	@echo "🔍 Checking for potential credential leaks..."
	@if find $(SRC_ENV) -name "*.ts" -not -name "*.template.ts" -exec grep -l "googleusercontent\|apps\.googleusercontent" {} \; | grep -q .; then \
		echo "⚠️  WARNING: Found potential real Google Client IDs!"; \
		find $(SRC_ENV) -name "*.ts" -not -name "*.template.ts" -exec grep -l "googleusercontent\|apps\.googleusercontent" {} \;; \
		echo "Please verify these files don't contain real credentials."; \
	else \
		echo "✅ No credential leaks detected"; \
	fi

# Full setup for new developers
setup: install setup-env
	@echo ""
	@echo "🎉 Setup complete!"
	@echo "📖 Remember to update environment files with your Google Client IDs"
	@echo "📚 See ENVIRONMENT_SETUP.md for details"

# Phony targets (not files)
.PHONY: help install setup-env dev build build-dev test lint clean clean-env security-check setup
