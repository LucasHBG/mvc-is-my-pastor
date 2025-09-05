# Database Schema Documentation

## Overview

The MVC is My Pastor database has been designed following enterprise-level best practices for financial applications. The schema supports comprehensive financial management with security, audit trails, and performance optimization.

## Design Principles

### 1. **Security First**
- Sensitive data (card numbers, CVVs) are hashed
- UUID columns for external references
- Audit trail for all critical operations
- Soft deletes to preserve data integrity

### 2. **Performance Optimized**
- Strategic indexing for common query patterns
- Composite indexes for complex queries
- Database views for frequently accessed data
- Proper data types for optimal storage

### 3. **Scalability Ready**
- BIGINT primary keys for future growth
- Partitioning-ready structure
- Normalized design with minimal redundancy
- JSON columns for flexible metadata

### 4. **Financial Industry Standards**
- DECIMAL(19,4) for monetary values (supports up to 999 trillion with 4 decimal places)
- International banking support (IBAN, SWIFT codes)
- Multi-currency support
- Comprehensive transaction categorization

## Core Entities

### Users
- Authentication (email/password + Google OAuth)
- Profile management
- Company affiliation
- Activity tracking

### Accounts
- Multiple account types (checking, savings, business, credit, investment)
- Multi-currency support
- International banking standards
- Primary account designation

### Transactions
- Complete transaction lifecycle
- Running balance calculation
- Transfer support between accounts
- Rich categorization and metadata
- Status tracking (pending, completed, failed, etc.)

### Cards
- Secure card management
- Spending limits and controls
- International and contactless settings
- Card brand and type support

### Categories
- Hierarchical structure (parent/child)
- System and user-defined categories
- Visual customization (colors, icons)
- Income/expense/transfer classification

### Budgets
- Flexible period types (weekly, monthly, quarterly, yearly, custom)
- Category-based allocation
- Spending tracking
- Multi-currency support

### Audit Logs
- Complete user action tracking
- Resource change history
- IP and user agent logging
- Compliance ready

## Advanced Features

### Database Views
- `account_summary`: Real-time account overview with statistics
- `recent_transactions`: Enriched transaction feed
- `monthly_spending`: Analytics and spending patterns

### Indexes
- Single column indexes for common filters
- Composite indexes for complex queries
- Unique constraints for data integrity
- Foreign key relationships

### JSON Support
- Transaction metadata storage
- Flexible data structures
- Future-proof extensibility

## File Organization

The initialization scripts are organized numerically:

```
001-099: Core Schema Creation
├── 001_create_database.sql
├── 002_create_users_table.sql
├── 003_create_accounts_table.sql
├── 004_create_transactions_table.sql
├── 005_create_cards_table.sql
├── 006_create_categories_table.sql
├── 007_create_budgets_table.sql
├── 008_create_audit_log_table.sql
└── 009_create_views.sql

900-999: Data Population
├── 900_insert_default_categories.sql
└── 901_insert_sample_data.sql
```

## Future Extensions

The schema is designed to support future enhancements:

- **Investment Tracking**: Portfolio management, stock transactions
- **Loan Management**: Loan accounts, payment schedules
- **Business Features**: Invoicing, expense reports, tax categorization
- **Analytics**: Advanced reporting, forecasting, insights
- **Multi-tenant**: Company/organization support
- **API Integration**: Bank connectivity, payment processors

## Production Considerations

### Security
- Use environment variables for all credentials
- Enable SSL/TLS for database connections
- Implement proper backup encryption
- Regular security audits

### Performance
- Monitor query performance
- Implement query caching
- Consider read replicas for analytics
- Partition large tables as needed

### Compliance
- Data retention policies
- GDPR compliance (user data deletion)
- Financial regulation compliance
- Audit trail preservation

## Sample Data

The database includes comprehensive sample data for development:
- 4 sample users with different profiles
- 9 accounts across various types
- 20+ transactions with realistic scenarios
- 5 payment cards with different configurations
- 25+ categories with hierarchical structure

This provides a realistic development environment that mirrors production usage patterns.
