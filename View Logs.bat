@echo off
REM View TAXA Platform Logs

echo ================================
echo    TAXA Platform Logs
echo ================================
echo.
echo Press Ctrl+C to exit
echo.

wsl -e bash -c "cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA && docker compose logs -f"
