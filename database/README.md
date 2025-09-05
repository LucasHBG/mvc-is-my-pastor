# Database Architecture - MVC Pastor

## Directory Structure

```
database/
├── schema/              # DDL - Data Definition Language (Production)
│   ├── 001_create_database.sql
│   ├── 002_create_users_table.sql
│   ├── 003_create_accounts_table.sql
│   ├── 004_create_transactions_table.sql
│   ├── 005_create_cards_table.sql
│   ├── 006_create_categories_table.sql
│   ├── 007_create_budgets_table.sql
│   ├── 008_create_audit_log_table.sql
│   └── 009_create_views.sql
├── seeds/               # System/Static data (Production)
│   └── 001_default_categories.sql
└── fixtures/            # Test/Development data (Dev only)
    └── 001_sample_data.sql
```

## Quick Start

### Standard Setup (Recommended)
```bash
./setup-database.sh              # Full Docker auto-setup
```

### Environment-Specific Setup
```bash
./setup-database-production.sh   # Schema + Seeds only
./setup-database-development.sh  # Schema + Seeds + Fixtures
```

## Execution Order

### Production Environment
1. **Schema** (`database/schema/`): Creates database structure
2. **Seeds** (`database/seeds/`): Inserts system data (categories, settings)

### Development Environment
1. **Schema** (`database/schema/`): Creates database structure
2. **Seeds** (`database/seeds/`): Inserts system data
3. **Fixtures** (`database/fixtures/`): Adds sample users, accounts, transactions
   docker-compose up -d
   ```

## Services

### MySQL Database
- **Port**: 3306
- **Database**: mvc_pastor_db
- **User**: mvc_user
- **Password**: Set in .env file

### phpMyAdmin (Web Interface)
- **URL**: http://localhost:8080
- **Login**: Use database credentials from .env file

## Database Schema

The database follows best practices with proper organization:

### Core Tables

#### Users (`users`)
- User authentication and profile information
- Supports both email/password and Google OAuth
- UUID for external references
- Soft deletes and audit fields

#### Accounts (`accounts`)
- Financial accounts (checking, savings, business, credit, investment)
- International banking support (IBAN, SWIFT)
- Multiple currencies
- Account hierarchy and primary account designation

#### Transactions (`transactions`)
- Complete transaction history with running balances
- Support for transfers between accounts
- Rich metadata and categorization
- Comprehensive indexing for performance

#### Cards (`cards`)
- Payment card management with security features
- Card limits and controls
- Contactless and international settings
- Secure storage of sensitive data (hashed)

#### Categories (`categories`)
- Hierarchical category system
- System and user-defined categories
- Visual customization (colors, icons)
- Income, expense, and transfer categories

### Advanced Features

#### Budgets (`budgets`, `budget_categories`)
- Flexible budget periods
- Category-based budget allocation
- Spending tracking and alerts

#### Audit Logs (`audit_logs`)
- Complete audit trail for security
- User action tracking
- Resource change history

### Database Views

#### `account_summary`
- Account overview with transaction statistics
- Real-time balance calculations

#### `recent_transactions`
- Recent transaction feed with enriched data
- Category information and account details

#### `monthly_spending`
- Monthly spending analytics by category
- User spending patterns and trends

## Initialization Scripts

The database uses a structured initialization approach:

```
init/
├── 001_create_database.sql       # Database creation
├── 002_create_users_table.sql    # Users and authentication
├── 003_create_accounts_table.sql # Financial accounts
├── 004_create_transactions_table.sql # Transaction history
├── 005_create_cards_table.sql    # Payment cards
├── 006_create_categories_table.sql # Transaction categories
├── 007_create_budgets_table.sql  # Budget management
├── 008_create_audit_log_table.sql # Audit trail
├── 009_create_views.sql          # Database views
├── 900_insert_default_categories.sql # System categories
└── 901_insert_sample_data.sql    # Sample data for development
```

### Script Naming Convention
- `001-099`: Core schema creation
- `100-199`: Indexes and constraints
- `200-299`: Stored procedures and functions
- `300-399`: Triggers
- `400-499`: Additional features
- `900-999`: Data insertion (categories, sample data)

## Management Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f mysql

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d

# Access MySQL CLI
docker exec -it mvc-pastor-mysql mysql -u mvc_user -p mvc_pastor_db
```

## Environment Variables

Required variables in `.env` file:
- `MYSQL_ROOT_PASSWORD` - Root password for MySQL
- `MYSQL_DATABASE` - Database name
- `MYSQL_USER` - Application user
- `MYSQL_PASSWORD` - Application user password

## Security Features

- **Encrypted sensitive data**: Card numbers and CVVs are hashed
- **UUID external references**: No direct ID exposure
- **Comprehensive indexing**: Optimized for performance
- **Audit trail**: Complete action logging
- **Soft deletes**: Data preservation with logical deletion
- **Proper constraints**: Foreign keys and data integrity

## Performance Optimizations

- **Strategic indexing**: Covering common query patterns
- **Composite indexes**: Multi-column queries
- **Proper data types**: Optimized storage
- **Views**: Pre-computed common queries
- **Partitioning ready**: Structure supports future partitioning

## Connection String

For the future server application:
```
mysql://mvc_user:password@localhost:3306/mvc_pastor_db
```

## Backup and Restore

```bash
# Backup
docker exec mvc-pastor-mysql mysqldump -u mvc_user -p mvc_pastor_db > backup.sql

# Restore
docker exec -i mvc-pastor-mysql mysql -u mvc_user -p mvc_pastor_db < backup.sql
```
