-- 01-init.sql
-- Consolidated database initialization script for Docker
-- This script combines all schema, seeds, and fixtures for automatic initialization

-- Create database if it doesn't exist (this is handled by docker-compose MYSQL_DATABASE)
-- The database will already be created by the time this script runs

-- Set the database to use
USE mvc_pastor_db;

-- Note: All subsequent schema files will be executed automatically
-- by mounting the schema, seeds, and fixtures directories to docker-entrypoint-initdb.d
