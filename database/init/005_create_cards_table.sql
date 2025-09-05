-- 005_create_cards_table.sql
-- Payment cards table

USE mvc_pastor_db;

CREATE TABLE IF NOT EXISTS cards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    account_id BIGINT UNSIGNED NOT NULL,
    card_number_hash VARCHAR(255) NOT NULL, -- Hashed card number for security
    card_last_four CHAR(4) NOT NULL, -- Last 4 digits for display
    card_type ENUM('debit', 'credit', 'prepaid', 'virtual') DEFAULT 'debit',
    card_brand ENUM('visa', 'mastercard', 'amex', 'discover', 'other') NULL,
    cardholder_name VARCHAR(255) NOT NULL,
    expiry_month TINYINT UNSIGNED NOT NULL,
    expiry_year SMALLINT UNSIGNED NOT NULL,
    cvv_hash VARCHAR(255) NULL, -- Hashed CVV
    
    -- Card limits and settings
    daily_limit DECIMAL(10, 2) NULL,
    monthly_limit DECIMAL(10, 2) NULL,
    single_transaction_limit DECIMAL(10, 2) NULL,
    
    -- Card status and controls
    status ENUM('active', 'blocked', 'expired', 'cancelled', 'pending') DEFAULT 'active',
    is_contactless_enabled BOOLEAN DEFAULT TRUE,
    is_online_enabled BOOLEAN DEFAULT TRUE,
    is_international_enabled BOOLEAN DEFAULT FALSE,
    
    -- Security
    pin_hash VARCHAR(255) NULL,
    failed_attempts INT DEFAULT 0,
    last_used_at TIMESTAMP NULL,
    
    -- Dates
    issued_date DATE NULL,
    activated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_cards_account_id (account_id),
    INDEX idx_cards_uuid (uuid),
    INDEX idx_cards_last_four (card_last_four),
    INDEX idx_cards_type (card_type),
    INDEX idx_cards_brand (card_brand),
    INDEX idx_cards_status (status),
    INDEX idx_cards_expiry (expiry_year, expiry_month),
    INDEX idx_cards_created_at (created_at),
    
    -- Composite indexes
    INDEX idx_cards_account_status (account_id, status),
    INDEX idx_cards_account_type (account_id, card_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
