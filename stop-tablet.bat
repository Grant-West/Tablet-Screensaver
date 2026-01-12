@echo off
REM Stop Tablet Display Server
REM This script stops all running Node.js processes

echo ========================================
echo   Stopping Tablet Display Server
echo ========================================
echo.

REM Kill all node.exe processes running server.js
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Stopping Node.js processes...
    taskkill /F /IM node.exe /T >nul 2>&1
    echo [OK] Server stopped
) else (
    echo No Node.js server is currently running
)

echo.
pause
