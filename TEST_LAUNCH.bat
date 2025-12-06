@echo off
chcp 65001 >nul
echo ========================================
echo    TAXA Platform - Test Launch
echo ========================================
echo.

echo Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo Docker is running!
echo.
echo Checking containers...
docker compose ps
echo.
echo ========================================
echo Platform Status:
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000/docs
echo.
echo Press any key to open frontend...
pause >nul
start http://localhost:3000
