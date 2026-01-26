#!/bin/bash
# Simple smoke test script for Task Management System

echo "========================================="
echo "Task Management System - Smoke Test"
echo "========================================="
echo ""

# Check if PostgreSQL is running
echo "1. Checking PostgreSQL connection..."
if command -v docker &> /dev/null && docker ps | grep -q task_management_db; then
    echo "   ✓ PostgreSQL container is running"
else
    echo "   ⚠ PostgreSQL container not found. Please run: docker-compose up -d"
fi
echo ""

# Check server dependencies
echo "2. Checking server dependencies..."
if [ -d "server/node_modules" ]; then
    echo "   ✓ Server dependencies installed"
else
    echo "   ⚠ Server dependencies not installed. Please run: cd server && npm install"
fi
echo ""

# Check client dependencies
echo "3. Checking client dependencies..."
if [ -d "client/node_modules" ]; then
    echo "   ✓ Client dependencies installed"
else
    echo "   ⚠ Client dependencies not installed. Please run: cd client && npm install"
fi
echo ""

# Check environment files
echo "4. Checking environment configuration..."
if [ -f "server/.env" ]; then
    echo "   ✓ Server .env file exists"
else
    echo "   ⚠ Server .env file not found. Please copy from .env.example"
fi
echo ""

echo "========================================="
echo "Setup Instructions"
echo "========================================="
echo ""
echo "If any checks failed, follow these steps:"
echo ""
echo "1. Start PostgreSQL:"
echo "   docker-compose up -d"
echo ""
echo "2. Install server dependencies:"
echo "   cd server && npm install"
echo ""
echo "3. Create server .env file:"
echo "   cp server/.env.example server/.env"
echo ""
echo "4. Install client dependencies:"
echo "   cd client && npm install"
echo ""
echo "5. Start the server (in one terminal):"
echo "   cd server && npm run dev"
echo ""
echo "6. Start the client (in another terminal):"
echo "   cd client && npm run dev"
echo ""
echo "7. Open your browser:"
echo "   http://localhost:5173"
echo ""
