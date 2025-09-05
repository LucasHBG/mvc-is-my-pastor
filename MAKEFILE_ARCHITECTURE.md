# Makefile Architecture - Monorepo Structure

## Overview

The MVC Pastor monorepo uses a **two-tier Makefile architecture** that separates concerns between infrastructure and frontend development:

```
mvc-is-my-pastor/
├── Makefile              # 🏗️  Monorepo orchestrator (Database + Full Stack)
└── client/
    └── Makefile          # 🎯 Frontend-specific (Angular)
```

## **Root Makefile** (`/Makefile`)

**Purpose**: Infrastructure, database management, and full-stack orchestration

### Infrastructure Commands
```bash
make db-setup         # Setup database (schema + seeds + fixtures)
make db-prod          # Production database (schema + seeds only)
make db-reset         # Reset database (WARNING: deletes data)
make db-down          # Stop database containers
```

### Frontend Delegation
```bash
make client-install   # cd client && make install
make client-dev       # cd client && make dev
make client-build     # cd client && make build
make client-test      # cd client && make test
make client-setup-env # cd client && make setup-env
```

### Full Stack Commands
```bash
make dev              # Start database + frontend together
make setup-all        # Complete setup (database + frontend)
make clean-all        # Clean all artifacts (database + frontend)
```

## **Client Makefile** (`/client/Makefile`)

**Purpose**: Angular-specific development tasks

### Frontend Commands
```bash
make install          # Install npm dependencies
make dev              # Start Angular development server
make build            # Production build
make build-dev        # Development build
make test             # Run tests
make lint             # Run linter
make setup-env        # Create environment files
make clean            # Clean build artifacts
make security-check   # Check for credential leaks
```

## **Benefits of This Architecture**

### **1. Clear Separation of Concerns**
- **Root**: Infrastructure, database, full-stack coordination
- **Client**: Frontend-specific development tasks
- **Server(Future)**: Server Makefile can be added for backend tasks

## **Usage Patterns**

### **New Developer Setup**
```bash
# From root - sets up everything
make setup-all
```

### **Daily Development**
```bash
# Full stack development
make dev

# Or frontend only
cd client && make dev
```

### **Production Deployment**
```bash
# Database setup
make db-prod

# Frontend build
make client-build
```

### **CI/CD Pipeline**
```yaml
# Example CI workflow
steps:
  - name: Setup Database
    run: make db-prod
    
  - name: Build Frontend  
    run: make client-build
    
  - name: Test Frontend
    run: make client-test
```

## **Future Expansion**

When the server is added:

```
mvc-is-my-pastor/
├── Makefile              # Orchestrator
├── client/Makefile       # Frontend
└── server/Makefile       # Backend (NestJS)
```

Root Makefile can then coordinate all three layers:
```bash
make dev              # Start database + frontend + backend
make server-dev       # cd server && make dev
make server-build     # cd server && make build
```

## **Best Practices**

### **From Root Directory**
- Use `make dev` for full development
- Use `make db-*` for database management
- Use `make client-*` for frontend tasks

### **From Client Directory**
- Use `make dev` for frontend-only development
- Use `make build` for production builds
- Use `make test` for testing