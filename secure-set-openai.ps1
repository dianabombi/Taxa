# Secure OpenAI API Key Setup for TAXA Platform
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TAXA Platform - Secure Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check for OneDrive
$currentPath = Get-Location
if ($currentPath.Path -like "*OneDrive*") {
    Write-Host "⚠️  WARNING: Project is located in a OneDrive folder." -ForegroundColor Yellow
    Write-Host "    .env file will be synced to the cloud." -ForegroundColor Yellow
    Write-Host "    Recommended: Move project to a local folder (e.g., C:\Projects\TAXA)" -ForegroundColor Yellow
    Write-Host ""
}

# 2. Check .env file
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env from template" -ForegroundColor Green
    } else {
        Write-Error "❌ .env.example not found! Cannot create configuration."
    }
}

# 3. Securely prompt for API Key
Write-Host "Please enter your OpenAI API Key (input will be hidden):" -ForegroundColor White
$secureKey = Read-Host -AsSecureString
$plainKey = [System.Net.NetworkCredential]::new("", $secureKey).Password

if ([string]::IsNullOrWhiteSpace($plainKey)) {
    Write-Error "❌ API Key cannot be empty."
}

# 4. Update .env file
$envContent = Get-Content ".env"
$keyPattern = "^OPENAI_API_KEY=.*"
$newKeyLine = "OPENAI_API_KEY=$plainKey"

if ($envContent -match $keyPattern) {
    $envContent = $envContent -replace $keyPattern, $newKeyLine
} else {
    $envContent += $newKeyLine
}

$envContent | Set-Content ".env"
Write-Host "✅ OpenAI API Key saved to .env" -ForegroundColor Green

# 5. Restart Backend
Write-Host "🔄 Restarting backend service..." -ForegroundColor Cyan
docker compose restart backend

# 6. Show Status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ TAXA Platform is Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Blue
Write-Host "Backend:  " -NoNewline; Write-Host "http://localhost:8000/docs" -ForegroundColor Blue
Write-Host "MinIO:    " -NoNewline; Write-Host "http://localhost:9001" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
