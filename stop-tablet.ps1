# Stop Tablet Display Server (PowerShell)
# This script stops all running Node.js processes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Stopping Tablet Display Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if any Node.js processes are running
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Server stopped" -ForegroundColor Green
} else {
    Write-Host "No Node.js server is currently running" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
