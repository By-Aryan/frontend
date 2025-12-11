#!/bin/bash

# Frontend Deployment Script
echo "🚀 Deploying frontend to server..."

# Configuration
SERVER_USER="root"
SERVER_HOST="your-server-ip"
SERVER_PATH="/home/developer/frontend"

# Build the application
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Create deployment package
echo "📁 Creating deployment package..."
tar -czf frontend-build.tar.gz .next public package.json

# Deploy to server (you'll need to adjust this based on your access method)
echo "🚀 Deploying to server..."
echo "Manual deployment steps:"
echo "1. Copy frontend-build.tar.gz to your server"
echo "2. Extract: tar -xzf frontend-build.tar.gz"
echo "3. Install dependencies: npm install --production"
echo "4. Start: npm start"

echo "✅ Deployment package ready: frontend-build.tar.gz"