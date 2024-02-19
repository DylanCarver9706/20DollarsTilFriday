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

-- Create events table with a foreign key constraint for user_id
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL, -- bill or payday
  user_id INT NOT NULL,
  amount FLOAT,
  recurring_type VARCHAR(50), -- same day every month or every n days/weeks
  frequency VARCHAR(50), -- 15th of every month, every 30 days, etc.
  payment_method VARCHAR(50), -- auto-pay or manual pay
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO `20dollarstilfriday`.`users` (`id`, `email`, `password`) VALUES ('1', 'dylan@gmail.com', '1234');
INSERT INTO `20dollarstilfriday`.`events` (`id`, `title`, `type`, `user_id`, `amount`, `recurring_type`, `frequency`, `payment_method`) VALUES ('1', 'Netflix', 'bill', '1', '15.99', 'same day every month', '15th of every month', 'auto-pay');