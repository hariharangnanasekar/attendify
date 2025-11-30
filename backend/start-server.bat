@echo off
echo Starting Attendify Backend Server...
echo.
cd /d %~dp0
echo Current directory: %CD%
echo.
echo Checking for .env file...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create a .env file with your MongoDB connection string.
    pause
    exit /b 1
)
echo .env file found.
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting server...
echo.
echo ========================================
echo Backend Server Starting...
echo ========================================
echo.
echo Keep this window open while using the app!
echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev

