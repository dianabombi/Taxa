# TAXA Platform - Desktop Shortcut Creator
# This script creates a shortcut on the desktop to launch TAXA platform

Write-Host "========================================" -ForegroundColor Green
Write-Host "  TAXA Platform - Shortcut Creator" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get the script directory (where TAXA files are located)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$batFilePath = Join-Path $scriptDir "ZAPUSK_TAXA_AUTO.bat"

# Check if the bat file exists
if (-not (Test-Path $batFilePath)) {
    Write-Host "ERROR: ZAPUSK_TAXA_AUTO.bat not found!" -ForegroundColor Red
    Write-Host "Expected location: $batFilePath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Get desktop path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Launch TAXA Platform.lnk"

Write-Host "Creating shortcut..." -ForegroundColor Cyan
Write-Host "  Source: $batFilePath" -ForegroundColor Gray
Write-Host "  Desktop: $shortcutPath" -ForegroundColor Gray
Write-Host ""

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell

# Create shortcut
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batFilePath
$shortcut.WorkingDirectory = $scriptDir
$shortcut.Description = "Launch TAXA Platform - Tax Accounting System"
$shortcut.WindowStyle = 1

# Save the shortcut
$shortcut.Save()

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SUCCESS! Shortcut created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now launch TAXA Platform from:" -ForegroundColor Cyan
Write-Host "  $shortcutPath" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
