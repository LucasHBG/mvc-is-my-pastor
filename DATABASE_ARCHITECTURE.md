# Database Organization

## **Three-Tier Database Structure**

```
database/
├── schema/          # DDL - Data Definition Language (PRODUCTION)
│   ├── 001_create_database.sql
│   ├── ...
│
├── seeds/           # System/Reference Data (PRODUCTION)
│   └── 001_default_categories.sql
│
└── fixtures/        # Test/Development Data (DEV ONLY)
    └── 001_sample_data.sql
```

## **Hierarchy tips**

### **1. Environment Separation**
- **Production**: Only `schema/` + `seeds/` (essential data only)
- **Development**: All folders (including sample data for testing)
- **CI/CD**: Can exclude `fixtures/` in production deployments

### **2. Team Collaboration**
- **Database Administrators**: Own `schema/` files
- **Product/Business Team**: Own `seeds/` files
- **Developers**: Own `fixtures/` files (test data, sampls)

### **3. Version Control & Code Review**
- **Schema changes**: Require DBA approval, structural impact analysis
- **Seed changes**: Product team review, business logic validation
- **Fixture changes**: Minimal review, development-only impact

### **4. CI/CD Pipeline Integration**
```yaml
# Production Deployment
production:
  - Execute schema/ scripts    ✅ Always
  - Execute seeds/ scripts     ✅ Always 
  - Skip fixtures/ scripts     ❌ Never

# Staging/Development
staging:
  - Execute schema/ scripts    ✅ Always
  - Execute seeds/ scripts     ✅ Always
  - Execute fixtures/ scripts  ✅ Always
```

## **Implementation Details**

### **Setup Scripts**

1. **Standard Setup** (Docker auto-init):
   ```bash
   ./setup-database.sh              # All environments
   ```

2. **Environment-Specific Control**:
   ```bash
   ./setup-database-production.sh   # Schema + Seeds only
   ./setup-database.sh  # Schema + Seeds + Fixtures (Dev)
   ```

3. **Makefile Integration**:
   ```bash
   make db-setup     # Full setup
   make db-prod      # Production setup
   make db-reset     # Reset database
   make db-down      # Stop containers
   ```

### **Docker Integration**
```yaml
# docker-compose.yml mounts each directory separately
volumes:
  - ./database/schema:/docker-entrypoint-initdb.d/01-schema
  - ./database/seeds:/docker-entrypoint-initdb.d/02-seeds  
  - ./database/fixtures:/docker-entrypoint-initdb.d/03-fixtures
```

**Execution Order**: `01-schema` → `02-seeds` → `03-fixtures`

## **File Naming Conventions**

### **Schema Files** (Structural):
- Format: `001_create_tablename.sql`
- Purpose: Database structure (tables, indexes, views)
- Review: Requires DBA approval
- Environment: All environments

### **Seed Files** (System Data):
- Format: `001_descriptive_name.sql`
- Purpose: System/reference data (categories, settings etc)
- Review: Product team approval
- Environment: All environments

### **Fixture Files** (Test Data):
- Format: `001_descriptive_name.sql` 
- Purpose: Sample/test data (demo users, transactions etc)
- Review: Minimal, developer-focused
- Environment: Development/testing only