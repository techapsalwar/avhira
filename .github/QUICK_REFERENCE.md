# 🚀 Quick Deployment Reference - Avhira

## SSH Connection
```bash
ssh -p 65002 u885878505@89.117.188.174
```

## Project Paths
```bash
# Main project directory
cd ~/domains/yourdomain.com/public_html/avhira
# OR
cd ~/public_html/avhira

# Current release
cd current

# Shared files
cd shared
```

---

## 🔥 Deploy New Changes

```bash
# Local machine
git add .
git commit -m "Your update message"
git push origin main
```

✅ **Deployment happens automatically via GitHub Actions!**

---

## 📊 Monitor Deployment

1. Go to: `https://github.com/techapsalwar/avhira`
2. Click **Actions** tab
3. Watch deployment progress in real-time
4. Click on running workflow for detailed logs

---

## 🔄 Manual Deployment Trigger

1. GitHub repository → **Actions** tab
2. Select **Deploy to Hostinger** workflow
3. Click **Run workflow** (dropdown button)
4. Click green **Run workflow** button

---

## 🔙 Quick Rollback

```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/domains/yourdomain.com/public_html/avhira

# See available releases
ls -lt releases/

# Rollback to specific release
ln -sfn releases/20250106-120000 current

# Verify
ls -la current
```

---

## 🐛 Quick Fixes

### Clear All Caches
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Fix Permissions
```bash
cd ~/domains/yourdomain.com/public_html/avhira
chmod -R 755 current/storage
chmod -R 755 current/bootstrap/cache
chmod -R 755 shared/storage
```

### View Laravel Logs
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
tail -f storage/logs/laravel.log
# Press Ctrl+C to exit
```

### Run Migrations
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan migrate --force
```

### Regenerate Caches
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Storage Link
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan storage:link
```

---

## 📁 Important File Locations

### Environment File
```bash
~/domains/yourdomain.com/public_html/avhira/shared/.env
```

### Laravel Logs
```bash
~/domains/yourdomain.com/public_html/avhira/current/storage/logs/laravel.log
```

### Public Assets
```bash
~/domains/yourdomain.com/public_html/avhira/current/public
```

### Uploaded Images
```bash
~/domains/yourdomain.com/public_html/avhira/shared/storage/app/public
```

---

## 🔍 Quick Diagnostics

### Check Current Release
```bash
ls -la ~/domains/yourdomain.com/public_html/avhira/current
```

### Check Disk Space
```bash
df -h
du -sh ~/domains/yourdomain.com/public_html/avhira/*
```

### Test Database Connection
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan tinker
# Type: DB::connection()->getPdo();
# Type: exit
```

### Check PHP Version
```bash
php -v
```

### Laravel Environment Info
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan about
```

---

## ⚡ Emergency Commands

### Restart (Symbolic)
```bash
cd ~/domains/yourdomain.com/public_html/avhira
ln -sfn current current-temp
mv current-temp current
```

### Force Clear Everything
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan optimize:clear
```

### Recompile Assets (if needed)
```bash
# On local machine
npm run build
git add public/build
git commit -m "Rebuild assets"
git push
```

---

## 📋 Deployment Status Checks

### Is Deployment Active?
Check GitHub Actions tab for running workflows

### Last Deployment Time
```bash
ls -lt ~/domains/yourdomain.com/public_html/avhira/releases/ | head -5
```

### Current Version
```bash
readlink ~/domains/yourdomain.com/public_html/avhira/current
```

### Available Backups
```bash
ls -lth ~/domains/yourdomain.com/public_html/avhira/backup-*.tar.gz
```

---

## 🎯 Common Deployment Scenarios

### Scenario 1: Update Product Page
```bash
# Edit files locally
git add resources/js/Pages/Products/
git commit -m "Update product page layout"
git push origin main
# ✅ Auto-deploys via GitHub Actions
```

### Scenario 2: Add New Feature
```bash
git add .
git commit -m "Add wishlist feature"
git push origin main
# ✅ Auto-deploys, runs migrations if any
```

### Scenario 3: Hotfix Production Issue
```bash
# Fix locally
git add .
git commit -m "Hotfix: Fix checkout button"
git push origin main
# ✅ Deploys immediately
# Monitor in Actions tab
```

### Scenario 4: Database Update
```bash
# Create migration locally
php artisan make:migration add_column_to_products
# Edit migration file
git add database/migrations/
git commit -m "Add column to products table"
git push origin main
# ✅ Migration runs automatically on server
```

---

## 🔐 Security Reminders

- ✅ Never commit `.env` file
- ✅ Keep GitHub Secrets secure
- ✅ Use strong SSH password
- ✅ Regular backups (automated)
- ✅ Monitor deployment logs
- ✅ Test locally before pushing

---

## 📞 Quick Support

### Check These First:
1. ✅ GitHub Actions logs (Actions tab)
2. ✅ Laravel logs (`tail -f storage/logs/laravel.log`)
3. ✅ PHP error logs (hPanel → Files → error_log)
4. ✅ Browser console (F12 → Console tab)

### Still Having Issues?
```bash
cd ~/domains/yourdomain.com/public_html/avhira/current
php artisan about
# Check configuration status
```

---

## ✨ Pro Tips

1. **Always test locally first**: `php artisan serve` and `npm run dev`
2. **Check Actions tab**: Monitor every deployment
3. **Keep releases**: Auto-keeps last 3 for rollback
4. **Use descriptive commits**: Makes tracking easier
5. **Clear cache after major changes**: Ensures fresh load

---

## 🎉 Your Workflow

1. **Code locally** → Make changes
2. **Test locally** → Ensure it works
3. **Commit changes** → `git commit -m "..."`
4. **Push to GitHub** → `git push origin main`
5. **Auto-deploys** → GitHub Actions handles it
6. **Verify** → Check website immediately
7. **Done!** → Celebrate! 🎊

---

**Everything automated. Deploy with confidence!** 🚀

*Deployment Time: ~2-3 minutes*  
*Zero Downtime: ✅*  
*Automatic Rollback Available: ✅*
