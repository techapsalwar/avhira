# 🎭 Staging Environment Setup Script

Write-Host "`n=== Avhira Staging Environment Setup ===" -ForegroundColor Cyan
Write-Host "This script will help you set up staging environment on Hostinger`n" -ForegroundColor Yellow

# Configuration
$SSH_KEY = "$HOME\.ssh\avhira_deploy_rsa"
$SSH_PORT = "65002"
$SSH_USER = "u885878505"
$SSH_HOST = "89.117.188.174"
$BASE_PATH = "/home/u885878505/domains/avhira.com"

Write-Host "Step 1: Creating staging directories..." -ForegroundColor Green

$CREATE_DIRS = @"
cd $BASE_PATH
mkdir -p staging_avhira
mkdir -p staging_html
echo '✅ Directories created'
ls -la | grep staging
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $CREATE_DIRS

Write-Host "`nStep 2: Copying production to staging..." -ForegroundColor Green

$COPY_FILES = @"
cd $BASE_PATH
echo 'Copying Laravel application...'
cp -r avhira/* staging_avhira/
echo '✅ Files copied'
du -sh staging_avhira
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $COPY_FILES

Write-Host "`nStep 3: Creating staging .env file..." -ForegroundColor Green

$CREATE_ENV = @"
cd $BASE_PATH/staging_avhira
cp .env .env.staging.backup
cat > .env << 'ENVFILE'
APP_NAME="Avhira Staging"
APP_ENV=staging
APP_KEY=base64:GENERATE_NEW_KEY_HERE
APP_DEBUG=true
APP_URL=https://staging.avhira.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u885878505_avhira_staging
DB_USERNAME=u885878505_avhira_staging
DB_PASSWORD=CHANGE_THIS_PASSWORD

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

MAIL_MAILER=log
ENVFILE

echo '✅ Staging .env created'
php artisan key:generate
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $CREATE_ENV

Write-Host "`nStep 4: Creating staging index.php..." -ForegroundColor Green

$CREATE_INDEX = @"
cd $BASE_PATH/staging_html
cat > index.php << 'INDEXPHP'
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Point to staging Laravel application
require __DIR__.'/../staging_avhira/vendor/autoload.php';

\$app = require_once __DIR__.'/../staging_avhira/bootstrap/app.php';

\$kernel = \$app->make(Illuminate\Contracts\Http\Kernel::class);

\$response = \$kernel->handle(
    \$request = Request::capture()
)->send();

\$kernel->terminate(\$request, \$response);
INDEXPHP

echo '✅ Staging index.php created'
cat index.php
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $CREATE_INDEX

Write-Host "`nStep 5: Setting up storage symlink..." -ForegroundColor Green

$SETUP_SYMLINK = @"
cd $BASE_PATH
rm -rf staging_html/storage
ln -sf $BASE_PATH/staging_avhira/storage/app/public $BASE_PATH/staging_html/storage
echo '✅ Storage symlink created'
ls -la staging_html/storage
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $SETUP_SYMLINK

Write-Host "`nStep 6: Copying build assets..." -ForegroundColor Green

$COPY_BUILD = @"
cd $BASE_PATH
cp -r avhira/public/build staging_html/build
echo '✅ Build assets copied'
ls -la staging_html/build
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $COPY_BUILD

Write-Host "`nStep 7: Setting permissions..." -ForegroundColor Green

$SET_PERMISSIONS = @"
cd $BASE_PATH
chmod -R 755 staging_avhira
chmod -R 775 staging_avhira/storage
chmod -R 775 staging_avhira/bootstrap/cache
echo '✅ Permissions set'
"@

ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $SET_PERMISSIONS

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Create staging database in Hostinger panel:" -ForegroundColor White
Write-Host "   - Database name: u885878505_avhira_staging" -ForegroundColor Gray
Write-Host "   - Database user: u885878505_avhira_staging" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update staging .env with database password" -ForegroundColor White
Write-Host ""
Write-Host "3. Create subdomain in Hostinger panel:" -ForegroundColor White
Write-Host "   - Subdomain: staging" -ForegroundColor Gray
Write-Host "   - Full domain: staging.avhira.com" -ForegroundColor Gray
Write-Host "   - Document Root: $BASE_PATH/staging_html" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run migrations on staging:" -ForegroundColor White
Write-Host "   ssh -i `"$SSH_KEY`" -p $SSH_PORT $SSH_USER@$SSH_HOST" -ForegroundColor Gray
Write-Host "   cd $BASE_PATH/staging_avhira" -ForegroundColor Gray
Write-Host "   php artisan migrate:fresh --seed" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Visit: https://staging.avhira.com" -ForegroundColor Green
Write-Host ""
