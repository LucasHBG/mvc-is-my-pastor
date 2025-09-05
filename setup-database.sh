#!/bin/bash

# Database Setup Script for MVC Pastor
# Handles schema, seeds, and fixtures setup with proper organization

set -e

echo "� Setting up MVC Pastor Database with organized structure..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.template to .env and configure it."
    exit 1
fi

# Source environment variables
source .env

# Function to check if MySQL is ready
wait_for_mysql() {
    echo "⏳ Waiting for MySQL to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec mvc-pastor-mysql mysqladmin ping -h"localhost" --silent; then
            echo "✅ MySQL is ready!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: MySQL not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ MySQL failed to start within expected time"
    return 1
}

# Start containers
echo "🚀 Starting Docker containers..."
docker-compose up -d

# Wait for MySQL to be ready
if ! wait_for_mysql; then
    echo "❌ Database setup failed - MySQL not responding"
    exit 1
fi

echo "📊 Database Setup Summary:"
echo "  - Schema: Created all tables, indexes, and views"
echo "  - Seeds: Inserted default categories and system data"
echo "  - Fixtures: Added sample data for development"
echo ""
echo "🌐 Services available:"
echo "  - MySQL: localhost:3306"
echo "  - phpMyAdmin: http://localhost:8080"
echo ""
echo "✅ Database setup completed successfully!"
