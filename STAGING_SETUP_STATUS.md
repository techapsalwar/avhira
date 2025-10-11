# ✅ Staging Environment Setup - Completed

**Date**: October 11, 2025  
**Status**: Server Setup Complete - Awaiting Database & Subdomain Configuration

---

## ✅ Completed on Server

| Task | Status | Details |
|------|--------|---------|
| Created staging directories | ✅ | `staging_avhira/` and `staging_html/` |
| Copied production files | ✅ | 175MB copied successfully |
| Created staging .env | ✅ | Configured for staging environment |
| Created staging index.php | ✅ | Points to `../staging_avhira/` |
| Setup storage symlink | ✅ | Correctly linked |
| Copied build assets | ✅ | Vite build files copied |
| Set permissions | ✅ | 755/775 permissions set |

---

## 📋 Pending Manual Steps (Do These Now)

### Step 1: Create Staging Database

**Go to Hostinger Panel**: https://hpanel.hostinger.com

1. Navigate: **Websites** → **avhira.com** → **Databases** → **MySQL Databases**
2. Click **"Create Database"**
3. Fill in:
   - **Database name**: `u885878505_avhira_staging`
   - **Database user**: `u885878505_avhira_staging`
   - **Password**: [Choose strong password - save it!]
4. Click **Create**

---

### Step 2: Update Staging .env

After creating the database, update the staging .env file with the database password:

```bash
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Navigate to staging
cd /home/u885878505/domains/avhira.com/staging_avhira

# Edit .env file
nano .env

# Find this line:
DB_PASSWORD=CHANGEME

# Replace with your actual staging database password:
DB_PASSWORD=your_actual_password_here

# Save: Ctrl+X, then Y, then Enter

# Exit
exit
```

---

### Step 3: Create Subdomain

**In Hostinger Panel**:

1. Navigate: **Websites** → **avhira.com** → **Subdomains**
2. Click **"Create Subdomain"**
3. Fill in:
   - **Subdomain**: `staging`
   - **Full domain**: `staging.avhira.com` (auto-filled)
   - **Document Root**: `/home/u885878505/domains/avhira.com/staging_html`
4. Click **"Create"**
5. **Wait 5-10 minutes** for DNS propagation

---

### Step 4: Run Migrations

After completing steps 1-3, run these commands:

```bash
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Navigate to staging Laravel app
cd /home/u885878505/domains/avhira.com/staging_avhira

# Run migrations (creates tables)
php artisan migrate:fresh --seed

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Verify
php artisan about

# Exit
exit
```

---

### Step 5: Test Staging Site

**Visit**: https://staging.avhira.com

**What to check**:
- ✅ Homepage loads
- ✅ Images display
- ✅ Navigation works
- ✅ Products show
- ✅ No 500 errors

---

## 📁 Directory Structure

```
/home/u885878505/domains/avhira.com/
├── avhira/              # Production Laravel
├── public_html/         # Production web root
├── staging_avhira/      # Staging Laravel ✅ CREATED
└── staging_html/        # Staging web root ✅ CREATED
```

---

## ⚙️ Staging Configuration

### Environment Settings

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
DB_PASSWORD=[Set in Step 2]
```

---

## 🔄 How to Update Staging

### Method 1: Manual Update (Simple)

```bash
# SSH to server
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174

# Navigate to staging
cd /home/u885878505/domains/avhira.com/staging_avhira

# Pull latest from staging branch
git pull origin staging

# Install dependencies (if changed)
composer install --no-dev
npm install && npm run build

# Copy build assets
cp -r public/build ../staging_html/build

# Run migrations (if any)
php artisan migrate

# Clear and rebuild caches
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Exit
exit
```

### Method 2: Automated (Future - via GitHub Actions)

Create `.github/workflows/deploy-staging.yml` to auto-deploy staging branch.

---

## 🎯 Usage Workflow

### Development → Staging → Production

```bash
# 1. Develop feature locally
git checkout -b feature/new-feature
# Make changes...

# 2. Merge to staging branch
git checkout staging
git merge feature/new-feature
git push origin staging

# 3. Update staging (manual)
# SSH and pull/build (see Method 1 above)

# 4. Test on https://staging.avhira.com
# Test all features thoroughly

# 5. If tests pass, deploy to production
git checkout main
git merge staging
git push origin main
# Auto-deploys to production
```

---

## 🐛 Troubleshooting

### Issue: Staging shows 500 error

```bash
# SSH and check logs
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174
cd /home/u885878505/domains/avhira.com/staging_avhira
tail -50 storage/logs/laravel.log

# Common fixes:
chmod -R 775 storage bootstrap/cache
php artisan config:clear
php artisan cache:clear
```

### Issue: Database connection error

Check:
1. Database created in Hostinger panel?
2. .env password correct?
3. Database user assigned to database?

```bash
# Test database connection
cd /home/u885878505/domains/avhira.com/staging_avhira
php artisan tinker
>>> DB::connection()->getPdo();
```

### Issue: Subdomain not accessible

1. **Wait longer**: DNS can take up to 24 hours
2. **Check document root**: Should be `/home/u885878505/domains/avhira.com/staging_html`
3. **Clear browser cache**: Ctrl+Shift+Delete
4. **Try different network**: Mobile data vs WiFi

---

## 📊 Comparison: Production vs Staging

| Feature | Production | Staging |
|---------|-----------|---------|
| **URL** | avhira.com | staging.avhira.com |
| **Laravel Path** | `/avhira/` | `/staging_avhira/` |
| **Web Root** | `/public_html/` | `/staging_html/` |
| **Database** | `u885878505_avhira` | `u885878505_avhira_staging` |
| **APP_ENV** | `production` | `staging` |
| **APP_DEBUG** | `false` | `true` |
| **Git Branch** | `main` | `staging` |
| **Auto-Deploy** | ✅ Yes | ❌ Manual (for now) |

---

## ✅ Quick Checklist

Before considering staging complete:

- [ ] Database created in Hostinger panel
- [ ] Database password updated in staging .env
- [ ] Subdomain created (staging.avhira.com)
- [ ] Document root set to `/staging_html`
- [ ] Migrations run successfully
- [ ] Staging site loads at https://staging.avhira.com
- [ ] Can login/register
- [ ] Products display
- [ ] Images load
- [ ] No console errors

---

## 🎉 When Complete

Once all steps are done, you'll have:
- ✅ Fully functional staging environment
- ✅ Safe place to test features before production
- ✅ Separate database for testing
- ✅ Same codebase as production
- ✅ Debug mode enabled for easier troubleshooting

---

## 📞 Next Actions

1. **Complete the 3 pending steps above** (Database, .env, Subdomain)
2. **Run migrations**
3. **Test staging site**
4. **Start using staging workflow**

---

**Server Setup**: ✅ Complete  
**Manual Steps**: ⏳ Pending  
**Estimated Time**: 15-20 minutes

Let me know once you've completed the Hostinger panel steps (database & subdomain), and I'll help you run the migrations!
