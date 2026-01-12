# Tablet Display Server Startup Script (PowerShell)
# This script starts the Node.js server and opens the display in your browser

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tablet Display Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js found" -ForegroundColor Green
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting server..." -ForegroundColor Yellow
Write-Host ""

# Start the server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Write-Host 'Tablet Display Server' -ForegroundColor Cyan; node server.js }"

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open the browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server is running in a separate window" -ForegroundColor Green
Write-Host "Display URL: http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the server, close the server window" -ForegroundColor Yellow
Write-Host "or press Ctrl+C in the server window" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this window"
