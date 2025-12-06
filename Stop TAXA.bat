@echo off
REM Stop TAXA Platform

echo ================================
echo   Stopping TAXA Platform
echo ================================
echo.

wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose down"

echo.
echo TAXA Platform stopped!
echo.
pause
