#!/bin/bash

# Storix Setup Script
# This script sets up the development environment for Storix

set -e

echo "🚀 Setting up Storix development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "   You can install it from: https://www.postgresql.org/download/"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating frontend environment file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys and configuration"
fi

# Create backend environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend environment file..."
    cp env.example backend/.env
    echo "⚠️  Please update backend/.env with your actual API keys and configuration"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p backend/uploads
mkdir -p logs

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd backend
npx prisma generate
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local and backend/.env with your actual API keys"
echo "2. Set up your PostgreSQL database"
echo "3. Validate your environment configuration:"
echo "   cd backend && npm run validate-env"
echo "4. Create database tables:"
echo "   cd backend && npx prisma db push"
echo "5. Start the development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: npm run dev"
echo ""
echo "📚 For more information, see README.md"
