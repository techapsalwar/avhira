# Avhira Development Server Starter
# This script starts both Laravel and Vite dev servers

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AVHIRA E-COMMERCE DEV SERVERS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if setup has been run
if (-not (Test-Path .env)) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  .\setup.ps1" -ForegroundColor White
    Write-Host ""
    exit
}

# Check if migrations have been run
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  Type: MySQL" -ForegroundColor Gray
Write-Host "  Database: avhira" -ForegroundColor Gray
Write-Host "  Host: 127.0.0.1:3306" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Make sure MySQL/XAMPP/WAMP is running!" -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Laravel Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "⚡ Vite Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers using Start-Process
$laravelJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "php artisan serve" -PassThru
$viteJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru

Write-Host "✓ Servers started!" -ForegroundColor Green
Write-Host ""
Write-Host "Open your browser and visit:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "To stop the servers, close both terminal windows" -ForegroundColor Gray
Write-Host ""

# Wait for user to press a key
Read-Host "Press Enter to open the website in your default browser"

Start-Process "http://localhost:8000"

Write-Host ""
Write-Host "Enjoy building with Avhira! 🚀" -ForegroundColor Cyan
Write-Host ""
