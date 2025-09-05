-- 009_create_views.sql
-- Useful database views for common queries

USE mvc_pastor_db;

-- Account balance summary view
CREATE OR REPLACE VIEW account_summary AS
SELECT 
    a.id,
    a.uuid,
    a.account_name,
    a.account_number,
    a.account_type,
    a.balance,
    a.available_balance,
    a.currency,
    a.is_primary,
    a.is_active,
    u.name as user_name,
    u.email as user_email,
    COUNT(t.id) as total_transactions,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'credit' THEN t.amount ELSE 0 END), 0) as total_credits,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'debit' THEN t.amount ELSE 0 END), 0) as total_debits,
    MAX(t.transaction_date) as last_transaction_date
FROM accounts a
JOIN users u ON a.user_id = u.id
LEFT JOIN transactions t ON a.id = t.account_id AND t.status = 'completed'
WHERE a.is_active = TRUE AND u.is_active = TRUE
GROUP BY a.id, a.uuid, a.account_name, a.account_number, a.account_type, 
         a.balance, a.available_balance, a.currency, a.is_primary, a.is_active,
         u.name, u.email;

-- Recent transactions view
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
    t.id,
    t.uuid,
    t.transaction_type,
    t.amount,
    t.description,
    t.category,
    t.merchant_name,
    t.transaction_date,
    t.status,
    a.account_name,
    a.account_number,
    a.currency,
    u.name as user_name,
    c.name as category_name,
    c.color as category_color
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
LEFT JOIN categories c ON t.category = c.slug
WHERE t.deleted_at IS NULL
ORDER BY t.transaction_date DESC;

-- Monthly spending summary view
CREATE OR REPLACE VIEW monthly_spending AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    DATE_FORMAT(t.transaction_date, '%Y-%m') as month_year,
    t.category,
    c.name as category_name,
    COUNT(t.id) as transaction_count,
    SUM(CASE WHEN t.transaction_type = 'debit' THEN t.amount ELSE 0 END) as total_spent,
    SUM(CASE WHEN t.transaction_type = 'credit' THEN t.amount ELSE 0 END) as total_received,
    AVG(CASE WHEN t.transaction_type = 'debit' THEN t.amount ELSE NULL END) as avg_spent_per_transaction
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
LEFT JOIN categories c ON t.category = c.slug
WHERE t.status = 'completed' AND t.deleted_at IS NULL
GROUP BY u.id, u.name, DATE_FORMAT(t.transaction_date, '%Y-%m'), t.category, c.name
ORDER BY u.id, month_year DESC, total_spent DESC;
