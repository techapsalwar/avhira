# 🔧 Deployment Troubleshooting - Avhira

Quick solutions to common deployment issues.

---

## 🔴 Issue 1: GitHub Actions Fails - SSH Connection

### Error Message:
```
Permission denied (publickey,password)
```

### Solutions:

**A. Verify GitHub Secrets**
1. Go to: Repository → Settings → Secrets → Actions
2. Check these secrets exist and are correct:
   - `SSH_HOST`: `89.117.188.174`
   - `SSH_USERNAME`: `u885878505`
   - `SSH_PASSWORD`: Your Hostinger password (no spaces!)
   - `SSH_PORT`: `65002`
   - `PROJECT_PATH`: `/home/u885878505/domains/yourdomain.com/public_html/avhira`

**B. Test SSH Manually**
```bash
ssh -p 65002 u885878505@89.117.188.174
# If this works, GitHub Actions should too
```

**C. Reset SSH Password**
1. Log in to Hostinger hPanel
2. Go to Advanced → SSH Access
3. Reset password if needed
4. Update `SSH_PASSWORD` secret on GitHub

---

## 🔴 Issue 2: 500 Internal Server Error After Deployment

### Causes & Solutions:

**A. Check .env File**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current
ls -la .env  # Should exist and be a symlink

# If missing:
cd ~/domains/yourdomain.com/public_html/avhira/shared
nano .env  # Create/edit .env file
```

**B. Fix File Permissions**
```bash
cd ~/domains/yourdomain.com/public_html/avhira
chmod -R 755 current/storage
chmod -R 755 current/bootstrap/cache
chmod -R 775 current/storage/logs
chmod -R 755 shared/storage
```

**C. Clear and Rebuild Caches**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**D. Check Laravel Logs**
```bash
tail -50 ~/domains/yourdomain.com/public_html/avhira/current/storage/logs/laravel.log
```

**E. Check PHP Error Logs**
- In hPanel: Files → error_log (in public_html)

---

## 🔴 Issue 3: Assets Not Loading (CSS/JS 404)

### Error: 
White page or unstyled page, console shows 404 for CSS/JS

### Solutions:

**A. Check Build Directory Exists**
```bash
ssh -p 65002 u885878505@89.117.188.174
ls -la ~/domains/yourdomain.com/public_html/avhira/current/public/build
# Should show manifest.json and assets
```

**B. Rebuild Assets Locally**
```bash
# On your local machine
npm run build
git add public/build
git commit -m "Rebuild Vite assets"
git push origin main
```

**C. Check Asset Paths**
Verify in `vite.config.ts`:
```javascript
export default defineConfig({
    build: {
        manifest: true,
        outDir: 'public/build',
    },
});
```

**D. Clear Browser Cache**
- Press `Ctrl+Shift+R` (hard reload)
- Or clear browser cache completely

---

## 🔴 Issue 4: Database Connection Error

### Error:
```
SQLSTATE[HY000] [1045] Access denied for user
```

### Solutions:

**A. Verify Database Credentials**
```bash
ssh -p 65002 u885878505@89.117.188.174
cat ~/domains/yourdomain.com/public_html/avhira/shared/.env | grep DB_
```

**B. Check Database Exists**
1. Log in to hPanel
2. Go to Databases → MySQL Databases
3. Verify database exists: `u885878505_avhira`
4. Verify user exists and has privileges

**C. Use Correct Host**
```env
DB_HOST=localhost  # NOT 127.0.0.1
```

**D. Test Connection**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan tinker
DB::connection()->getPdo();  # Should return PDO object
exit
```

---

## 🔴 Issue 5: Deployment Succeeds but Changes Not Visible

### Solutions:

**A. Clear Laravel Cache**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**B. Check Current Symlink**
```bash
ls -la ~/domains/yourdomain.com/public_html/avhira/current
# Should point to latest release
```

**C. Verify Release Deployed**
```bash
ls -lt ~/domains/yourdomain.com/public_html/avhira/releases/
# Check if new release directory exists
```

**D. Hard Refresh Browser**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

## 🔴 Issue 6: Migration Fails During Deployment

### Error in GitHub Actions:
```
Migration failed
```

### Solutions:

**A. Run Migrations Manually**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan migrate --force
```

**B. Check Migration Status**
```bash
php artisan migrate:status
```

**C. Rollback if Needed**
```bash
php artisan migrate:rollback
php artisan migrate --force
```

**D. Fix Migration Files Locally**
```bash
# Test migrations locally first
php artisan migrate:fresh
# If successful, push
git add database/migrations/
git commit -m "Fix migrations"
git push
```

---

## 🔴 Issue 7: Composer Dependencies Fail

### Error:
```
Your requirements could not be resolved
```

### Solutions:

**A. Update Composer Locally**
```bash
composer update --lock
git add composer.lock
git commit -m "Update composer.lock"
git push
```

**B. Check PHP Version**
```bash
ssh -p 65002 u885878505@89.117.188.174
php -v
# Should be PHP 8.2+
```

**C. Clear Composer Cache**
```bash
composer clear-cache
composer install
```

---

## 🔴 Issue 8: Symlink Not Working

### Error:
```
Too many levels of symbolic links
```

### Solutions:

**A. Remove and Recreate Symlink**
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira
rm current
ln -sfn releases/$(ls -t releases | head -1) current
ls -la current
```

**B. Fix Storage Symlinks**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan storage:link
```

---

## 🔴 Issue 9: Out of Disk Space

### Error:
```
No space left on device
```

### Solutions:

**A. Check Disk Usage**
```bash
df -h
du -sh ~/domains/yourdomain.com/public_html/avhira/*
```

**B. Clean Old Releases**
```bash
cd ~/domains/yourdomain.com/public_html/avhira
# Workflow keeps last 3, but you can manually clean
ls -t releases | tail -n +2 | xargs rm -rf
```

**C. Clean Old Backups**
```bash
cd ~/domains/yourdomain.com/public_html/avhira
ls -t backup-*.tar.gz | tail -n +3 | xargs rm
```

**D. Clear Laravel Logs**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
> storage/logs/laravel.log  # Empties log file
```

---

## 🔴 Issue 10: GitHub Actions Stuck/Hanging

### Workflow runs but never completes

### Solutions:

**A. Cancel and Restart**
1. Go to Actions tab
2. Click on running workflow
3. Click "Cancel workflow"
4. Click "Re-run jobs"

**B. Check SSH Timeout**
- Workflow has 60-minute timeout
- If server is slow, increase in workflow file

**C. Manual Deployment**
```bash
# Connect and deploy manually
ssh -p 65002 u885878505@89.117.188.174
# Follow manual deployment steps
```

---

## 🔴 Issue 11: Images/Uploads Not Showing

### Uploaded images return 404

### Solutions:

**A. Create Storage Link**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan storage:link
```

**B. Check Storage Directory**
```bash
ls -la ~/domains/yourdomain.com/public_html/avhira/shared/storage/app/public
```

**C. Fix Permissions**
```bash
chmod -R 755 ~/domains/yourdomain.com/public_html/avhira/shared/storage/app/public
```

**D. Check Filesystem Config**
In `.env`:
```env
FILESYSTEM_DISK=local
```

---

## 🔴 Issue 12: Session/Login Issues

### Users get logged out or sessions don't persist

### Solutions:

**A. Check Session Driver**
```bash
cat ~/domains/yourdomain.com/public_html/avhira/shared/.env | grep SESSION
```

Should be:
```env
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

**B. Clear Sessions**
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan session:clear
```

**C. Check Session Directory Permissions**
```bash
chmod -R 755 ~/domains/yourdomain.com/public_html/avhira/shared/storage/framework/sessions
```

---

## 🔴 Issue 13: Razorpay Payment Fails

### Payment integration not working

### Solutions:

**A. Check Razorpay Keys**
```bash
cat ~/domains/yourdomain.com/public_html/avhira/shared/.env | grep RAZORPAY
```

**B. Verify Keys Are Production Keys**
- Live keys start with: `rzp_live_`
- Test keys start with: `rzp_test_`

**C. Check Webhook Configuration**
1. Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/checkout/razorpay-webhook`

---

## 📊 Diagnostic Commands

### Full System Check
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira/current

echo "=== Laravel Info ==="
php artisan about

echo "=== Environment ==="
php artisan env

echo "=== Storage Permissions ==="
ls -la storage/

echo "=== Symlink Status ==="
ls -la ../current

echo "=== Disk Space ==="
df -h

echo "=== Recent Logs ==="
tail -20 storage/logs/laravel.log
```

---

## 🆘 Emergency Recovery

### Complete Reset (Last Resort)

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# Backup current state
tar -czf emergency-backup-$(date +%Y%m%d-%H%M%S).tar.gz current/

# Clear everything except shared
rm -rf releases/* current

# Trigger fresh deployment from GitHub Actions
# Or restore from last good backup
tar -xzf backup-TIMESTAMP.tar.gz
```

---

## 📋 Before Asking for Help

Run these commands and share the output:

```bash
ssh -p 65002 u885878505@89.117.188.174

# 1. Check current state
ls -la ~/domains/yourdomain.com/public_html/avhira/current

# 2. Check PHP version
php -v

# 3. Check Laravel
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan about

# 4. Check logs
tail -50 storage/logs/laravel.log

# 5. Check .env
cat ~/domains/yourdomain.com/public_html/avhira/shared/.env

# 6. Check permissions
ls -la storage/
```

---

## ✅ Prevention Checklist

- [ ] Test locally before pushing
- [ ] Run `composer validate` before commit
- [ ] Run `npm run build` locally to test
- [ ] Check GitHub Actions after every push
- [ ] Monitor Laravel logs after deployment
- [ ] Keep backups (automated in workflow)
- [ ] Document custom changes

---

**Most issues are fixed by:**
1. 🔐 Fixing permissions
2. 🗑️ Clearing caches
3. ✅ Verifying .env configuration
4. 🔗 Checking symlinks

**When in doubt: Clear cache, fix permissions, check logs!** 🔧
