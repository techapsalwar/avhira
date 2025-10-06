# 🎯 Post-Deployment Guide

## ✅ Deployment Status: IN PROGRESS

**Started**: October 7, 2025
**Commit**: 9858128 - "feat: Add CI/CD deployment pipeline for Hostinger"
**Monitor**: https://github.com/techapsalwar/avhira/actions

---

## 📊 What's Happening Right Now

Your application is being automatically deployed by GitHub Actions:

1. ✅ Code pushed to GitHub
2. 🔄 GitHub Actions triggered
3. 🏗️ Building environment (PHP 8.2 + Node.js 20)
4. 📦 Installing dependencies
5. 🎨 Building production assets
6. 🚀 Deploying to Hostinger
7. ⚙️ Running optimizations

**Expected Time**: 3-5 minutes

---

## 🔍 How to Monitor

### Option 1: GitHub Actions Web UI
Visit: https://github.com/techapsalwar/avhira/actions
- Click on the latest workflow run
- Watch real-time logs
- Green checkmarks = success
- Red X = error (check logs)

### Option 2: GitHub CLI (if installed)
```bash
gh run watch
```

---

## ✅ When Deployment Completes

You'll see "✅ All checks have passed" on GitHub Actions.

### Immediate Next Steps:

#### Step 1: Configure Document Root (IMPORTANT!)

1. Login to **Hostinger Control Panel**
2. Go to: **Websites → avhira.com → Advanced**
3. Find **Document Root** setting
4. Change from:
   ```
   /home/u885878505/domains/avhira.com/public_html
   ```
   To:
   ```
   /home/u885878505/domains/avhira.com/public_html/public
   ```
5. **Save** and wait 2-3 minutes for propagation

**Why?** Laravel needs the `public` folder to be the web root for security and proper asset loading.

---

#### Step 2: Run Post-Deployment Commands (SSH)

Connect to server and run final setup:

```powershell
# Connect to Hostinger
ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174

# Navigate to application
cd /home/u885878505/domains/avhira.com/public_html

# Run database migrations
php artisan migrate --force

# Create storage symlink (for uploaded files)
php artisan storage:link

# Clear and optimize caches
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Check application status
php artisan about

# Exit SSH
exit
```

---

#### Step 3: Verify Deployment

1. **Visit your website**: https://avhira.com

2. **Check these items**:
   - [ ] Homepage loads without errors
   - [ ] Images display correctly
   - [ ] CSS styles are applied
   - [ ] JavaScript works (interactive elements)
   - [ ] Navigation menu works
   - [ ] Product pages load
   - [ ] Cart functionality works
   - [ ] No 500 errors

3. **Test key features**:
   - [ ] User registration
   - [ ] User login
   - [ ] Browse products
   - [ ] Add to cart
   - [ ] Checkout page loads

---

## 🔧 If Something Goes Wrong

### Issue: Deployment fails in GitHub Actions

**Check**:
1. Click on failed step in GitHub Actions
2. Read error message
3. Common causes:
   - SSH connection issue (check secrets)
   - Permission denied (verify SSH key)
   - Build error (check package.json/composer.json)

**Fix**:
- Verify all 5 GitHub Secrets are correct
- Test SSH manually: `ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174`
- Fix code issue and push again

---

### Issue: Site shows "500 Internal Server Error"

**SSH and run**:
```bash
cd /home/u885878505/domains/avhira.com/public_html

# Check logs
tail -50 storage/logs/laravel.log

# Fix permissions
chmod -R 775 storage bootstrap/cache

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Recache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### Issue: Assets not loading (CSS/JS 404 errors)

**Causes**:
1. Document root not set to `/public` folder
2. Assets not built properly
3. Cache issues

**Fix**:
1. Set document root in Hostinger (see Step 1 above)
2. Wait 2-3 minutes
3. Clear browser cache (Ctrl+F5)
4. SSH and run: `php artisan storage:link`

---

### Issue: Database connection error

**Check**:
```bash
ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/public_html

# Verify .env file
cat .env | grep DB_

# Should show:
# DB_CONNECTION=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_DATABASE=u885878505_avhira
# DB_USERNAME=u885878505_avhira
# DB_PASSWORD=Krishan1!avhira
```

**Fix if wrong**:
```bash
nano .env
# Update database credentials
# Save: Ctrl+X, Y, Enter

php artisan config:clear
php artisan config:cache
```

---

### Issue: Site shows maintenance mode (503)

**Fix**:
```bash
ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/public_html

# Disable maintenance mode
php artisan up

# Remove maintenance file
rm -f storage/framework/down
```

---

## 🎉 Success Checklist

When everything is working:

- ✅ GitHub Actions shows all green checkmarks
- ✅ https://avhira.com loads successfully
- ✅ All pages render correctly
- ✅ Images and assets load
- ✅ Navigation works
- ✅ User features work (login, register)
- ✅ Database operations work
- ✅ No errors in browser console
- ✅ No errors in Laravel logs

---

## 🔄 Future Deployments

From now on, deploying is easy:

```bash
# Make your changes
# Test locally with: npm run dev & php artisan serve

# Commit and push
git add .
git commit -m "your change description"
git push origin main

# Deployment happens automatically!
# Monitor at: https://github.com/techapsalwar/avhira/actions
```

**That's it!** Every push to `main` = automatic deployment! 🚀

---

## 📞 Need Help?

### Check Logs
```bash
# Server logs
ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174
tail -f /home/u885878505/domains/avhira.com/public_html/storage/logs/laravel.log

# GitHub Actions logs
# Visit: https://github.com/techapsalwar/avhira/actions
```

### Documentation
- **Complete Guide**: `docs/CI_CD.md`
- **Quick Reference**: `docs/DEPLOYMENT_QUICKSTART.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **Checklist**: `docs/DEPLOYMENT_CHECKLIST.md`

### Rollback if Needed
```bash
ssh -i "$HOME\.ssh\avhira_deploy" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/public_html

# List backups
ls -la backups/

# Restore from latest backup
cp backups/latest/.env .env
php artisan config:clear
php artisan cache:clear
php artisan up
```

---

## 🎯 Current Status

**Deployment**: 🔄 In Progress
**Next**: Wait for GitHub Actions to complete (3-5 min)
**Then**: Configure document root → Run post-deployment commands → Verify!

**Monitor here**: https://github.com/techapsalwar/avhira/actions

---

## ⏱️ Timeline

- **00:00** - Push to GitHub ✅
- **00:05** - Build starts ✅
- **01:00** - Dependencies installed 🔄
- **02:00** - Assets built 🔄
- **03:00** - Deploying to server 🔄
- **04:00** - Running optimizations ⏳
- **05:00** - Deployment complete ⏳

**Check GitHub Actions for real-time progress!**

---

**You're almost live! 🚀**
