# 🎭 Staging & Maintenance Mode - Quick Start

This directory contains tools for managing staging environment and maintenance mode for Avhira.

---

## 📋 Files Overview

| File | Purpose |
|------|---------|
| `503.blade.php` | Beautiful custom maintenance page |
| `setup-staging.ps1` | Automated staging environment setup |
| `maintenance-mode.ps1` | Quick maintenance mode management |

---

## 🛠️ Maintenance Mode

### Quick Commands

```powershell
# Enable maintenance mode
.\maintenance-mode.ps1 -Action enable

# Enable with custom message
.\maintenance-mode.ps1 -Action enable -Message "Deploying new features! Back in 10 minutes."

# Enable with secret bypass URL
.\maintenance-mode.ps1 -Action enable -Secret "avhira2025" -Message "Maintenance in progress"

# Check status
.\maintenance-mode.ps1 -Action status

# Disable maintenance mode
.\maintenance-mode.ps1 -Action disable
```

### Options

- **`-Action`** (required): `enable`, `disable`, or `status`
- **`-Message`**: Custom message to display on maintenance page
- **`-Retry`**: Seconds to wait before retry (default: 300)
- **`-Secret`**: Secret token to bypass maintenance mode

### Example: Scheduled Maintenance

```powershell
# Before deployment
.\maintenance-mode.ps1 -Action enable `
  -Message "Scheduled maintenance. Back at 3 PM EST." `
  -Secret "deploy2025" `
  -Retry 600

# Your site is now showing maintenance page
# You can access it via: https://avhira.com/deploy2025

# Deploy your changes...
git push origin main

# After deployment
.\maintenance-mode.ps1 -Action disable
```

---

## 🎭 Staging Environment

### Setup (One-Time)

#### Step 1: Run Setup Script

```powershell
.\setup-staging.ps1
```

This will:
- ✅ Create staging directories
- ✅ Copy production code to staging
- ✅ Create staging .env file
- ✅ Setup storage symlinks
- ✅ Copy build assets
- ✅ Set proper permissions

#### Step 2: Create Staging Database

1. **Login to Hostinger Panel**: https://hpanel.hostinger.com
2. **Navigate**: Websites → avhira.com → Databases
3. **Create Database**:
   ```
   Database name: u885878505_avhira_staging
   Database user: u885878505_avhira_staging
   Password: [Choose strong password]
   ```

#### Step 3: Update Staging .env

```powershell
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Edit staging .env
cd /home/u885878505/domains/avhira.com/staging_avhira
nano .env

# Update these values:
# DB_PASSWORD=your_staging_password
# APP_KEY will be generated automatically

# Save: Ctrl+X, Y, Enter
```

#### Step 4: Create Subdomain in Hostinger

1. **Hostinger Panel** → Websites → avhira.com → Subdomains
2. **Click "Create Subdomain"**
3. **Fill in**:
   ```
   Subdomain: staging
   Full domain: staging.avhira.com
   Document Root: /home/u885878505/domains/avhira.com/staging_html
   ```
4. **Click Create**
5. **Wait 5-10 minutes** for DNS propagation

#### Step 5: Run Migrations

```powershell
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Run migrations
cd /home/u885878505/domains/avhira.com/staging_avhira
php artisan migrate:fresh --seed

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Exit
exit
```

#### Step 6: Visit Staging

🌐 **https://staging.avhira.com**

---

## 🔄 Workflow: Development → Staging → Production

### Daily Development Workflow

```powershell
# 1. Develop feature locally
git checkout -b feature/new-feature
# Make changes...
npm run dev
php artisan serve

# 2. Create staging branch (first time)
git checkout -b staging
git push -u origin staging

# 3. Merge feature to staging
git checkout staging
git merge feature/new-feature
git push origin staging

# 4. Deploy to staging (manual)
# SSH and pull on staging
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/staging_avhira
git pull origin staging
npm install && npm run build
cp -r public/build ../staging_html/build
php artisan migrate
php artisan cache:clear && php artisan config:cache
exit

# 5. Test on staging
# Visit: https://staging.avhira.com
# Test all features thoroughly

# 6. If tests pass, deploy to production
git checkout main
git merge staging

# Enable maintenance mode
.\maintenance-mode.ps1 -Action enable -Message "Deploying updates. Back in 5 minutes."

# Push to production (auto-deploys via GitHub Actions)
git push origin main

# Wait 3-5 minutes for deployment...

# Disable maintenance mode
.\maintenance-mode.ps1 -Action disable
```

---

## 📊 Common Scenarios

### Scenario 1: Quick Bug Fix (Skip Staging)

```powershell
# Fix bug locally
git checkout main
git pull origin main
# Fix the bug...

# Enable maintenance
.\maintenance-mode.ps1 -Action enable -Message "Fixing critical bug. Back in 3 minutes."

# Deploy
git add .
git commit -m "fix: critical bug"
git push origin main

# Wait for deployment...
# Disable maintenance
.\maintenance-mode.ps1 -Action disable
```

### Scenario 2: Major Feature (Full Testing)

```powershell
# Develop on feature branch
git checkout -b feature/major-update
# Develop...

# Merge to staging
git checkout staging
git merge feature/major-update
git push origin staging

# Deploy to staging (manual SSH update)

# Test thoroughly on staging.avhira.com
# Test for 1-2 days

# If all good, deploy to production
git checkout main
git merge staging
.\maintenance-mode.ps1 -Action enable -Message "Major update! New features coming."
git push origin main
# Wait...
.\maintenance-mode.ps1 -Action disable
```

### Scenario 3: Database Changes

```powershell
# Enable maintenance (important for migrations)
.\maintenance-mode.ps1 -Action enable -Message "Database maintenance. Back in 10 minutes." -Retry 600

# Deploy with migrations
git push origin main

# Migrations run automatically in workflow

# Disable maintenance
.\maintenance-mode.ps1 -Action disable
```

---

## 🎨 Customizing Maintenance Page

The maintenance page is located at `resources/views/errors/503.blade.php`

### Customize Message

When enabling maintenance mode:

```powershell
.\maintenance-mode.ps1 -Action enable -Message "Your custom message here"
```

### Customize Design

Edit `resources/views/errors/503.blade.php`:

```blade
{{-- Change colors --}}
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);

{{-- Update contact email --}}
<strong>support@yourdomain.com</strong>

{{-- Update social links --}}
<a href="https://twitter.com/yourhandle">Twitter</a>
```

After editing, commit and push:

```powershell
git add resources/views/errors/503.blade.php
git commit -m "style: update maintenance page design"
git push origin main
```

---

## 🔍 Troubleshooting

### Issue: Staging shows "500 Error"

```powershell
# SSH and check logs
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/staging_avhira
tail -50 storage/logs/laravel.log

# Fix permissions
chmod -R 775 storage bootstrap/cache

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Issue: Maintenance mode not working

```powershell
# Check if file exists
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/avhira
ls -la storage/framework/down

# Manually remove if stuck
rm -f storage/framework/down
php artisan up
```

### Issue: Staging subdomain not accessible

1. **Wait for DNS**: Can take up to 24 hours
2. **Check document root**: Should be `/home/u885878505/domains/avhira.com/staging_html`
3. **Clear browser cache**: Ctrl+Shift+Delete

---

## ✅ Best Practices

### DO:
- ✅ Always test on staging before production
- ✅ Use maintenance mode for database migrations
- ✅ Keep staging database separate from production
- ✅ Test payment gateways in test mode on staging
- ✅ Schedule maintenance during low-traffic hours

### DON'T:
- ❌ Don't skip staging for "quick fixes" (unless critical)
- ❌ Don't use production database for staging
- ❌ Don't leave maintenance mode enabled unnecessarily
- ❌ Don't use real customer emails in staging
- ❌ Don't deploy on Friday evening 😅

---

## 📚 Additional Resources

- **Full Guide**: See `docs/staging-and-maintenance` branch for detailed documentation
- **Deployment Guide**: `DEPLOYMENT_LEARNINGS_REPORT.md`
- **CI/CD Workflow**: `.github/workflows/deploy.yml`

---

## 🚀 Quick Reference

```powershell
# Maintenance Mode
.\maintenance-mode.ps1 -Action enable          # Enable
.\maintenance-mode.ps1 -Action disable         # Disable
.\maintenance-mode.ps1 -Action status          # Check

# Staging
.\setup-staging.ps1                            # Initial setup
# Visit: https://staging.avhira.com

# SSH Access
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
```

---

**Last Updated**: October 11, 2025  
**Status**: Ready to Use ✅
