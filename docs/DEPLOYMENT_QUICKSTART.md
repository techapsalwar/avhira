# Hostinger Deployment - Quick Start Guide

## Prerequisites Checklist
- [ ] Hostinger shared hosting account active
- [ ] Domain `avhira.com` configured and pointing to Hostinger
- [ ] GitHub repository created and code pushed
- [ ] SSH access enabled on Hostinger account

## 5-Minute Setup

### Step 1: Generate SSH Key (2 minutes)
```powershell
# On your local machine (PowerShell)
cd ~\.ssh
ssh-keygen -t ed25519 -a 200 -C "github-actions@avhira.com"
# Save as: avhira_deploy
# Passphrase: Press Enter (leave empty)
```

### Step 2: Add Public Key to Hostinger (1 minute)
```powershell
# Copy public key to clipboard
Get-Content ~\.ssh\avhira_deploy.pub | Set-Clipboard

# Then:
# 1. Login to Hostinger control panel
# 2. Go to Advanced → SSH Access → Manage SSH Keys
# 3. Click "Add New SSH Key"
# 4. Paste the public key and save
```

### Step 3: Add Secrets to GitHub (2 minutes)
```powershell
# Copy private key to clipboard
Get-Content ~\.ssh\avhira_deploy | Set-Clipboard

# Then go to GitHub:
# 1. Repository → Settings → Secrets and variables → Actions
# 2. Click "New repository secret" and add these:
```

| Secret Name | Where to Find | Example |
|------------|---------------|---------|
| `HOSTINGER_HOST` | Your domain or server IP | `avhira.com` |
| `HOSTINGER_USERNAME` | Hostinger panel → SSH Access | `ssh -p 65002 u885878505@89.117.188.174` |
| `HOSTINGER_SSH_KEY` | Content from clipboard (private key) | `-----BEGIN OPENSSH...` |
| `HOSTINGER_PORT` | Usually 22 | `22` |
| `HOSTINGER_APP_PATH` | Full path to your app | `/home/u885878505/domains/avhira.com/public_html` |

**How to find your username and path:**
- Login to Hostinger control panel
- Go to **Advanced → SSH Access**
- Username will be shown (e.g., `u123456789`)
- Path format: `/home/[username]/domains/[yourdomain]/public_html`

## First Deployment

### Option A: Via GitHub Push (Recommended)
```bash
git add .
git commit -m "Deploy: Initial setup"
git push origin main
```

Then watch deployment at: `https://github.com/[your-username]/[your-repo]/actions`

### Option B: Manual Trigger
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Hostinger** workflow
4. Click **Run workflow** → **Run workflow**

## Server Setup (One-Time Only)

### 1. SSH to Hostinger
```powershell
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
```

### 2. Set Document Root
In Hostinger control panel:
- Go to **Websites → [yourdomain] → Advanced → Document Root**
- Change to: `/home/u123456789/domains/avhira.com/public_html/public`
- Save

### 3. Create Database
In Hostinger control panel:
- Go to **Databases → MySQL Databases**
- Create new database: `u123456789_avhira`
- Create user with same name and secure password
- Grant all privileges
- **Note down database name, username, and password**

### 4. Create .env File
```bash
# Still in SSH
cd /home/u123456789/domains/avhira.com/public_html
nano .env
```

Paste this and update with your values:
```env
APP_NAME=Avhira
APP_ENV=production
APP_KEY=base64:RtNOWVw8tbeQAeLcb1sStP5oR5DWZgDbstLcVqDLwmI=
APP_DEBUG=false
APP_URL=https://avhira.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_avhira
DB_USERNAME=u123456789_avhira
DB_PASSWORD=YOUR_DATABASE_PASSWORD

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

SESSION_DRIVER=file
QUEUE_CONNECTION=database
```

Save with: `Ctrl+X`, then `Y`, then `Enter`

### 5. Run Initial Setup
```bash
# Still in SSH
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Verify Deployment

1. **Check GitHub Actions**
   - Go to Actions tab in GitHub
   - Ensure deployment completed successfully (green checkmark)

2. **Visit Your Site**
   - Open browser: `https://avhira.com`
   - Should see your landing page

3. **Check Logs** (if issues)
   ```bash
   ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
   cd /home/u123456789/domains/avhira.com/public_html
   tail -f storage/logs/laravel.log
   ```

## Common Issues & Quick Fixes

### Issue: "Permission denied (publickey)"
**Fix:**
```powershell
# Test SSH connection
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com

# If fails, re-add public key to Hostinger
Get-Content ~\.ssh\avhira_deploy.pub | Set-Clipboard
# Go to Hostinger → SSH Access → Add Key
```

### Issue: "500 Internal Server Error"
**Fix:**
```bash
# SSH to server
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
cd /home/u123456789/domains/avhira.com/public_html

# Set permissions
chmod -R 775 storage bootstrap/cache

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Check logs
tail -20 storage/logs/laravel.log
```

### Issue: "Database connection failed"
**Fix:**
```bash
# SSH to server
nano .env
# Verify DB_DATABASE, DB_USERNAME, DB_PASSWORD match Hostinger database
# Save and exit

# Clear config cache
php artisan config:clear
```

### Issue: "Assets not loading (CSS/JS 404)"
**Fix:**
1. Hostinger panel → Advanced → Document Root
2. Ensure it's set to: `/home/u123456789/domains/avhira.com/public_html/public`
3. Save and wait 2-3 minutes for propagation

## Daily Workflow

### Making Changes
```bash
# 1. Make your changes locally
# 2. Test locally: npm run dev
# 3. Build for production: npm run build
# 4. Commit and push
git add .
git commit -m "feat: Added new feature"
git push origin main

# 5. GitHub Actions will automatically deploy
# 6. Check Actions tab for progress
# 7. Verify live site: https://avhira.com
```

### Rollback if Needed
```bash
# SSH to server
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
cd /home/u123456789/domains/avhira.com/public_html

# List backups
ls -la backups/

# Restore from backup
cp backups/latest/.env .env
php artisan config:clear
php artisan cache:clear
php artisan up
```

## Need Help?

- **Full Documentation**: See `docs/CI_CD.md` for detailed guide
- **Laravel Logs**: `storage/logs/laravel.log` on server
- **GitHub Actions Logs**: Repository → Actions → Select workflow
- **Hostinger Support**: Available 24/7 via chat

## Next Steps

- [ ] Set up SSL certificate (Hostinger provides free SSL)
- [ ] Configure custom error pages
- [ ] Set up email service (SMTP or Hostinger email)
- [ ] Enable cron jobs for Laravel scheduler
- [ ] Add monitoring (UptimeRobot, etc.)
- [ ] Set up database backups

---

**🎉 Congratulations! Your CI/CD pipeline is ready!**

Every push to `main` branch will now automatically deploy to avhira.com.