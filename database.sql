-- Create database
CREATE DATABASE IF NOT EXISTS personal_finance;
USE personal_finance;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    description TEXT
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    description TEXT,
    category_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (name, type, description) VALUES
-- Income
('Salary', 'income', 'Income from work'),
('Investments', 'income', 'Investment earnings'),
('Freelance', 'income', 'Independent work'),
('Sales', 'income', 'Income from product or service sales'),
('Rentals', 'income', 'Income from rented properties'),
('Dividends', 'income', 'Investment dividends'),
('Gifts', 'income', 'Income from gifts or donations'),
('Refunds', 'income', 'Income from refunds or returns'),
('Other Income', 'income', 'Other uncategorized income types'),

-- Expenses
('Food', 'expense', 'Food and beverage expenses'),
('Transportation', 'expense', 'Transportation expenses'),
('Housing', 'expense', 'Rent or mortgage expenses'),
('Utilities', 'expense', 'Basic services (electricity, water, etc.)'),
('Entertainment', 'expense', 'Leisure and entertainment expenses'),
('Health', 'expense', 'Medical and health expenses'),
('Education', 'expense', 'Education and training expenses'),
('Clothing', 'expense', 'Clothing and footwear expenses'),
('Technology', 'expense', 'Technology devices and services expenses'),
('Travel', 'expense', 'Travel-related expenses'),
('Pets', 'expense', 'Pet care expenses'),
('Insurance', 'expense', 'Various insurance expenses'),
('Taxes', 'expense', 'Tax payments'),
('Debts', 'expense', 'Loan and debt payments'),
('Savings', 'expense', 'Money allocated for savings'),
('Other Expenses', 'expense', 'Other uncategorized expenses');

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_categories_type ON categories(type);