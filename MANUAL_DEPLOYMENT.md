# 🚀 Manual Deployment Guide

## Overview

This guide covers manual deployment of the Avhira application to Hostinger production server.

## Prerequisites

✅ Project working locally (`npm run dev` + `php artisan serve`)  
✅ SSH access to server configured  
✅ SSH key at `~/.ssh/avhira_deploy_rsa`  
✅ rsync installed (comes with Git for Windows)

## Server Structure

```
/home/u885878505/domains/avhira.com/
├── avhira/                          # Laravel application root
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env                         # Production environment config
│   ├── artisan
│   ├── composer.json
│   └── ...
├── public_html/                     # Web root (public folder)
│   ├── build/                       # Built frontend assets
│   │   ├── assets/
│   │   │   ├── app-XXXXX.js
│   │   │   └── app-XXXXX.css
│   │   └── manifest.json
│   ├── index.php                    # Laravel entry point
│   ├── .htaccess
│   ├── favicon.ico
│   └── robots.txt
└── backups/                         # Automatic backups
    └── manual_20251007_123456/
```

## Quick Deployment

### Option 1: Automated Script (Recommended)

```powershell
# Full deployment (build + upload + optimize)
.\deploy-manual.ps1

# Skip build (use existing build)
.\deploy-manual.ps1 -SkipBuild

# Skip backup
.\deploy-manual.ps1 -SkipBackup

# Skip both
.\deploy-manual.ps1 -SkipBuild -SkipBackup
```

The script will:
1. ✅ Build assets locally (`npm run build`)
2. ✅ Create backup on server
3. ✅ Upload application files to `/avhira/`
4. ✅ Upload build assets to `/public_html/build/`
5. ✅ Upload public files to `/public_html/`
6. ✅ Install Composer dependencies
7. ✅ Run Laravel optimizations
8. ✅ Verify deployment

**Time**: ~2-3 minutes

---

## Option 2: Manual Step-by-Step

### Step 1: Build Assets Locally

```powershell
# Build production assets
npm run build

# Verify build output
ls public/build/assets/
# Should see: app-XXXXX.js, app-XXXXX.css
```

### Step 2: Connect to Server

```powershell
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
```

### Step 3: Create Backup

```bash
cd /home/u885878505/domains/avhira.com/avhira
BACKUP_DIR="../backups/manual_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup important files
cp .env $BACKUP_DIR/.env
cp -r storage/app $BACKUP_DIR/storage_app
cp -r ../public_html/build $BACKUP_DIR/build_old

echo "Backup created at: $BACKUP_DIR"
```

### Step 4: Upload Application Files

From your **local machine** (exit SSH first):

```powershell
# Upload Laravel application (excluding build files)
rsync -avz --delete `
    -e "ssh -i `"$HOME\.ssh\avhira_deploy_rsa`" -p 65002" `
    --exclude='.git' `
    --exclude='.github' `
    --exclude='node_modules' `
    --exclude='vendor' `
    --exclude='tests' `
    --exclude='storage/logs/*' `
    --exclude='storage/framework/cache/*' `
    --exclude='.env' `
    --exclude='public/build' `
    ./ u885878505@89.117.188.174:/home/u885878505/domains/avhira.com/avhira/
```

### Step 5: Upload Build Assets

```powershell
# Upload build folder to public_html
rsync -avz --delete `
    -e "ssh -i `"$HOME\.ssh\avhira_deploy_rsa`" -p 65002" `
    ./public/build/ `
    u885878505@89.117.188.174:/home/u885878505/domains/avhira.com/public_html/build/
```

### Step 6: Upload Public Files

```powershell
# Upload public folder contents (index.php, etc.)
rsync -avz `
    -e "ssh -i `"$HOME\.ssh\avhira_deploy_rsa`" -p 65002" `
    --exclude='build' `
    --exclude='hot' `
    ./public/ `
    u885878505@89.117.188.174:/home/u885878505/domains/avhira.com/public_html/
```

### Step 7: Install Dependencies on Server

Connect back to SSH:

```bash
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/avhira

# Install Composer dependencies (production)
composer install --optimize-autoloader --no-dev --prefer-dist --no-interaction
```

### Step 8: Run Laravel Optimizations

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Create storage symlink
php artisan storage:link

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set permissions
chmod -R 775 storage bootstrap/cache
chmod -R 775 ../public_html/build
```

### Step 9: Verify Deployment

```bash
# Check Laravel version
php artisan --version

# Check build assets
ls -lh ../public_html/build/assets/

# Check storage link
ls -lh ../public_html/storage

# Test application
php artisan about
```

---

## Post-Deployment Checks

### 1. Visit Website
👉 https://avhira.com

### 2. Browser Console Check
Press `F12` → Console tab
- ✅ No red errors
- ✅ Assets loading (200 status)
- ✅ No 404 errors

### 3. Test Features
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product pages load
- [ ] Cart functionality
- [ ] User login/register
- [ ] Checkout flow

### 4. Check Laravel Logs
```bash
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/avhira
tail -f storage/logs/laravel.log
```

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Fix:**
```bash
cd /home/u885878505/domains/avhira.com/avhira

# Check permissions
chmod -R 775 storage bootstrap/cache

# Clear and recache
php artisan config:clear
php artisan cache:clear
php artisan config:cache

# Check logs
tail -50 storage/logs/laravel.log
```

### Issue: Assets not loading (404)

**Fix:**
```bash
# Verify build folder exists
ls -lh /home/u885878505/domains/avhira.com/public_html/build/assets/

# Re-upload if missing
# (Run rsync command from Step 5 again)

# Check manifest
cat /home/u885878505/domains/avhira.com/public_html/build/manifest.json
```

### Issue: Blank page / React not loading

**Fix:**
```bash
cd /home/u885878505/domains/avhira.com/avhira

# Check if pages exist
ls -lh resources/js/pages/

# Verify Inertia configuration
cat resources/js/app.jsx | grep -A 2 "resolvePageComponent"

# Clear view cache
php artisan view:clear
php artisan view:cache
```

### Issue: Database connection error

**Fix:**
```bash
cd /home/u885878505/domains/avhira.com/avhira

# Check .env database settings
cat .env | grep DB_

# Test connection
php artisan tinker
# Then: DB::connection()->getPdo();
# Should not throw error
```

---

## Rollback Procedure

If deployment fails:

```bash
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/avhira

# List backups
ls -la ../backups/

# Restore from latest backup
LATEST_BACKUP="../backups/manual_20251007_123456"  # Use actual backup name

# Restore .env
cp $LATEST_BACKUP/.env .env

# Restore storage
rm -rf storage/app/*
cp -r $LATEST_BACKUP/storage_app/* storage/app/

# Restore build
rm -rf ../public_html/build
cp -r $LATEST_BACKUP/build_old ../public_html/build

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan optimize

echo "✅ Rollback complete!"
```

---

## Best Practices

### Before Deployment
- ✅ Test thoroughly locally
- ✅ Commit all changes to Git
- ✅ Run `npm run build` successfully
- ✅ Check for errors in browser console
- ✅ Test all critical features

### During Deployment
- ✅ Create backup first
- ✅ Deploy during low traffic hours
- ✅ Monitor logs in real-time
- ✅ Keep SSH session open
- ✅ Have rollback plan ready

### After Deployment
- ✅ Test immediately after deploy
- ✅ Monitor error logs for 10-15 minutes
- ✅ Test on multiple browsers
- ✅ Check mobile responsiveness
- ✅ Verify all critical paths work

---

## Quick Commands Reference

```powershell
# Full automated deployment
.\deploy-manual.ps1

# Build only
npm run build

# Upload only (no build)
.\deploy-manual.ps1 -SkipBuild

# SSH connect
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Laravel optimize
cd /home/u885878505/domains/avhira.com/avhira
php artisan optimize

# Clear all caches
php artisan config:clear && php artisan cache:clear && php artisan view:clear && php artisan route:clear

# Check logs
tail -f storage/logs/laravel.log

# Check app status
php artisan about
```

---

## File Locations Quick Reference

| What | Local Path | Server Path |
|------|-----------|-------------|
| Laravel App | `./` | `/home/u885878505/domains/avhira.com/avhira/` |
| Public Files | `./public/` | `/home/u885878505/domains/avhira.com/public_html/` |
| Build Assets | `./public/build/` | `/home/u885878505/domains/avhira.com/public_html/build/` |
| Environment | `./.env` | `/home/u885878505/domains/avhira.com/avhira/.env` |
| Laravel Logs | N/A | `/home/u885878505/domains/avhira.com/avhira/storage/logs/` |

---

## Support

**Logs Location**: `/home/u885878505/domains/avhira.com/avhira/storage/logs/laravel.log`

**SSH Access**: `ssh -i ~/.ssh/avhira_deploy_rsa -p 65002 u885878505@89.117.188.174`

**Website**: https://avhira.com

---

**Ready to deploy? Run: `.\deploy-manual.ps1`** 🚀
