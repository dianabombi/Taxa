@echo off
chcp 65001 >nul
color 0A
title TAXA Platform Launcher

REM Change to script directory
cd /d "%~dp0"

echo ========================================
echo    TAXA Platform - Auto Launch
echo ========================================
echo.

REM Step 1: Check Docker
echo [1/4] Checking Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo    Docker is not running!
    echo.
    echo    Starting Docker Desktop...
    
    set "DOCKER_PATH=C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if not exist "%DOCKER_PATH%" (
        set "DOCKER_PATH=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
    )
    if not exist "%DOCKER_PATH%" (
        set "DOCKER_PATH=%LOCALAPPDATA%\Programs\Docker\Docker\Docker Desktop.exe"
    )
    
    if not exist "%DOCKER_PATH%" (
        echo    Cannot find Docker Desktop!
        echo.
        echo    Please install Docker Desktop from:
        echo    https://www.docker.com/products/docker-desktop
        echo.
        goto :end
    )
    
    start "" "%DOCKER_PATH%"
    echo    Waiting for Docker to start (30-60 seconds)...
    
    set /a counter=0
    :wait_docker
    timeout /t 5 /nobreak >nul
    docker ps >nul 2>&1
    if %errorlevel% equ 0 goto :docker_ok
    
    set /a counter+=1
    if %counter% lss 24 (
        echo       ... waiting (%counter%/24)
        goto :wait_docker
    )
    
    echo    Docker did not start in 2 minutes
    echo    Try starting Docker manually and run this again
    goto :end
)

:docker_ok
echo    Docker is running!

REM Step 2: Check .env file
echo.
echo [2/4] Checking configuration...
if not exist ".env" (
    echo    .env file not found, creating from example...
    copy .env.example .env >nul
)

findstr /C:"your_key_here" .env >nul
if %errorlevel% equ 0 (
    echo    WARNING: OpenAI API key not configured!
    echo    Platform will start but AI features will not work.
    echo.
    echo    To configure the key, run:
    echo    "Launch TAXA (secure).bat"
    echo.
) else (
    echo    Configuration OK
)

REM Step 3: Start services
echo.
echo [3/4] Starting services...
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

REM Step 4: Wait for services
echo.
echo [4/4] Waiting for services to be ready (10 seconds)...
timeout /t 10 /nobreak >nul

REM Check status
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
echo Detailed instructions: README_ZAPUSK.md
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
pause >nul
