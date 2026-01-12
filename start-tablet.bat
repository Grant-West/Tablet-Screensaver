@echo off
REM Tablet Display Server Startup Script
REM This script starts the Node.js server and opens the display in your browser

echo ========================================
echo   Tablet Display Server Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Get the directory where this batch file is located
cd /d "%~dp0"

echo Starting server...
echo.

REM Start the server and open browser
start "Tablet Server" cmd /k "node server.js"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open the browser
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo Server is running in a separate window
echo Display URL: http://localhost:3000
echo ========================================
echo.
echo To stop the server, close the server window
echo or press Ctrl+C in the server window
echo.
pause
