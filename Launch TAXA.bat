@echo off
setlocal EnableDelayedExpansion

TITLE TAXA Platform Launcher
COLOR 0A

echo ========================================================
echo                 TAXA PLATFORM LAUNCHER
echo ========================================================
echo.

:: 1. Check if Docker is running
echo [*] Checking Docker status...
wsl -e bash -c "docker ps" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker is not running.
    echo [*] Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    echo [*] Waiting for Docker to initialize (this may take a minute)...
    :wait_docker
    timeout /t 5 >nul
    wsl -e bash -c "docker ps" >nul 2>&1
    if !errorlevel! neq 0 (
        echo ... still waiting for Docker ...
        goto wait_docker
    )
    echo [V] Docker is ready!
) else (
    echo [V] Docker is running.
)

echo.
echo ========================================================
echo [*] Starting TAXA Platform containers...
echo ========================================================

:: 2. Start Containers
wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose up -d"

echo.
echo [*] Waiting for services to be ready...
timeout /t 10 >nul

:: 3. Check if Frontend is up
:check_frontend
netstat -an | find "3000" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo ... waiting for Frontend (port 3000)...
    timeout /t 3 >nul
    goto check_frontend
)

echo.
echo ========================================================
echo [V] TAXA PLATFORM IS READY!
echo ========================================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000/docs
echo.
echo [*] Opening in browser...
start http://localhost:3000

echo.
echo Press any key to close this window...
pause >nul
