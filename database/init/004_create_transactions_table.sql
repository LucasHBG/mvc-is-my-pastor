-- 004_create_transactions_table.sql
-- Financial transactions table

USE mvc_pastor_db;

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    account_id BIGINT UNSIGNED NOT NULL,
    transaction_type ENUM('credit', 'debit', 'transfer') NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    running_balance DECIMAL(19, 4) NULL, -- Balance after this transaction
    description TEXT NULL,
    reference_number VARCHAR(100) UNIQUE NULL,
    external_reference VARCHAR(255) NULL, -- Reference from external systems
    category VARCHAR(100) NULL,
    subcategory VARCHAR(100) NULL,
    merchant_name VARCHAR(255) NULL,
    merchant_category VARCHAR(100) NULL,
    location VARCHAR(255) NULL,
    
    -- Related transaction for transfers
    related_transaction_id BIGINT UNSIGNED NULL,
    
    -- Transaction status
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed') DEFAULT 'completed',
    
    -- Dates
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    value_date DATE NULL, -- Date when transaction becomes effective
    posted_date TIMESTAMP NULL, -- Date when transaction was posted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Metadata
    metadata JSON NULL, -- Additional transaction data
    tags TEXT NULL, -- Comma-separated tags
    
    -- Foreign key constraints
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (related_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    
    -- Indexes for performance
    INDEX idx_transactions_account_id (account_id),
    INDEX idx_transactions_uuid (uuid),
    INDEX idx_transactions_reference (reference_number),
    INDEX idx_transactions_type (transaction_type),
    INDEX idx_transactions_status (status),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_value_date (value_date),
    INDEX idx_transactions_category (category),
    INDEX idx_transactions_merchant (merchant_name),
    INDEX idx_transactions_created_at (created_at),
    
    -- Composite indexes for common queries
    INDEX idx_transactions_account_date (account_id, transaction_date),
    INDEX idx_transactions_account_type (account_id, transaction_type),
    INDEX idx_transactions_account_status (account_id, status),
    INDEX idx_transactions_date_amount (transaction_date, amount),
    INDEX idx_transactions_category_date (category, transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
