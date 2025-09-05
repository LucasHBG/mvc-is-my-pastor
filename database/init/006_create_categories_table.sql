-- 006_create_categories_table.sql
-- Transaction categories and subcategories

USE mvc_pastor_db;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(7) NULL, -- Hex color code
    icon VARCHAR(50) NULL,
    parent_id BIGINT UNSIGNED NULL, -- For subcategories
    
    -- Category type
    type ENUM('income', 'expense', 'transfer') NOT NULL,
    
    -- System vs user categories
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Ordering
    sort_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key for parent category
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_categories_uuid (uuid),
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_type (type),
    INDEX idx_categories_system (is_system),
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
