-- 003_create_accounts_table.sql
-- Financial accounts table

USE mvc_pastor_db;

CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id BIGINT UNSIGNED NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type ENUM('checking', 'savings', 'business', 'credit', 'investment') DEFAULT 'checking',
    balance DECIMAL(19, 4) DEFAULT 0.0000, -- Higher precision for financial calculations
    available_balance DECIMAL(19, 4) DEFAULT 0.0000,
    currency VARCHAR(3) DEFAULT 'USD',
    iban VARCHAR(34) NULL, -- International Bank Account Number
    swift_code VARCHAR(11) NULL, -- SWIFT/BIC code
    routing_number VARCHAR(9) NULL, -- US routing number
    bank_name VARCHAR(255) NULL,
    branch_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_accounts_user_id (user_id),
    INDEX idx_accounts_uuid (uuid),
    INDEX idx_accounts_account_number (account_number),
    INDEX idx_accounts_type (account_type),
    INDEX idx_accounts_active (is_active),
    INDEX idx_accounts_primary (is_primary),
    INDEX idx_accounts_created_at (created_at),
    
    -- Composite indexes
    INDEX idx_accounts_user_active (user_id, is_active),
    INDEX idx_accounts_user_type (user_id, account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
