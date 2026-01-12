#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

echo "====================================="
echo "Starting Tablet Display Server..."
echo "====================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "Starting server on http://localhost:3000"
echo ""
node server.js &

# Wait for server to start
sleep 2

# Open the browser
echo "Opening browser..."
open http://localhost:3000

echo ""
echo "====================================="
echo "Server is running!"
echo "====================================="
echo "Access the display at: http://localhost:3000"
echo ""
echo "To stop the server:"
echo "  - Press Ctrl+C in this window, OR"
echo "  - Run: ./stop-tablet.sh"
echo "====================================="
echo ""

# Wait for the background process to finish
wait
