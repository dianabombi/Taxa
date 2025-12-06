@echo off
chcp 65001 >nul
echo ========================================
echo    🚀 TAXA Platform - Автозапуск
echo ========================================
echo.

echo [1/4] Перевірка Docker Desktop...
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Docker вже запущений
    goto :start_services
)

echo    ⏳ Docker не запущений, запускаю...
echo.

REM Спроба знайти Docker Desktop
set "DOCKER_PATH=C:\Program Files\Docker\Docker\Docker Desktop.exe"
if not exist "%DOCKER_PATH%" (
    set "DOCKER_PATH=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
)
if not exist "%DOCKER_PATH%" (
    set "DOCKER_PATH=%LOCALAPPDATA%\Programs\Docker\Docker\Docker Desktop.exe"
)

if not exist "%DOCKER_PATH%" (
    echo.
    echo ❌ Не можу знайти Docker Desktop!
    echo.
    echo 📋 Будь ласка, запустіть Docker Desktop вручну:
    echo    1. Знайдіть іконку Docker Desktop на робочому столі
    echo    2. Двічі клацніть по ній
    echo    3. Зачекайте 30-60 секунд
    echo    4. Запустіть цей батник знову
    echo.
    pause
    goto :end
)

echo    📂 Знайдено: %DOCKER_PATH%
echo    🔄 Запускаю Docker Desktop...
start "" "%DOCKER_PATH%"

echo.
echo [2/4] Очікування запуску Docker (це може зайняти 30-60 секунд)...
echo       Будь ласка, зачекайте...

REM Очікування запуску Docker (максимум 2 хвилини)
set /a counter=0
:wait_loop
timeout /t 5 /nobreak >nul
docker ps >nul 2>&1
if %errorlevel% equ 0 goto :docker_ready
set /a counter+=1
if %counter% lss 24 (
    echo       ⏳ Очікування... (%counter%/24)
    goto :wait_loop
)

echo.
echo ❌ Docker не запустився за 2 хвилини
echo.
echo 📋 Можливі причини:
echo    - Docker Desktop ще завантажується (зачекайте ще трохи)
echo    - Потрібні права адміністратора
echo    - Docker Desktop не встановлений
echo.
pause
goto :end

:docker_ready
echo    ✅ Docker успішно запущений!

:start_services
echo.
echo [3/4] Запуск всіх сервісів TAXA...
docker compose up -d

echo.
echo [4/4] Перевірка статусу сервісів...
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
echo 💡 Порада: Додайте цей батник на робочий стіл для швидкого запуску!
echo.

:end
echo Натисніть будь-яку клавішу для виходу...
pause >nul
