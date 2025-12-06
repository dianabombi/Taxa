@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
color 0A
title TAXA Platform Launcher

echo ========================================
echo    TAXA Platform - Auto Launch
echo ========================================
echo.

REM Step 1: Check Docker
echo [1/3] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo    Docker is not running!
    echo.
    echo    Please start Docker Desktop manually and run this script again.
    echo.
    echo    OR use: "Starting the Docker(automat).bat"
    echo    which will start Docker automatically.
    echo.
    goto :end
)

echo    Docker is running!

REM Step 2: Start services
echo.
echo [2/3] Starting services...
docker compose up -d

if %errorlevel% neq 0 (
    echo    Error starting services!
    echo.
    echo    Try to fix:
    echo    1. Run "Fix and Rebuild.bat"
    echo    2. Or restart Docker Desktop
    goto :end
)

echo    Services started!

REM Step 3: Wait and check
echo.
echo [3/3] Waiting for services (10 seconds)...
timeout /t 10 /nobreak >nul

docker compose ps

echo.
echo ========================================
echo    TAXA Platform is ready!
echo ========================================
echo.
echo Links:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000/docs
echo    MinIO:     http://localhost:9001
echo.

REM Open browser
echo Opening browser...
start http://localhost:3000

echo.
echo Done! You can close this window.
echo.

:end
echo ========================================
echo Press any key to exit...
pause
