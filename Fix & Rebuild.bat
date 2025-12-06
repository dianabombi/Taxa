@echo off
TITLE TAXA Platform - Fix & Rebuild
COLOR 0C

echo ========================================================
echo            TAXA PLATFORM - EMERGENCY FIX
echo ========================================================
echo.
echo This script will:
echo 1. Stop all TAXA containers
echo 2. Remove old containers and volumes
echo 3. Rebuild the platform from scratch
echo.
echo Press any key to continue or close window to cancel...
pause >nul

echo.
echo [*] Stopping containers...
wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose down -v"

echo.
echo [*] Rebuilding platform...
wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose build --no-cache"

echo.
echo [*] Starting platform...
wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose up -d"

echo.
echo ========================================================
echo [V] REBUILD COMPLETE!
echo ========================================================
echo.
echo Try opening the platform now.
pause
