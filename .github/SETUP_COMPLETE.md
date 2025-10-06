# 🚀 Complete CI/CD Setup - Avhira

## Overview
This guide will help you set up the complete CI/CD pipeline from scratch, including Git initialization, GitHub connection, and Hostinger deployment.

---

## ✅ What's Been Created

The following CI/CD files have been created in your project:

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow for automated deployment
2. **`.github/DEPLOYMENT_GUIDE.md`** - Complete deployment setup instructions
3. **`.github/QUICK_REFERENCE.md`** - Quick command reference
4. **`.github/TROUBLESHOOTING.md`** - Common issues and solutions
5. **`setup-github.ps1`** - PowerShell script to initialize Git and push to GitHub

---

## 🔥 Quick Start (5 Steps)

### Step 1: Initialize Git & Push to GitHub

**Option A: Using the Setup Script (Recommended)**
```powershell
# Run in PowerShell
cd e:\Avhira\avhirawebsite\avhira
.\setup-github.ps1
```

**Option B: Manual Setup**
```powershell
# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/techapsalwar/avhira.git

# Add all files
git add .

# Commit
git commit -m "Add CI/CD pipeline for automated Hostinger deployment"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**GitHub Authentication:**
- You'll be prompted for credentials
- **Username**: techapsalwar
- **Password**: Use a **Personal Access Token** (not your account password)

**How to Create Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Set name: "Avhira Deployment"
4. Select scopes: `repo`, `workflow`
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

### Step 2: Configure GitHub Secrets (2 minutes)

1. **Go to your repository settings:**
   ```
   https://github.com/techapsalwar/avhira/settings/secrets/actions
   ```

2. **Click "New repository secret"** and add each of these:

   | Secret Name | Value |
   |------------|-------|
   | `SSH_HOST` | `89.117.188.174` |
   | `SSH_USERNAME` | `u885878505` |
   | `SSH_PASSWORD` | Your Hostinger SSH/FTP password |
   | `SSH_PORT` | `65002` |
   | `PROJECT_PATH` | `/home/u885878505/public_html/avhira` |

   **Note:** If your files are under a domain folder, use:
   ```
   /home/u885878505/domains/yourdomain.com/public_html/avhira
   ```

---

### Step 3: Prepare Hostinger Server (5 minutes)

```bash
# SSH into your server
ssh -p 65002 u885878505@89.117.188.174

# Navigate to web root
cd ~/public_html
# OR if using domain folder:
# cd ~/domains/yourdomain.com/public_html

# Create project structure
mkdir -p avhira/{releases,shared/{storage/{app,framework,logs},bootstrap/cache}}
cd avhira

# Create subdirectories
mkdir -p shared/storage/framework/{cache,sessions,views}
mkdir -p shared/storage/app/{public,private}

# Create .env file
nano shared/.env
```

**Paste this configuration in the .env file:**
```env
APP_NAME=Avhira
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u885878505_avhira
DB_USERNAME=u885878505_avhira
DB_PASSWORD=your_database_password

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

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Generate APP_KEY if needed:**
```bash
# On your local machine
php artisan key:generate --show
# Copy the output and update APP_KEY in the .env file
```

---

### Step 4: Set Up Database (3 minutes)

1. **Log in to Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. **Create database:**
   - Name: `u885878505_avhira`
   - Click **Create**
4. **Create user:**
   - Username: `u885878505_avhira`
   - Password: (generate a strong password)
   - Click **Create**
5. **Add user to database:**
   - Select user: `u885878505_avhira`
   - Select database: `u885878505_avhira`
   - Grant **ALL PRIVILEGES**
   - Click **Add**
6. **Update .env file** on server with database credentials

---

### Step 5: Configure Document Root (2 minutes)

Your domain must point to `avhira/current/public` directory.

**Option A: Via hPanel (Recommended)**
1. Go to **Domains** section in hPanel
2. Click your domain
3. Click **Manage**
4. Change Document Root to:
   ```
   /home/u885878505/public_html/avhira/current/public
   ```
   OR if using domain folder:
   ```
   /home/u885878505/domains/yourdomain.com/public_html/avhira/current/public
   ```

**Option B: Via SSH**
```bash
cd ~/public_html
ln -s avhira/current/public public_html
```

---

## 🚀 Deploy!

Once everything is set up, trigger your first deployment:

**Option 1: Automatic (Push Code)**
```bash
# On your local machine
git add .
git commit -m "Initial deployment"
git push origin main
```

**Option 2: Manual Trigger**
1. Go to: https://github.com/techapsalwar/avhira/actions
2. Click **Deploy to Hostinger** workflow
3. Click **Run workflow** dropdown
4. Click **Run workflow** button

---

## 📊 Monitor Deployment

1. **Go to Actions tab:**
   ```
   https://github.com/techapsalwar/avhira/actions
   ```

2. **Click on the running workflow**

3. **Watch the steps execute:**
   - ✅ Checkout code
   - ✅ Setup PHP
   - ✅ Install Composer dependencies
   - ✅ Setup Node.js
   - ✅ Install NPM dependencies
   - ✅ Build assets with Vite
   - ✅ Create deployment archive
   - ✅ Deploy to Hostinger
   - ✅ Execute deployment commands

**Expected time:** 2-3 minutes

---

## ✅ Verify Deployment

1. **Visit your website:**
   ```
   https://yourdomain.com
   ```

2. **Test these pages:**
   - ✅ Homepage (with animated hero carousel)
   - ✅ Products page
   - ✅ Product details
   - ✅ Cart functionality
   - ✅ Checkout process
   - ✅ User registration/login

3. **Check deployment on server:**
   ```bash
   ssh -p 65002 u885878505@89.117.188.174
   cd ~/public_html/avhira  # or your project path
   ls -la current  # Should show symlink to latest release
   ls -la releases/  # Should show timestamp directory
   ```

---

## 🎉 Success! What Next?

### Automated Workflow
Every time you push code to the `main` branch:
1. GitHub Actions automatically triggers
2. Builds your assets (CSS/JS)
3. Deploys to Hostinger
4. Runs database migrations
5. Optimizes Laravel
6. Zero downtime deployment

### Making Changes
```bash
# Edit files locally
git add .
git commit -m "Update product page"
git push origin main
# ✅ Auto-deploys!
```

### Monitoring
- Check **Actions tab** after every push
- View deployment logs in real-time
- Get notified of any failures

---

## 📚 Documentation

All comprehensive guides are in the `.github/` directory:

1. **DEPLOYMENT_GUIDE.md** - Complete setup and deployment instructions
2. **QUICK_REFERENCE.md** - Quick commands and common tasks
3. **TROUBLESHOOTING.md** - Solutions to common issues

---

## 🐛 Common Issues

### Issue: Git push requires authentication
**Solution:** Use Personal Access Token instead of password (see Step 1)

### Issue: GitHub Actions fails with SSH error
**Solution:** Verify GitHub Secrets are correctly configured (no extra spaces)

### Issue: Website shows 500 error after deployment
**Solution:**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/public_html/avhira/current
chmod -R 755 storage bootstrap/cache
php artisan config:cache
```

### Issue: Assets not loading (CSS/JS)
**Solution:** Check if `public/build` directory exists on server

### Issue: Database connection error
**Solution:** Verify database credentials in `shared/.env`

**For more issues, see:** `.github/TROUBLESHOOTING.md`

---

## 🔐 Security Checklist

- [ ] GitHub Secrets configured correctly
- [ ] Strong database password
- [ ] `.env` file not committed to git
- [ ] Production Razorpay keys configured
- [ ] APP_DEBUG=false in production
- [ ] File permissions set correctly (755 for storage)

---

## ✨ Features You Now Have

✅ **Automated Deployment** - Push and deploy instantly  
✅ **Zero Downtime** - Seamless updates  
✅ **Automatic Backups** - Last 5 deployments saved  
✅ **Easy Rollback** - Switch to previous version anytime  
✅ **Asset Compilation** - Vite builds CSS/JS automatically  
✅ **Database Migrations** - Auto-runs on deployment  
✅ **Laravel Optimization** - Cached config, routes, views  
✅ **Release Management** - Keeps last 3 releases  

---

## 📞 Need Help?

1. **Check documentation:** `.github/DEPLOYMENT_GUIDE.md`
2. **Check troubleshooting:** `.github/TROUBLESHOOTING.md`
3. **Check GitHub Actions logs:** Shows detailed error messages
4. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

---

## 🎯 Quick Commands Reference

```bash
# Deploy
git push origin main

# SSH to server
ssh -p 65002 u885878505@89.117.188.174

# View logs
tail -f current/storage/logs/laravel.log

# Clear cache
cd current && php artisan optimize:clear

# Rollback
cd avhira && ln -sfn releases/PREVIOUS_RELEASE current
```

---

**You're all set! Happy deploying!** 🚀

*CI/CD Pipeline Status: ✅ Ready*  
*Deployment Method: GitHub Actions*  
*Target: Hostinger Shared Hosting*  
*Time to Deploy: ~2-3 minutes*
