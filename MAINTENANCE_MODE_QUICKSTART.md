# Maintenance Mode - Quick Start Guide

## 🎯 What It Does

Put your entire Avhira website offline for maintenance with one click, while keeping:
- ✅ Admin panel accessible
- ✅ Login page working
- ✅ Admins can view the entire site normally

## 🚀 How to Use

### Enable Maintenance Mode

1. Login to admin panel: `/admin`
2. Look at the top right of the dashboard
3. Click the **toggle switch** next to "Maintenance Mode"
4. Optionally enter a custom message for visitors
5. Click **"Enable"**

Your site is now offline! 🔧

### Disable Maintenance Mode

1. Login to admin panel: `/admin` (still works!)
2. Click the **toggle switch** again
3. Done! Site is back online ✅

## 🎨 What Visitors See

When maintenance mode is ON, regular visitors see a beautiful page with:
- Avhira branding
- Your custom message (or default message)
- Animated maintenance icon
- Contact support link

## 🔐 Who Can Access What?

### During Maintenance Mode:

| User Type | Can Access |
|-----------|------------|
| **Admin** | ✅ Everything (entire site + admin panel) |
| **Regular User** | ❌ Nothing (sees maintenance page) |
| **Guest** | ❌ Nothing (sees maintenance page) |
| **Everyone** | ✅ Login page `/login` |

## 📍 Key URLs

- **Maintenance Page**: `/maintenance` (auto-redirected)
- **Admin Dashboard**: `/admin` (always accessible)
- **Login Page**: `/login` (always accessible)
- **Toggle Endpoint**: `POST /admin/maintenance/toggle` (admin only)
- **Status Check**: `GET /admin/maintenance/status` (admin only)

## 🛠 Technical Details

### Storage
- Uses Laravel Cache
- Keys: `site_maintenance_mode` (boolean), `maintenance_message` (string)
- Persists across requests using `Cache::forever()`

### Middleware
- `CheckMaintenanceMode` runs on all web routes
- Checks cache for maintenance status
- Allows `/admin*`, `/login`, and admin users to bypass
- Redirects everyone else to `/maintenance`

### Files Created
```
app/Http/Middleware/CheckMaintenanceMode.php
app/Http/Controllers/MaintenanceController.php
resources/js/pages/Maintenance.jsx
```

### Files Modified
```
bootstrap/app.php (registered middleware)
routes/web.php (added /maintenance route)
routes/admin.php (added toggle/status routes)
resources/js/pages/Admin/Dashboard.jsx (added toggle UI)
app/Http/Controllers/Admin/AdminController.php (pass status to view)
```

## 🐛 Troubleshooting

### Stuck in maintenance mode?
```bash
php artisan cache:clear
```

Or use Tinker:
```bash
php artisan tinker
Cache::forget('site_maintenance_mode');
```

### Can't access admin panel?
Admin panel should ALWAYS work. Check:
1. Are you logged in as admin? (database: `is_admin = 1`)
2. Clear cache: `php artisan cache:clear`
3. Check logs: `storage/logs/laravel.log`

### Maintenance page not showing?
```bash
php artisan route:clear
php artisan cache:clear
```

## 💡 Tips

1. **Test First**: Enable maintenance in incognito/private window to test
2. **Custom Messages**: Use specific messages like "Maintenance: 2 AM - 4 AM EST"
3. **Admin Testing**: As admin, you can browse the site to verify changes during maintenance
4. **Emergency Disable**: Use Tinker command if toggle doesn't work

## 📖 Full Documentation

See `MAINTENANCE_MODE.md` for complete documentation including:
- Detailed feature list
- API endpoints
- Customization guide
- Security details
- Future enhancements

---

**Need Help?** Contact support@avhira.com
