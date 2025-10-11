# ✅ Staging Environment - LIVE!

**Status**: Site Accessible (HTTP 200)  
**URL**: https://staging.avhira.com  
**Date**: October 11, 2025  
**Document Root**: `/home/u885878505/domains/avhira.com/public_html/staging` ✅

---

## ✅ Completed Steps

| Task | Status | Details |
|------|--------|---------|
| Created staging directories | ✅ | `staging_avhira/` created |
| Copied production files | ✅ | 175MB copied |
| Moved to correct location | ✅ | Files in `/public_html/staging/` |
| Updated index.php paths | ✅ | Changed `../` to `../../` |
| Storage symlink | ✅ | Points to staging storage |
| Build assets | ✅ | Vite files present |
| Subdomain created | ✅ | staging.avhira.com configured |
| Site accessible | ✅ | HTTP 200 OK |

---

## 📋 Remaining Steps (Database Only)

### Step 1: Create Staging Database

**Hostinger Panel**: https://hpanel.hostinger.com

1. Go to: **Websites** → **avhira.com** → **Databases** → **MySQL Databases**
2. Click **"Create Database"**
3. Enter:
   - Database: `u885878505_avhira_staging`
   - User: `u885878505_avhira_staging`
   - Password: [Strong password]
4. Click **Create**

---

### Step 2: Update .env with Database Password

```bash
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Navigate to staging
cd /home/u885878505/domains/avhira.com/staging_avhira

# Edit .env
nano .env

# Find and update this line:
DB_PASSWORD=CHANGEME

# Replace with:
DB_PASSWORD=your_actual_staging_password

# Save and exit
# Press: Ctrl+X, then Y, then Enter
```

---

### Step 3: Run Database Migrations

```bash
# (While still in SSH from Step 2)

# Run migrations
php artisan migrate:fresh --seed

# Optimize caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Verify everything
php artisan about

# Exit SSH
exit
```

---

### Step 4: Test Staging Site

Visit: **https://staging.avhira.com**

**Test Checklist:**
- [ ] Homepage loads
- [ ] Can register new user
- [ ] Can login
- [ ] Products display
- [ ] Images load
- [ ] Add to cart works
- [ ] Checkout page loads
- [ ] No errors in browser console

---

## 📁 Final Directory Structure

```
/home/u885878505/domains/avhira.com/
│
├── staging_avhira/           # Staging Laravel Application
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── .env                  # ⚠️ Need to update DB_PASSWORD
│
├── public_html/
│   └── staging/              # Staging Web Root ✅
│       ├── index.php         # ✅ Updated (../../staging_avhira/)
│       ├── build/            # ✅ Vite assets
│       └── storage/          # ✅ Symlink to ../staging_avhira/storage/app/public/
│
├── avhira/                   # Production Laravel
└── public_html/              # Production web root
```

---

## ⚙️ Current Configuration

### Staging .env Settings

```env
APP_NAME="Avhira Staging"
APP_ENV=staging
APP_DEBUG=true
APP_URL=https://staging.avhira.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u885878505_avhira_staging
DB_USERNAME=u885878505_avhira_staging
DB_PASSWORD=CHANGEME    ← UPDATE THIS!
```

---

## 🔄 How to Update Staging (After Initial Setup)

### Manual Update Method

```bash
# 1. SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# 2. Go to staging
cd /home/u885878505/domains/avhira.com/staging_avhira

# 3. Pull latest code (if using git staging branch)
git pull origin staging

# 4. Update dependencies
composer install --no-dev
npm install && npm run build

# 5. Copy build assets to web root
cp -r public/build ../../public_html/staging/build

# 6. Run migrations (if any)
php artisan migrate

# 7. Clear and rebuild caches
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Exit
exit
```

---

## 🎯 Workflow: Development → Staging → Production

```bash
# 1. Develop feature locally
git checkout -b feature/new-checkout

# 2. Test locally
npm run dev
php artisan serve

# 3. Merge to staging branch
git checkout staging
git merge feature/new-checkout
git push origin staging

# 4. Update staging (manual SSH - see above)

# 5. Test on https://staging.avhira.com

# 6. If all good, deploy to production
git checkout main
git merge staging
git push origin main  # Auto-deploys via GitHub Actions
```

---

## 🐛 Quick Troubleshooting

### Site shows 500 error

```bash
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/staging_avhira

# Check logs
tail -50 storage/logs/laravel.log

# Fix permissions
chmod -R 775 storage bootstrap/cache

# Clear caches
php artisan config:clear
php artisan cache:clear
```

### Database connection error

1. Verify database created in Hostinger
2. Check .env DB_PASSWORD is correct
3. Verify database user has access

```bash
cd /home/u885878505/domains/avhira.com/staging_avhira
cat .env | grep DB_
```

---

## 📊 Status Summary

| Component | Status | URL/Path |
|-----------|--------|----------|
| **Staging Site** | ✅ Live | https://staging.avhira.com |
| **HTTP Status** | ✅ 200 OK | Accessible |
| **Laravel App** | ✅ Ready | `/staging_avhira/` |
| **Web Root** | ✅ Configured | `/public_html/staging/` |
| **index.php** | ✅ Updated | Correct paths |
| **Storage** | ✅ Linked | Symlink working |
| **Build Assets** | ✅ Present | Vite files copied |
| **Subdomain** | ✅ Active | staging.avhira.com |
| **Database** | ⏳ Pending | Need to create |
| **Migrations** | ⏳ Pending | After database |

---

## ✅ Next Action

**Complete the 3 database steps above**, then your staging environment will be fully operational!

**Estimated Time**: 10 minutes

---

**Last Updated**: October 11, 2025  
**Site Status**: ✅ Accessible  
**Database Status**: ⏳ Needs Setup
