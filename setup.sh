#!/bin/bash
# Quick setup script for the MVC is My Pastor monorepo

echo "🚀 Setting up MVC is My Pastor Monorepo"
echo ""

echo "📁 Project Structure:"
echo "  client/     - Angular frontend"
echo "  server/     - Future backend (not yet implemented)"
echo ""

# Check if we're in the right directory
if [ ! -d "client" ]; then
    echo "❌ Error: Must run this script from the project root directory"
    exit 1
fi

echo "🔧 Setting up frontend (Angular)..."
cd client

# Install dependencies
echo "📦 Installing npm dependencies..."
make install

# Set up environment files
echo "🔐 Setting up environment files..."
make setup-env

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Edit client/src/environments/environment.ts with your Google Client ID"
echo "  2. Run: cd client && make dev"
echo "  3. Open http://localhost:4200"
echo ""
echo "📖 For more information:"
echo "  - Root README: ./README.md"
echo "  - Frontend README: ./client/README.md"
echo "  - Google OAuth setup: ./client/GOOGLE_SIGNIN_SETUP.md"
