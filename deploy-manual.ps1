# Manual Deployment Script for Avhira
param([switch]$SkipBuild,[switch]$SkipBackup)
$ErrorActionPreference="Stop"
$SSH_KEY="$HOME\.ssh\avhira_deploy_rsa"
$SSH_HOST="u885878505@89.117.188.174"
$SSH_PORT="65002"
$REMOTE_PROJECT_DIR="/home/u885878505/domains/avhira.com/avhira"
$REMOTE_PUBLIC_DIR="/home/u885878505/domains/avhira.com/public_html"

Write-Host "
[DEPLOYMENT STARTED]
" -ForegroundColor Green

if(-not $SkipBuild){
Write-Host "Step 1: Building assets..." -ForegroundColor Yellow
npm run build
if($LASTEXITCODE -ne 0){Write-Host "Build failed!" -ForegroundColor Red;exit 1}
Write-Host "Build complete!
" -ForegroundColor Green
}

if(-not $SkipBackup){
Write-Host "Step 2: Creating backup..." -ForegroundColor Yellow
ssh -i $SSH_KEY -p $SSH_PORT $SSH_HOST "cd $REMOTE_PROJECT_DIR && mkdir -p ../backups/manual_$(date +%Y%m%d_%H%M%S) && cp .env ../backups/manual_$(date +%Y%m%d_%H%M%S)/.env"
Write-Host "Backup complete!
" -ForegroundColor Green
}

Write-Host "Step 3: Uploading application..." -ForegroundColor Yellow
rsync -avz --delete -e "ssh -i `"$SSH_KEY`" -p $SSH_PORT" --exclude='.git' --exclude='node_modules' --exclude='vendor' --exclude='tests' --exclude='.env' --exclude='public/build' ./ "${SSH_HOST}:${REMOTE_PROJECT_DIR}/"
if($LASTEXITCODE -ne 0){Write-Host "Upload failed!" -ForegroundColor Red;exit 1}
Write-Host "Application uploaded!
" -ForegroundColor Green

Write-Host "Step 4: Uploading build assets..." -ForegroundColor Yellow
rsync -avz --delete -e "ssh -i `"$SSH_KEY`" -p $SSH_PORT" ./public/build/ "${SSH_HOST}:${REMOTE_PUBLIC_DIR}/build/"
Write-Host "Build assets uploaded!
" -ForegroundColor Green

Write-Host "Step 5: Uploading public files..." -ForegroundColor Yellow
rsync -avz -e "ssh -i `"$SSH_KEY`" -p $SSH_PORT" --exclude='build' ./public/ "${SSH_HOST}:${REMOTE_PUBLIC_DIR}/"
Write-Host "Public files uploaded!
" -ForegroundColor Green

Write-Host "Step 6: Installing dependencies..." -ForegroundColor Yellow
ssh -i $SSH_KEY -p $SSH_PORT $SSH_HOST "cd $REMOTE_PROJECT_DIR && composer install --optimize-autoloader --no-dev --no-interaction"
Write-Host "Dependencies installed!
" -ForegroundColor Green

Write-Host "Step 7: Optimizing Laravel..." -ForegroundColor Yellow
ssh -i $SSH_KEY -p $SSH_PORT $SSH_HOST "cd $REMOTE_PROJECT_DIR && php artisan config:clear && php artisan cache:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan optimize && chmod -R 775 storage bootstrap/cache"
Write-Host "Optimization complete!
" -ForegroundColor Green

Write-Host "
[DEPLOYMENT COMPLETE]
" -ForegroundColor Green
Write-Host "Visit: https://avhira.com" -ForegroundColor Cyan
Write-Host "Monitor logs: ssh -i $SSH_KEY -p $SSH_PORT $SSH_HOST
" -ForegroundColor Gray
