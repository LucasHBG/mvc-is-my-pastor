-- 901_insert_sample_data.sql
-- Sample data for development and testing

USE mvc_pastor_db;

-- Insert sample users
INSERT INTO users (email, name, company, google_id, is_active) VALUES
('john.doe@example.com', 'John Doe', 'Acme Corporation', 'google_123456789', TRUE),
('jane.smith@example.com', 'Jane Smith', 'Tech Solutions Ltd', 'google_987654321', TRUE),
('mike.johnson@example.com', 'Mike Johnson', 'Freelancer', NULL, TRUE),
('sarah.wilson@example.com', 'Sarah Wilson', 'Digital Agency Inc', 'google_456789123', TRUE)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Insert sample accounts
INSERT INTO accounts (user_id, account_name, account_number, account_type, balance, available_balance, currency, is_primary, is_active) VALUES
-- John Doe's accounts
(1, 'Main Business Account', 'ACC001001', 'business', 25000.00, 23500.00, 'USD', TRUE, TRUE),
(1, 'Business Savings', 'ACC001002', 'savings', 45000.00, 45000.00, 'USD', FALSE, TRUE),
(1, 'Personal Checking', 'ACC001003', 'checking', 8500.00, 7800.00, 'USD', FALSE, TRUE),

-- Jane Smith's accounts
(2, 'Company Account', 'ACC002001', 'business', 18500.00, 17200.00, 'USD', TRUE, TRUE),
(2, 'Emergency Fund', 'ACC002002', 'savings', 25000.00, 25000.00, 'USD', FALSE, TRUE),

-- Mike Johnson's accounts
(3, 'Freelance Account', 'ACC003001', 'checking', 12300.00, 11800.00, 'USD', TRUE, TRUE),
(3, 'Project Savings', 'ACC003002', 'savings', 8000.00, 8000.00, 'USD', FALSE, TRUE),

-- Sarah Wilson's accounts
(4, 'Agency Operations', 'ACC004001', 'business', 32000.00, 29500.00, 'USD', TRUE, TRUE),
(4, 'Personal Account', 'ACC004002', 'checking', 6800.00, 6300.00, 'USD', FALSE, TRUE)

ON DUPLICATE KEY UPDATE account_name = VALUES(account_name);

-- Insert sample transactions
INSERT INTO transactions (account_id, transaction_type, amount, description, category, merchant_name, transaction_date, status) VALUES
-- John Doe's transactions
(1, 'credit', 5000.00, 'Client payment - Website Development', 'business', 'ABC Company', '2024-09-01 09:30:00', 'completed'),
(1, 'debit', 1200.00, 'Office rent for September', 'bills-utilities', 'Property Management Co', '2024-09-01 14:00:00', 'completed'),
(1, 'debit', 350.00, 'Adobe Creative Suite subscription', 'technology', 'Adobe Systems', '2024-09-02 10:15:00', 'completed'),
(1, 'debit', 85.00, 'Business lunch with client', 'food-dining', 'Downtown Restaurant', '2024-09-03 12:30:00', 'completed'),
(1, 'credit', 2800.00, 'Consulting fees', 'business', 'XYZ Corp', '2024-09-04 16:20:00', 'completed'),

(3, 'credit', 1500.00, 'Monthly savings transfer', 'savings', NULL, '2024-09-01 08:00:00', 'completed'),
(3, 'debit', 65.00, 'Grocery shopping', 'groceries', 'SuperMart', '2024-09-02 18:45:00', 'completed'),
(3, 'debit', 45.00, 'Gas station', 'gas-fuel', 'Shell Station', '2024-09-03 07:30:00', 'completed'),

-- Jane Smith's transactions
(4, 'credit', 8500.00, 'Project milestone payment', 'business', 'Enterprise Client', '2024-09-01 11:00:00', 'completed'),
(4, 'debit', 1800.00, 'Team salary payments', 'business', NULL, '2024-09-01 15:30:00', 'completed'),
(4, 'debit', 250.00, 'Cloud hosting services', 'technology', 'AWS', '2024-09-02 09:00:00', 'completed'),
(4, 'debit', 120.00, 'Office supplies', 'miscellaneous', 'Office Depot', '2024-09-03 13:15:00', 'completed'),

-- Mike Johnson's transactions
(6, 'credit', 2200.00, 'Freelance project completion', 'freelance', 'Startup Inc', '2024-09-01 10:45:00', 'completed'),
(6, 'debit', 800.00, 'Laptop repair', 'technology', 'Computer Repair Shop', '2024-09-02 11:30:00', 'completed'),
(6, 'debit', 95.00, 'Internet bill', 'bills-utilities', 'Internet Provider', '2024-09-03 16:00:00', 'completed'),
(6, 'debit', 35.00, 'Coffee shop work session', 'coffee-tea', 'Local Coffee', '2024-09-04 09:15:00', 'completed'),

-- Sarah Wilson's transactions
(8, 'credit', 12000.00, 'Marketing campaign project', 'business', 'Big Brand Corp', '2024-09-01 14:30:00', 'completed'),
(8, 'debit', 3500.00, 'Advertising spend', 'business', 'Google Ads', '2024-09-02 10:00:00', 'completed'),
(8, 'debit', 450.00, 'Design software licenses', 'technology', 'Creative Tools Inc', '2024-09-03 12:00:00', 'completed'),

(9, 'debit', 150.00, 'Dinner with friends', 'restaurants', 'Fine Dining Place', '2024-09-02 19:30:00', 'completed'),
(9, 'debit', 80.00, 'Gym membership', 'personal-care', 'Fitness Center', '2024-09-03 08:00:00', 'completed')

ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert sample cards
INSERT INTO cards (account_id, card_number_hash, card_last_four, card_type, card_brand, cardholder_name, expiry_month, expiry_year, status, daily_limit, monthly_limit) VALUES
(1, SHA2('4111111111111111', 256), '1111', 'debit', 'visa', 'JOHN DOE', 12, 2027, 'active', 1000.00, 25000.00),
(1, SHA2('5555555555554444', 256), '4444', 'credit', 'mastercard', 'JOHN DOE', 8, 2026, 'active', 2000.00, 50000.00),
(4, SHA2('4000000000000002', 256), '0002', 'debit', 'visa', 'JANE SMITH', 3, 2028, 'active', 1500.00, 30000.00),
(6, SHA2('4242424242424242', 256), '4242', 'debit', 'visa', 'MIKE JOHNSON', 6, 2027, 'active', 800.00, 15000.00),
(8, SHA2('5105105105105100', 256), '5100', 'debit', 'mastercard', 'SARAH WILSON', 11, 2026, 'active', 1200.00, 35000.00)

ON DUPLICATE KEY UPDATE cardholder_name = VALUES(cardholder_name);
