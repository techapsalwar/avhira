# 🛠️ Maintenance Mode - Quick Reference

## ✅ FIXED & WORKING!

The maintenance mode script is now fully functional with Laravel 12.

---

## 🚀 Quick Commands

### Check Status
```powershell
.\maintenance.ps1 -Action status
```

### Enable Maintenance Mode
```powershell
# Basic (no bypass)
.\maintenance.ps1 -Action enable

# With bypass URL
.\maintenance.ps1 -Action enable -Secret "mypassword123"

# With custom retry time (in seconds)
.\maintenance.ps1 -Action enable -Retry 600

# Combined
.\maintenance.ps1 -Action enable -Secret "deploy2025" -Retry 300
```

### Disable Maintenance Mode
```powershell
.\maintenance.ps1 -Action disable
```

---

## 📋 Common Scenarios

### Before Deploying Updates

```powershell
# 1. Enable maintenance
.\maintenance.ps1 -Action enable -Secret "deploy2025" -Retry 300

# 2. Your users see: Beautiful maintenance page with countdown
# 3. You can still access via: https://avhira.com/deploy2025

# 4. Deploy your changes
git push origin main

# 5. Wait 3-5 minutes for deployment

# 6. Disable maintenance
.\maintenance.ps1 -Action disable
```

### Testing the Maintenance Page

```powershell
# Enable for testing
.\maintenance.ps1 -Action enable -Secret "test123"

# Visit https://avhira.com - You'll see the maintenance page
# Visit https://avhira.com/test123 - You can bypass and see the live site

# Disable when done
.\maintenance.ps1 -Action disable
```

### Emergency Maintenance

```powershell
# Quick enable (5 minutes)
.\maintenance.ps1 -Action enable -Retry 300

# Fix the issue...

# Quick disable
.\maintenance.ps1 -Action disable
```

---

## 🎨 What Users See

When maintenance mode is enabled, users visiting https://avhira.com see:

- **Beautiful purple gradient page**
- **"We'll Be Back Soon!" heading**
- **Countdown timer** (auto-counts down from your retry time)
- **Auto-refresh** every 30 seconds to check if site is back
- **Contact information** (support@avhira.com)
- **Animated spinner**
- **Mobile responsive design**

---

## ⚙️ Options Explained

| Option | Description | Example |
|--------|-------------|---------|
| `-Action` | Required: `enable`, `disable`, or `status` | `-Action enable` |
| `-Secret` | Password to bypass maintenance mode | `-Secret "mypass123"` |
| `-Retry` | Seconds before users should retry (default: 300) | `-Retry 600` |
| `-GenerateSecret` | Auto-generate random secret | `-GenerateSecret` |

---

## 🔍 Verification

### Check if Maintenance is Active

**Option 1**: Use the script
```powershell
.\maintenance.ps1 -Action status
```

**Option 2**: Check HTTP status
```powershell
curl.exe -I https://avhira.com
# Look for: HTTP/1.1 503 Service Unavailable
```

**Option 3**: Visit the site
Just open https://avhira.com in your browser

---

## 🎯 Best Practices

### DO:
✅ Enable maintenance before database migrations  
✅ Use bypass URL to test while in maintenance  
✅ Set appropriate retry time (3-10 minutes typical)  
✅ Schedule maintenance during low-traffic hours  
✅ Notify users in advance (email/banner)  

### DON'T:
❌ Don't leave maintenance enabled unnecessarily  
❌ Don't forget to disable after deployment  
❌ Don't use maintenance for every small update  
❌ Don't deploy on Friday evening without maintenance 😅  

---

## 🐛 Troubleshooting

### Issue: Script says enabled but site works fine

**Check**:
```powershell
.\maintenance.ps1 -Action status
```

**Fix**:
```powershell
# Disable and re-enable
.\maintenance.ps1 -Action disable
.\maintenance.ps1 -Action enable
```

### Issue: Can't access site even with secret

**Problem**: You might have typo in secret  
**Solution**: Disable and enable with new secret

```powershell
.\maintenance.ps1 -Action disable
.\maintenance.ps1 -Action enable -Secret "newsecret123"
```

### Issue: Maintenance page not showing custom design

**Check**: Make sure `resources/views/errors/503.blade.php` exists

```powershell
# Verify file exists
Test-Path resources/views/errors/503.blade.php
```

If false, the file is missing. Re-deploy from Git.

---

## 📊 Example Workflows

### Workflow 1: Scheduled Weekly Maintenance

```powershell
# Sunday 2 AM - Enable maintenance
.\maintenance.ps1 -Action enable -Secret "sunday2025" -Retry 1800

# Perform updates:
# - Database backups
# - Software updates
# - Security patches

# 2:30 AM - Disable maintenance
.\maintenance.ps1 -Action disable
```

### Workflow 2: Hot Fix Deployment

```powershell
# Enable with short retry
.\maintenance.ps1 -Action enable -Retry 180

# Push fix
git add .
git commit -m "fix: critical bug"
git push origin main

# Wait for GitHub Actions (3-4 minutes)
# Watch: https://github.com/techapsalwar/avhira/actions

# Disable immediately after deployment
.\maintenance.ps1 -Action disable
```

### Workflow 3: Major Feature Release

```powershell
# Test on staging first
git push origin staging
# Test thoroughly...

# Schedule maintenance window
# Send email to users: "Maintenance Sunday 3 PM for 30 minutes"

# At scheduled time:
.\maintenance.ps1 -Action enable -Secret "release2025" -Retry 1800

# Deploy
git push origin main

# Test via bypass URL
# Open: https://avhira.com/release2025
# Verify all features work

# Disable maintenance
.\maintenance.ps1 -Action disable

# Announce: "New features are live!"
```

---

## 🔗 Related Files

- **Script**: `maintenance.ps1`
- **Maintenance Page**: `resources/views/errors/503.blade.php`
- **Full Guide**: `STAGING_MAINTENANCE_README.md`
- **CI/CD Workflow**: `.github/workflows/deploy.yml`

---

## 📞 Quick Help

**Enable maintenance**:
```powershell
.\maintenance.ps1 -Action enable -Secret "yourpass"
```

**Check status**:
```powershell
.\maintenance.ps1 -Action status
```

**Disable maintenance**:
```powershell
.\maintenance.ps1 -Action disable
```

**Test the page**:
Visit https://avhira.com (you'll see the maintenance page)

**Bypass (if you set secret)**:
Visit https://avhira.com/yourpass

---

**Last Updated**: October 11, 2025  
**Status**: ✅ Fully Working & Tested

---

## 🎉 Summary

Your maintenance mode is now:
- ✅ Working perfectly with Laravel 12
- ✅ Beautiful custom 503 page
- ✅ Easy to enable/disable
- ✅ Bypass URL support
- ✅ Auto-countdown timer
- ✅ Mobile responsive
- ✅ Production tested

**You're all set!** 🚀
