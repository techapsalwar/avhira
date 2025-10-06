# 🚀 Avhira - CI/CD Deployment Guide

## Complete Setup Guide for Hostinger Deployment

This guide will walk you through setting up automated deployment from GitHub to your Hostinger shared hosting.

---

## 📋 Prerequisites Checklist

- [x] GitHub repository: `techapsalwar/avhira`
- [x] Hostinger SSH Access:
  - Host: `89.117.188.174`
  - Port: `65002`
  - Username: `u885878505`
- [x] Laravel 12 Avhira Project
- [x] GitHub Actions workflow created

---

## 🔧 Step 1: Set Up Hostinger Server

### Connect to Your Hostinger Server

```bash
ssh -p 65002 u885878505@89.117.188.174
```

### Create Project Directory Structure

```bash
# Navigate to your web root (adjust path as needed)
cd ~/domains/yourdomain.com/public_html
# OR
cd ~/public_html

# Create the Avhira project structure
mkdir -p avhira/{releases,shared/{storage/{app,framework,logs},bootstrap/cache}}
cd avhira

# Create subdirectories for shared storage
mkdir -p shared/storage/framework/{cache,sessions,views}
mkdir -p shared/storage/app/{public,private}
```

### Create Shared .env File

```bash
# Create and edit the .env file
nano shared/.env
```

**Paste this configuration (update with your actual values):**

```env
APP_NAME=Avhira
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u885878505_avhira
DB_USERNAME=u885878505_avhira
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=avhirahouse@gmail.com
MAIL_PASSWORD=cdcizijafuamshib
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=avhirahouse@gmail.com
MAIL_FROM_NAME="Avhira"

RAZORPAY_KEY=rzp_live_RPrwNi6UTxcxc7
RAZORPAY_SECRET=FpDwSo2FUmWhB72yydyLaLJR
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Generate Application Key (if needed)

```bash
# Generate a new APP_KEY if you don't have one
php artisan key:generate --show
# Copy the output and update APP_KEY in shared/.env
```

### Set Up Database

1. **Log in to Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Create a new database: `u885878505_avhira`
4. Create a database user: `u885878505_avhira`
5. Set a strong password
6. Grant all privileges to the user on the database
7. Update the `.env` file with these credentials

### Configure Document Root

You need to point your domain to serve from `avhira/current/public`:

**Option 1: Via hPanel (Recommended)**
1. Go to **Domains** section
2. Select your domain
3. Click **Manage**
4. Change document root to: `/home/u885878505/domains/yourdomain.com/public_html/avhira/current/public`

**Option 2: Via SSH (if Option 1 not available)**
```bash
cd ~/domains/yourdomain.com
rm -rf public_html
ln -s ~/domains/yourdomain.com/avhira/current/public public_html
```

**Option 3: Via .htaccess Redirect**
```bash
cd ~/domains/yourdomain.com/public_html
nano .htaccess
```

Add:
```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/avhira/current/public
RewriteRule ^(.*)$ /avhira/current/public/$1 [L]
```

---

## 🔐 Step 2: Configure GitHub Secrets

1. **Go to your GitHub repository**: `https://github.com/techapsalwar/avhira`

2. **Navigate to Settings**:
   - Click **Settings** (top right)
   - Click **Secrets and variables** (left sidebar)
   - Click **Actions**
   - Click **New repository secret**

3. **Add the following secrets** (one by one):

| Secret Name | Value | Description |
|------------|-------|-------------|
| `SSH_HOST` | `89.117.188.174` | Hostinger server IP |
| `SSH_USERNAME` | `u885878505` | Your Hostinger username |
| `SSH_PASSWORD` | `your_ssh_password` | Your SSH/FTP password |
| `SSH_PORT` | `65002` | SSH port number |
| `PROJECT_PATH` | `/home/u885878505/domains/yourdomain.com/public_html/avhira` | Full path to project |

**Important Notes:**
- Replace `your_ssh_password` with your actual Hostinger password
- Replace `yourdomain.com` in `PROJECT_PATH` with your actual domain
- If your files are in `~/public_html` instead, use: `/home/u885878505/public_html/avhira`

### How to Add Each Secret:
1. Click **New repository secret**
2. Enter **Name** (e.g., `SSH_HOST`)
3. Enter **Secret** value (e.g., `89.117.188.174`)
4. Click **Add secret**
5. Repeat for all 5 secrets

---

## 🚀 Step 3: First Deployment

### Commit and Push the Workflow

From your local machine:

```bash
# Make sure you're in the project directory
cd e:\Avhira\avhirawebsite\avhira

# Add the GitHub Actions workflow
git add .github/

# Commit the changes
git commit -m "Add CI/CD deployment pipeline for Hostinger"

# Push to GitHub
git push origin main
```

### Monitor the Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see "Deploy to Hostinger" workflow running
4. Click on it to see live deployment logs

**Expected steps:**
1. ✅ Checkout code
2. ✅ Setup PHP 8.2
3. ✅ Install Composer dependencies
4. ✅ Setup Node.js
5. ✅ Install NPM dependencies
6. ✅ Build assets with Vite
7. ✅ Create deployment archive
8. ✅ Deploy to Hostinger via SCP
9. ✅ Execute deployment on server

---

## ✅ Step 4: Verify Deployment

### Check Deployment Status

**Via SSH:**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira  # or ~/public_html/avhira

# Check current symlink
ls -la current

# Check releases
ls -la releases/

# Should show something like:
# current -> releases/20250106-143022
```

### Test Your Website

1. Visit: `https://yourdomain.com`
2. Test these pages:
   - ✅ Homepage with hero carousel
   - ✅ Products page
   - ✅ Product details
   - ✅ Add to cart
   - ✅ Cart page
   - ✅ Checkout process
   - ✅ Login/Register

### Check Laravel Logs

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current
tail -50 storage/logs/laravel.log
```

---

## 🔄 Step 5: Subsequent Deployments

From now on, every time you push to `main`, deployment happens automatically!

```bash
# Make your changes
git add .
git commit -m "Update product carousel animation"
git push origin main
```

**That's it!** GitHub Actions will:
1. Build your assets
2. Deploy to Hostinger
3. Run migrations
4. Optimize Laravel
5. Clear old releases

---

## 🛠️ Common Tasks

### Manual Deployment Trigger

1. Go to **Actions** tab on GitHub
2. Select **Deploy to Hostinger** workflow
3. Click **Run workflow** dropdown
4. Click **Run workflow** button

### View Deployment Logs

```bash
ssh -p 65002 u885878505@89.117.188.174

# Laravel application logs
tail -f ~/domains/yourdomain.com/public_html/avhira/current/storage/logs/laravel.log

# Check current deployment
cd ~/domains/yourdomain.com/public_html/avhira
ls -la current
ls -la releases/
```

### Clear Cache After Deployment

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current

php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
```

### Run Migrations Manually

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan migrate --force
```

### Check Disk Space

```bash
ssh -p 65002 u885878505@89.117.188.174
df -h
du -sh ~/domains/yourdomain.com/public_html/avhira/*
```

---

## 🔙 Rollback Guide

If something goes wrong, you can quickly rollback:

### Quick Rollback

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# See available releases
ls -lt releases/

# Rollback to previous release (example: 20250106-120000)
ln -sfn releases/20250106-120000 current

echo "Rolled back to previous release"
```

### Restore from Backup

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# List backups
ls -lt backup-*.tar.gz

# Restore specific backup
tar -xzf backup-20250106-120000.tar.gz
rm -rf current
mv current-backup current  # If extracted as current-backup
```

---

## 🐛 Troubleshooting

### Issue 1: 500 Internal Server Error

**Solutions:**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current

# Fix permissions
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs

# Clear and rebuild cache
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
```

### Issue 2: Assets Not Loading (404 on CSS/JS)

**Solution:**
```bash
# Rebuild assets locally
npm run build
git add public/build
git commit -m "Rebuild assets"
git push

# Or check if build directory exists on server
ssh -p 65002 u885878505@89.117.188.174
ls -la ~/domains/yourdomain.com/public_html/avhira/current/public/build
```

### Issue 3: Database Connection Error

**Check:**
1. Database exists in hPanel
2. Database user has privileges
3. `.env` file has correct credentials
4. Database server is `localhost` not `127.0.0.1`

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current
cat shared/.env | grep DB_
```

### Issue 4: Permission Denied Errors

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# Fix all permissions
chmod -R 755 current/storage
chmod -R 755 current/bootstrap/cache
chmod -R 755 shared/storage

# Fix ownership
chown -R u885878505:u885878505 .
```

### Issue 5: Symlink Not Working

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# Remove and recreate current symlink
rm current
ln -sfn releases/$(ls -t releases | head -1) current

# Check if it worked
ls -la current
```

### Issue 6: GitHub Actions Fails - SSH Connection

**Check:**
1. GitHub Secrets are correct (no extra spaces)
2. SSH password is correct
3. Port is `65002` not `22`
4. Try SSH manually first:
   ```bash
   ssh -p 65002 u885878505@89.117.188.174
   ```

### Issue 7: Composer Memory Error

**Solution in workflow** - Already handled with `--no-dev --optimize-autoloader`

But if needed, update locally:
```bash
composer update --lock --no-dev
git add composer.lock
git commit -m "Update composer.lock"
git push
```

---

## 📊 Directory Structure

After successful deployment:

```
/home/u885878505/domains/yourdomain.com/public_html/avhira/
├── current -> releases/20250106-143022  (Symlink to active release)
├── releases/
│   ├── 20250106-143022/                 (Current - latest deployment)
│   ├── 20250106-135500/                 (Previous deployment)
│   └── 20250106-120000/                 (Older deployment)
├── shared/
│   ├── .env                             (Production environment file)
│   ├── storage/                         (Persistent storage)
│   │   ├── app/
│   │   ├── framework/
│   │   └── logs/
│   └── bootstrap/cache/                 (Persistent bootstrap cache)
├── backup-20250106-143022.tar.gz        (Automatic backup 1)
├── backup-20250106-135500.tar.gz        (Automatic backup 2)
└── backup-20250106-120000.tar.gz        (Automatic backup 3)
```

---

## ✅ Pre-Deployment Checklist

Before pushing to production:

- [ ] `.env` file configured in `shared/` directory
- [ ] Database created and credentials updated
- [ ] GitHub Secrets configured (all 5 secrets)
- [ ] Document root points to `current/public`
- [ ] SSH access works: `ssh -p 65002 u885878505@89.117.188.174`
- [ ] Project structure created on server
- [ ] Tested locally: `php artisan serve` and `npm run dev`
- [ ] All migrations ready: `php artisan migrate:status`
- [ ] Assets built: `npm run build`

---

## 🎯 Quick Reference

### SSH Connect
```bash
ssh -p 65002 u885878505@89.117.188.174
```

### Project Path
```bash
cd ~/domains/yourdomain.com/public_html/avhira
# or
cd ~/public_html/avhira
```

### Deploy Command
```bash
git push origin main
```

### View Logs
```bash
tail -f current/storage/logs/laravel.log
```

### Clear Cache
```bash
cd current
php artisan config:clear && php artisan cache:clear && php artisan view:clear
```

---

## 🎉 Success Checklist

After first deployment:

- [ ] Website loads: `https://yourdomain.com`
- [ ] Homepage displays correctly
- [ ] Hero carousel animates
- [ ] Products page works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] No 500 errors
- [ ] CSS/JS assets load
- [ ] Images display correctly
- [ ] Database connections work

---

## 📞 Support & Help

### Check Logs First
```bash
# Application logs
tail -100 current/storage/logs/laravel.log

# Check PHP errors in hPanel
# Go to: hPanel → Files → error_log
```

### Test Environment
```bash
cd current
php artisan about
php artisan config:show
```

### Verify Installation
```bash
cd current
php artisan --version
npm --version
composer --version
```

---

## 🚀 You're All Set!

Your Avhira e-commerce platform now has:

✅ **Automated Deployment** - Push and it deploys  
✅ **Zero Downtime** - Symlink switching  
✅ **Automatic Backups** - Last 5 deployments  
✅ **Easy Rollback** - Switch to any previous release  
✅ **Optimized Performance** - Cached routes, config, views  
✅ **Safe Migrations** - Auto-runs on deployment  
✅ **Asset Compilation** - Vite builds CSS/JS automatically  

**Happy Deploying!** 🎉

---

*Last Updated: October 6, 2025*
*Project: Avhira Premium Clothing Brand*
*Deployment: Hostinger Shared Hosting*
