# Avhira E-commerce Setup Script
# Run this script to set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AVHIRA E-COMMERCE SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Install Composer dependencies
Write-Host ""
Write-Host "Installing PHP dependencies..." -ForegroundColor Yellow
composer install
Write-Host "✓ PHP dependencies installed" -ForegroundColor Green

# Install NPM dependencies
Write-Host ""
Write-Host "Installing JavaScript dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ JavaScript dependencies installed" -ForegroundColor Green

# Generate application key
Write-Host ""
Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate
Write-Host "✓ Application key generated" -ForegroundColor Green

# Check MySQL connection
Write-Host ""
Write-Host "Checking MySQL database setup..." -ForegroundColor Yellow
Write-Host "  Database: avhira" -ForegroundColor Gray
Write-Host "  Host: 127.0.0.1:3306" -ForegroundColor Gray
Write-Host "  Username: root" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Before continuing, make sure:" -ForegroundColor Yellow
Write-Host "  1. MySQL/XAMPP/WAMP is running" -ForegroundColor White
Write-Host "  2. Database 'avhira' exists" -ForegroundColor White
Write-Host ""
Write-Host "To create the database, open MySQL and run:" -ForegroundColor Yellow
Write-Host "  CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor Cyan
Write-Host ""
$confirmation = Read-Host "Is MySQL running and database created? (Y/N)"
if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host ""
    Write-Host "⛔ Setup cancelled. Please set up MySQL first." -ForegroundColor Red
    Write-Host ""
    exit
}
Write-Host "✓ MySQL configuration verified" -ForegroundColor Green

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
php artisan migrate --force
Write-Host "✓ Migrations completed" -ForegroundColor Green

# Create storage link
Write-Host ""
Write-Host "Creating storage link..." -ForegroundColor Yellow
php artisan storage:link
Write-Host "✓ Storage link created" -ForegroundColor Green

# Seed database
Write-Host ""
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
php artisan db:seed
Write-Host "✓ Database seeded" -ForegroundColor Green

# Build assets
Write-Host ""
Write-Host "Building frontend assets..." -ForegroundColor Yellow
npm run build
Write-Host "✓ Assets built" -ForegroundColor Green

# Final message
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development servers, run:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Terminal 1: php artisan serve" -ForegroundColor White
Write-Host "  Terminal 2: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then visit: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default login credentials:" -ForegroundColor Yellow
Write-Host "  Email: test@example.com" -ForegroundColor White
Write-Host "  Password: password" -ForegroundColor White
Write-Host ""
