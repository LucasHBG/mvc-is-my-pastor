-- Initial database schema for MVC is My Pastor
-- This file will be automatically executed when the MySQL container starts

USE mvc_pastor_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Accounts table (for financial accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type ENUM('checking', 'savings', 'business', 'credit') DEFAULT 'checking',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    transaction_type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    reference_number VARCHAR(100),
    category VARCHAR(100),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    card_type ENUM('debit', 'credit') DEFAULT 'debit',
    cardholder_name VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (email, name, company, google_id) VALUES
('john.doe@example.com', 'John Doe', 'Acme Corp', 'google_123456'),
('jane.smith@example.com', 'Jane Smith', 'Tech Solutions', 'google_789012')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample accounts
INSERT INTO accounts (user_id, account_name, account_type, balance) VALUES
(1, 'Main Business Account', 'business', 25000.00),
(1, 'Savings Account', 'savings', 15000.00),
(2, 'Personal Checking', 'checking', 8500.00)
ON DUPLICATE KEY UPDATE account_name=account_name;

-- Insert sample transactions
INSERT INTO transactions (account_id, transaction_type, amount, description, category) VALUES
(1, 'credit', 5000.00, 'Payment received from client', 'Income'),
(1, 'debit', 1200.00, 'Office rent payment', 'Expenses'),
(1, 'debit', 350.00, 'Software subscription', 'Technology'),
(2, 'credit', 2000.00, 'Monthly savings transfer', 'Transfer'),
(3, 'credit', 3200.00, 'Salary deposit', 'Income'),
(3, 'debit', 125.00, 'Grocery shopping', 'Food')
ON DUPLICATE KEY UPDATE description=description;
