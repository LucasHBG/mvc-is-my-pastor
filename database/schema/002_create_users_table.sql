-- 002_create_users_table.sql
-- Users table for authentication and user management

USE mvc_pastor_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    email VARCHAR(320) UNIQUE NOT NULL, -- RFC 5321 compliant email length
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    password_hash VARCHAR(255) NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    profile_photo_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes for performance
    INDEX idx_users_email (email),
    INDEX idx_users_google_id (google_id),
    INDEX idx_users_uuid (uuid),
    INDEX idx_users_active (is_active),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
