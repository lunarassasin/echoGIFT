-- Create the main database
CREATE DATABASE IF NOT EXISTS echogift_db;
USE echogift_db;

-- 1. Create Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert initial data
INSERT INTO categories (category_name) VALUES 
('Education'), ('Tools for Work'), ('Health & Wellness'), 
('Home/Necessity'), ('Experiences'), ('Other');

-- 2. Corrected Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('Wisher', 'Donor') NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    real_name VARCHAR(255),
    shipping_address TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- FIX: Changed from DATETIME to TIMESTAMP
    is_verified BOOLEAN DEFAULT 0
);

-- 3. Corrected Wishes Table (No change needed here, but included for context)
CREATE TABLE wishes (
    wish_id INT AUTO_INCREMENT PRIMARY KEY,
    wisher_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    story TEXT NOT NULL,
    cost_estimate DECIMAL(10, 2) NOT NULL,
    item_url VARCHAR(2048),
    status ENUM('Pending Review', 'Live', 'Funding', 'Fulfilled', 'Archived') DEFAULT 'Pending Review',
    donor_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- CHANGED to TIMESTAMP
    fulfilled_at TIMESTAMP, -- CHANGED to TIMESTAMP
    FOREIGN KEY (wisher_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (donor_id) REFERENCES users(user_id)
);

-- 4. Corrected Transactions Table (No change needed, but included for context)
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    wish_id INT NOT NULL,
    donor_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_gateway_id VARCHAR(255) UNIQUE,
    status ENUM('Pending', 'Paid', 'Refunded', 'Failed', 'Fulfilled') DEFAULT 'Pending',
    is_anonymous BOOLEAN DEFAULT 1,
    -- FIX: Changed back to DATETIME. We will set this value manually in Node.js on INSERT.
    created_at DATETIME NOT NULL, 
    -- Keep this as TIMESTAMP to take advantage of the automatic ON UPDATE feature.
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (wish_id) REFERENCES wishes(wish_id),
    FOREIGN KEY (donor_id) REFERENCES users(user_id)
);