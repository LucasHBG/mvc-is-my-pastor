#!/bin/bash

# Production Database Setup
# Only runs schema and seeds, NO fixtures/sample data

set -e

echo "🏭 Setting up Production Database (Schema + Seeds only)..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.template to .env and configure it."
    exit 1
fi

# Source environment variables
source .env

# Function to execute SQL files in a directory
execute_sql_files() {
    local directory=$1
    local description=$2
    
    if [ -d "$directory" ] && [ "$(ls -A $directory/*.sql 2>/dev/null)" ]; then
        echo "📝 Executing $description..."
        for sql_file in "$directory"/*.sql; do
            if [ -f "$sql_file" ]; then
                echo "  - $(basename "$sql_file")"
                docker exec -i mvc-pastor-mysql mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < "$sql_file"
            fi
        done
    else
        echo "⚠️  No $description found in $directory"
    fi
}

# Start containers
echo "🚀 Starting Docker containers..."
docker-compose up -d mysql  # Only start MySQL, not phpMyAdmin for production

# Wait for MySQL
echo "⏳ Waiting for MySQL..."
sleep 10

# Execute schema files
execute_sql_files "database/schema" "schema files"

# Execute seed files (production data)
execute_sql_files "database/seeds" "seed files"

echo "✅ Production database setup completed!"
echo "📊 Includes: Schema + System/Category data only"
