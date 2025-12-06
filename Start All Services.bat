@echo off
chcp 65001 >nul
echo ========================================
echo    🚀 TAXA Platform - Запуск сервісів
echo ========================================
echo.

REM Check if Docker is running
echo [1/3] Перевірка Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ПОМИЛКА: Docker Desktop не запущений!
    echo.
    echo 📋 Що робити:
    echo    1. Запустіть Docker Desktop з меню Пуск
    echo    2. Зачекайте 30-60 секунд
    echo    3. Запустіть цей батник знову
    echo.
    echo 💡 Порада: Налаштуйте автозапуск Docker в Settings ^> General
    echo.
    echo    АБО використайте "ЗАПУСК TAXA (автоматичний).bat"
    echo    який запустить Docker автоматично!
    echo.
    goto :end
)
echo    ✅ Docker працює

echo.
echo [2/3] Запуск всіх сервісів...
docker compose up -d

if %errorlevel% neq 0 (
    echo.
    echo ❌ ПОМИЛКА: Не вдалося запустити сервіси!
    echo.
    echo 📋 Спробуйте:
    echo    1. Запустіть "Fix & Rebuild.bat"
    echo    2. Перезапустіть Docker Desktop
    echo.
    goto :end
)

echo.
echo [3/3] Перевірка статусу...
docker compose ps

echo.
echo ========================================
echo    ✅ TAXA Platform готова до роботи!
echo ========================================
echo.
echo 🌐 Доступ до платформи:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000/docs
echo    MinIO:     http://localhost:9001
echo.
echo 📖 Детальна інструкція: ІНСТРУКЦІЯ_ЗАПУСКУ.md
echo.

:end
echo Натисніть будь-яку клавішу для виходу...
pause >nul
