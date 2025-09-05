-- 001_create_database.sql
-- Database creation and initial setup

CREATE DATABASE IF NOT EXISTS mvc_pastor_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mvc_pastor_db;

-- Create application user with proper privileges
-- Note: In production, this should be done separately with proper security
