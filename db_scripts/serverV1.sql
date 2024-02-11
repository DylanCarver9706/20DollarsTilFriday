-- Create database if not exists
CREATE DATABASE IF NOT EXISTS 20DollarsTilFriday;

-- Switch to finance_tracker database
USE 20DollarsTilFriday;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type ENUM('bill', 'payday') NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
