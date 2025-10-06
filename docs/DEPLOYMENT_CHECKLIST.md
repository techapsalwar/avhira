# 📋 Hostinger Deployment Checklist

Use this checklist to ensure successful deployment to Hostinger shared hosting.

## Pre-Deployment Setup

### ☐ Local Environment
- [ ] Application runs successfully on local server (`php artisan serve`)
- [ ] All tests pass (if applicable)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] No `.env` file in git (check `.gitignore`)
- [ ] All changes committed to git
- [ ] Repository pushed to GitHub

### ☐ Hostinger Account
- [ ] Hostinger shared hosting account active
- [ ] Domain `avhira.com` added and verified
- [ ] DNS pointing to Hostinger servers
- [ ] SSH access enabled in control panel

### ☐ GitHub Repository
- [ ] Repository created on GitHub
- [ ] All code pushed to repository
- [ ] `main` branch exists and up to date
- [ ] Actions enabled (Settings → Actions → Allow all actions)

## SSH Key Setup

### ☐ Generate SSH Key (Local Machine)
```powershell
# Windows PowerShell
cd ~\.ssh
ssh-keygen -t ed25519 -a 200 -C "github-actions@avhira.com"
# Save as: avhira_deploy
# Passphrase: [Leave empty - just press Enter]
```

- [ ] Key generated successfully
- [ ] Files created: `avhira_deploy` and `avhira_deploy.pub`

### ☐ Add Public Key to Hostinger
```powershell
Get-Content ~\.ssh\avhira_deploy.pub | Set-Clipboard
```

- [ ] Public key copied to clipboard
- [ ] Logged into Hostinger control panel
- [ ] Navigated to: Advanced → SSH Access
- [ ] Clicked "Add New SSH Key"
- [ ] Pasted public key and saved
- [ ] Key status shows as "Active"

### ☐ Test SSH Connection
```powershell
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
# Replace u123456789 with your Hostinger username
```

- [ ] Connection successful (no password prompt)
- [ ] Can see server shell prompt
- [ ] Exited with `exit` command

## GitHub Secrets Configuration

### ☐ Gather Required Information
- [ ] Hostinger hostname: `________________` (usually your domain or IP)
- [ ] SSH username: `________________` (found in Hostinger SSH Access page)
- [ ] SSH port: `________________` (usually 22)
- [ ] Application path: `________________` (e.g., `/home/u123456789/domains/avhira.com/public_html`)

### ☐ Add Secrets to GitHub
Navigate to: **GitHub Repository → Settings → Secrets and variables → Actions**

#### Secret 1: HOSTINGER_HOST
- [ ] Click "New repository secret"
- [ ] Name: `HOSTINGER_HOST`
- [ ] Value: Your domain or server IP
- [ ] Click "Add secret"

#### Secret 2: HOSTINGER_USERNAME
- [ ] Click "New repository secret"
- [ ] Name: `HOSTINGER_USERNAME`
- [ ] Value: Your SSH username (e.g., u123456789)
- [ ] Click "Add secret"

#### Secret 3: HOSTINGER_SSH_KEY
```powershell
Get-Content ~\.ssh\avhira_deploy | Set-Clipboard
```
- [ ] Private key copied to clipboard
- [ ] Click "New repository secret"
- [ ] Name: `HOSTINGER_SSH_KEY`
- [ ] Value: Paste entire private key (including BEGIN/END lines)
- [ ] Click "Add secret"

#### Secret 4: HOSTINGER_PORT
- [ ] Click "New repository secret"
- [ ] Name: `HOSTINGER_PORT`
- [ ] Value: `22` (or custom port if different)
- [ ] Click "Add secret"

#### Secret 5: HOSTINGER_APP_PATH
- [ ] Click "New repository secret"
- [ ] Name: `HOSTINGER_APP_PATH`
- [ ] Value: Full path to your application (e.g., `/home/u123456789/domains/avhira.com/public_html`)
- [ ] Click "Add secret"

### ☐ Verify Secrets
- [ ] All 5 secrets are listed in GitHub
- [ ] No typos in secret names (case-sensitive!)
- [ ] Secret values are correct (click Update if needed)

## Hostinger Server Setup

### ☐ Connect to Server
```powershell
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
```

### ☐ Verify PHP Version
```bash
php -v
# Should be PHP 8.2 or higher
```
- [ ] PHP version is compatible (8.2+)

### ☐ Check Composer
```bash
composer --version
```
- [ ] Composer is installed
- [ ] If not, install via Hostinger control panel

### ☐ Set Document Root
In Hostinger Control Panel:
- [ ] Navigate to: Websites → [Your Domain] → Advanced
- [ ] Find "Document Root" setting
- [ ] Change to: `/home/u123456789/domains/avhira.com/public_html/public`
- [ ] Save changes
- [ ] Wait 2-3 minutes for changes to propagate

### ☐ Create MySQL Database
In Hostinger Control Panel:
- [ ] Navigate to: Databases → MySQL Databases
- [ ] Click "Create New Database"
- [ ] Database name: `u123456789_avhira`
- [ ] Click "Create"
- [ ] Create database user with same name
- [ ] Generate strong password
- [ ] Grant all privileges to user
- [ ] **Record credentials**:
  - Database name: `________________`
  - Username: `________________`
  - Password: `________________`

### ☐ Create Application Directory
```bash
cd ~
mkdir -p domains/avhira.com/public_html
cd domains/avhira.com/public_html
```
- [ ] Directory created successfully

### ☐ Create .env File
```bash
nano .env
```

Paste this template and update with your values:
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
DB_PASSWORD=your_database_password_here

RAZORPAY_KEY=your_razorpay_key_here
RAZORPAY_SECRET=your_razorpay_secret_here

SESSION_DRIVER=file
QUEUE_CONNECTION=database
CACHE_STORE=file
```

- [ ] .env file created
- [ ] Database credentials updated
- [ ] APP_URL set to your domain
- [ ] Saved with: Ctrl+X, Y, Enter

### ☐ Set Permissions
```bash
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs storage/framework
```
- [ ] Directories created
- [ ] Permissions set correctly

## First Deployment

### ☐ Deploy via GitHub
```bash
# On local machine
git add .
git commit -m "chore: Initial deployment setup"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Navigate to: GitHub → Repository → Actions
- [ ] Workflow "Deploy to Hostinger" is running
- [ ] Watch deployment progress

### ☐ Monitor Deployment
- [ ] Build stage completed (green checkmark)
- [ ] Package stage completed
- [ ] Deploy stage completed
- [ ] Final status: Success ✅

### ☐ Post-Deployment Server Tasks
```bash
# SSH back to server
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
cd /home/u123456789/domains/avhira.com/public_html

# Run initial setup
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

- [ ] All commands executed successfully
- [ ] No errors in output

## Verification

### ☐ Check Application
- [ ] Open browser: `https://avhira.com`
- [ ] Landing page loads successfully
- [ ] Images load correctly
- [ ] CSS styles applied
- [ ] JavaScript works (interactive elements)
- [ ] Navigation works

### ☐ Test Features
- [ ] User registration works
- [ ] Login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process accessible
- [ ] Admin panel accessible (if implemented)

### ☐ Check Logs
```bash
ssh -i ~\.ssh\avhira_deploy u123456789@avhira.com
cd /home/u123456789/domains/avhira.com/public_html
tail -50 storage/logs/laravel.log
```
- [ ] No critical errors in logs
- [ ] Log file exists and is writable

### ☐ SSL Certificate
In Hostinger Control Panel:
- [ ] Navigate to: Websites → [Domain] → SSL
- [ ] SSL certificate installed (Hostinger provides free)
- [ ] Force HTTPS enabled
- [ ] Site accessible via `https://`

## Optional Enhancements

### ☐ Laravel Scheduler
In Hostinger Control Panel:
- [ ] Navigate to: Advanced → Cron Jobs
- [ ] Add new cron job:
  ```
  * * * * * cd /home/u123456789/domains/avhira.com/public_html && php artisan schedule:run >> /dev/null 2>&1
  ```
- [ ] Save cron job

### ☐ Queue Worker (Optional)
If using queues:
```bash
# Create supervisor config or use Hostinger's process manager
```
- [ ] Queue worker configured
- [ ] Worker is running

### ☐ Error Monitoring
- [ ] Sentry/Bugsnag configured (optional)
- [ ] Error notifications set up

### ☐ Performance Monitoring
- [ ] UptimeRobot or similar configured
- [ ] Health check endpoint created
- [ ] Monitoring active

### ☐ Backup Strategy
- [ ] Database backup schedule configured
- [ ] File backup schedule configured
- [ ] Backup retention policy set

## Troubleshooting

### ☐ Common Issues Checked

#### If deployment fails:
- [ ] Check GitHub Actions logs for specific error
- [ ] Verify all GitHub secrets are correct
- [ ] Test SSH connection manually
- [ ] Check Hostinger server disk space
- [ ] Verify PHP/Composer versions

#### If site shows 500 error:
- [ ] Check storage permissions: `chmod -R 775 storage`
- [ ] Verify .env file exists and is correct
- [ ] Check database connection
- [ ] Review Laravel logs: `storage/logs/laravel.log`
- [ ] Clear caches: `php artisan cache:clear && php artisan config:clear`

#### If assets don't load:
- [ ] Document root points to `/public` directory
- [ ] Run: `php artisan storage:link`
- [ ] Check .htaccess file exists in public/
- [ ] Clear browser cache

#### If database errors:
- [ ] Database exists in Hostinger control panel
- [ ] Database credentials correct in .env
- [ ] User has proper privileges
- [ ] Run migrations: `php artisan migrate --force`

## Final Checklist

### ☐ Documentation
- [ ] Team members know how to deploy (push to main)
- [ ] Rollback procedure documented and tested
- [ ] Troubleshooting guide accessible

### ☐ Security
- [ ] APP_DEBUG=false in production
- [ ] .env file not in git repository
- [ ] SSH keys secured
- [ ] Database password is strong
- [ ] HTTPS enabled and forced

### ☐ Performance
- [ ] Laravel caches optimized
- [ ] Production assets built and minified
- [ ] OPcache enabled on server
- [ ] Database indexed properly

### ☐ Monitoring
- [ ] Deployment notifications working
- [ ] Error monitoring active
- [ ] Uptime monitoring configured
- [ ] Log rotation working

## 🎉 Deployment Complete!

- [ ] **All items checked above**
- [ ] Application is live at: `https://avhira.com`
- [ ] CI/CD pipeline working (push to main = auto deploy)
- [ ] Team notified of go-live

---

## Notes & Issues

Use this space to document any issues encountered or notes for future reference:

```
Issue:
_______________________________________________________________

Solution:
_______________________________________________________________

Date: _______________
```

---

## Support Resources

- **Full CI/CD Guide**: `docs/CI_CD.md`
- **Quick Start**: `docs/DEPLOYMENT_QUICKSTART.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **Hostinger Support**: 24/7 live chat
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Laravel Deployment**: https://laravel.com/docs/deployment

---

**Last Updated**: January 15, 2025  
**Completed By**: _______________  
**Completion Date**: _______________