#!/bin/bash

echo "====================================="
echo "Stopping Tablet Display Server..."
echo "====================================="
echo ""

# Kill the server process
pkill -f "node server.js"

# Check if it was killed
if [ $? -eq 0 ]; then
    echo "Server stopped successfully!"
else
    echo "No server process found (server may not be running)"
fi

echo ""
echo "====================================="
