-- 900_insert_default_categories.sql
-- Default system categories

USE mvc_pastor_db;

-- Insert default expense categories
INSERT INTO categories (name, slug, description, color, icon, type, is_system, sort_order) VALUES
-- Income categories
('Salary', 'salary', 'Regular salary payments', '#4CAF50', 'attach_money', 'income', TRUE, 1),
('Freelance', 'freelance', 'Freelance income', '#8BC34A', 'work', 'income', TRUE, 2),
('Investment', 'investment', 'Investment returns', '#2196F3', 'trending_up', 'income', TRUE, 3),
('Business', 'business', 'Business income', '#FF9800', 'business', 'income', TRUE, 4),
('Other Income', 'other-income', 'Other sources of income', '#9C27B0', 'account_balance_wallet', 'income', TRUE, 5),

-- Expense categories
('Food & Dining', 'food-dining', 'Restaurants, groceries, food delivery', '#FF5722', 'restaurant', 'expense', TRUE, 10),
('Transportation', 'transportation', 'Gas, public transport, rideshare', '#607D8B', 'directions_car', 'expense', TRUE, 11),
('Shopping', 'shopping', 'Clothing, electronics, general purchases', '#E91E63', 'shopping_cart', 'expense', TRUE, 12),
('Entertainment', 'entertainment', 'Movies, games, subscriptions', '#9C27B0', 'movie', 'expense', TRUE, 13),
('Bills & Utilities', 'bills-utilities', 'Electricity, water, internet, phone', '#FF9800', 'receipt', 'expense', TRUE, 14),
('Healthcare', 'healthcare', 'Medical expenses, pharmacy, insurance', '#4CAF50', 'local_hospital', 'expense', TRUE, 15),
('Education', 'education', 'Courses, books, training', '#2196F3', 'school', 'expense', TRUE, 16),
('Travel', 'travel', 'Vacation, business travel', '#00BCD4', 'flight', 'expense', TRUE, 17),
('Home & Garden', 'home-garden', 'Furniture, repairs, gardening', '#795548', 'home', 'expense', TRUE, 18),
('Technology', 'technology', 'Software, gadgets, tech services', '#3F51B5', 'computer', 'expense', TRUE, 19),
('Insurance', 'insurance', 'Life, auto, home insurance', '#9E9E9E', 'security', 'expense', TRUE, 20),
('Taxes', 'taxes', 'Income tax, property tax', '#F44336', 'account_balance', 'expense', TRUE, 21),
('Personal Care', 'personal-care', 'Haircuts, cosmetics, wellness', '#E91E63', 'face', 'expense', TRUE, 22),
('Gifts & Donations', 'gifts-donations', 'Gifts, charity, donations', '#FF5722', 'card_giftcard', 'expense', TRUE, 23),
('Miscellaneous', 'miscellaneous', 'Other expenses', '#9E9E9E', 'category', 'expense', TRUE, 24),

-- Transfer categories
('Account Transfer', 'account-transfer', 'Transfer between accounts', '#607D8B', 'swap_horiz', 'transfer', TRUE, 30),
('Savings', 'savings', 'Transfer to savings', '#4CAF50', 'savings', 'transfer', TRUE, 31)

ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert subcategories for Food & Dining
INSERT INTO categories (name, slug, description, color, icon, type, is_system, parent_id, sort_order) VALUES
('Restaurants', 'restaurants', 'Dining out', '#FF5722', 'restaurant', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'food-dining') AS temp), 1),
('Groceries', 'groceries', 'Grocery shopping', '#FF5722', 'local_grocery_store', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'food-dining') AS temp), 2),
('Coffee & Tea', 'coffee-tea', 'Coffee shops, tea', '#FF5722', 'local_cafe', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'food-dining') AS temp), 3),
('Fast Food', 'fast-food', 'Fast food restaurants', '#FF5722', 'fastfood', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'food-dining') AS temp), 4)

ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert subcategories for Transportation
INSERT INTO categories (name, slug, description, color, icon, type, is_system, parent_id, sort_order) VALUES
('Gas & Fuel', 'gas-fuel', 'Vehicle fuel', '#607D8B', 'local_gas_station', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'transportation') AS temp), 1),
('Public Transit', 'public-transit', 'Bus, train, subway', '#607D8B', 'train', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'transportation') AS temp), 2),
('Rideshare', 'rideshare', 'Uber, Lyft, taxi', '#607D8B', 'local_taxi', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'transportation') AS temp), 3),
('Parking', 'parking', 'Parking fees', '#607D8B', 'local_parking', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'transportation') AS temp), 4),
('Car Maintenance', 'car-maintenance', 'Repairs, oil changes', '#607D8B', 'car_repair', 'expense', TRUE, 
    (SELECT id FROM (SELECT id FROM categories WHERE slug = 'transportation') AS temp), 5)

ON DUPLICATE KEY UPDATE name = VALUES(name);
