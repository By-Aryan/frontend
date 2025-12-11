#!/bin/bash

echo "🚀 Starting frontend with clean setup..."

# Kill any existing processes on port 3000
echo "Cleaning up port 3000..."
sudo fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Build the frontend
echo "Building frontend..."
npm run build

# Start the frontend
echo "Starting frontend server..."
npm start