# 🔧 TROUBLESHOOTING GUIDE - Avhira E-commerce

## Common Issues and Solutions

---

## ✅ FIXED: Blank Screen with "Page not found: ./pages/Welcome.tsx"

### **Problem:**
Black/blank screen when visiting `http://localhost:8000`

Console error:
```
Uncaught (in promise) Error: Page not found: ./pages/Welcome.tsx
```

### **Root Cause:**
1. `vite.config.ts` was configured for TypeScript (`.tsx`) but we created JavaScript files (`.jsx`)
2. Old `welcome.tsx` file was conflicting with new `Welcome.jsx`
3. Vite was looking for the wrong file extensions

### **Solution Applied:**
1. ✅ Updated `vite.config.ts` to use `.jsx` instead of `.tsx`
2. ✅ Removed old conflicting `welcome.tsx` file
3. ✅ Rebuilt assets with `npm run build`
4. ✅ Restarted Laravel server

### **Files Changed:**
```typescript
// vite.config.ts - BEFORE
input: ['resources/css/app.css', 'resources/js/app.tsx']

// vite.config.ts - AFTER  
input: ['resources/css/app.css', 'resources/js/app.jsx']
```

---

## 🔥 Other Common Issues

### 1. **MySQL Connection Error**

**Error:**
```
SQLSTATE[HY000] [2002] No connection could be made
```

**Solutions:**
- ✅ Start MySQL (XAMPP/WAMP)
- ✅ Check `.env` database settings
- ✅ Verify database "avhira" exists
- ✅ Test connection: `php artisan migrate:status`

---

### 2. **CSS Not Loading / Styles Missing**

**Problem:** Website looks unstyled

**Solutions:**
```bash
# Rebuild assets
npm run build

# Or run dev server for hot reload
npm run dev

# Clear browser cache (Ctrl+Shift+R)
```

---

### 3. **Cart Not Working**

**Error:** Items not adding to cart

**Solutions:**
```bash
# Clear Laravel cache
php artisan cache:clear
php artisan config:clear

# Check session configuration
php artisan config:cache

# Verify cart API endpoint
curl http://localhost:8000/cart/count
```

---

### 4. **Images Not Showing**

**Problem:** Product images show as broken/placeholder

**Solutions:**
```bash
# Create storage link
php artisan storage:link

# Check file permissions (Linux/Mac)
chmod -R 755 storage/app/public

# Verify image path
# Should be: storage/app/public/products/image.jpg
# URL: http://localhost:8000/storage/products/image.jpg
```

---

### 5. **Migrations Failed**

**Error:** Migration errors or table already exists

**Solutions:**
```bash
# Reset database completely
php artisan migrate:fresh

# Reset and seed sample data
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

---

### 6. **npm/Composer Errors**

**Problem:** Dependencies not installing

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install

# Clear composer cache
composer clear-cache
rm -rf vendor
composer install
```

---

### 7. **Port 8000 Already in Use**

**Error:**
```
Failed to listen on 127.0.0.1:8000
```

**Solutions:**
```bash
# Use different port
php artisan serve --port=8001

# Or find and kill process using port 8000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Or use Task Manager to end php.exe
```

---

### 8. **Inertia Version Mismatch**

**Error:**
```
Inertia version mismatch
```

**Solutions:**
```bash
# Clear all caches
php artisan optimize:clear

# Rebuild frontend
npm run build

# Hard refresh browser (Ctrl+Shift+R)
```

---

### 9. **TypeScript Errors (tsx vs jsx)**

**Problem:** Getting TypeScript errors but project uses JavaScript

**Solution:**
Check `vite.config.ts`:
```typescript
// Should be:
input: ['resources/css/app.css', 'resources/js/app.jsx']

// NOT:
input: ['resources/css/app.css', 'resources/js/app.tsx']
```

Then rebuild:
```bash
npm run build
```

---

### 10. **Class Not Found Errors**

**Error:**
```
Class 'App\Models\Product' not found
```

**Solutions:**
```bash
# Regenerate autoload files
composer dump-autoload

# Clear config cache
php artisan config:clear
php artisan cache:clear
```

---

## 🔍 Debugging Checklist

When something doesn't work, check in this order:

### Step 1: Verify Services Running
- [ ] MySQL is running (green in XAMPP/WAMP)
- [ ] Laravel server is running (`php artisan serve`)
- [ ] Vite dev server is running (`npm run dev`) OR assets are built (`npm run build`)

### Step 2: Check Configuration
- [ ] `.env` file exists and has correct settings
- [ ] `APP_KEY` is generated
- [ ] Database credentials are correct
- [ ] `vite.config.ts` points to `.jsx` files

### Step 3: Clear Caches
```bash
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Step 4: Rebuild Assets
```bash
rm -rf public/build
npm run build
# Hard refresh browser (Ctrl+Shift+R)
```

### Step 5: Check Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Browser console (F12)
# Check for JavaScript errors

# Network tab
# Check for 404 or 500 errors
```

---

## 🛠️ Development Workflow

### Daily Startup:
```bash
# 1. Start MySQL (XAMPP/WAMP)
# 2. Start Laravel
php artisan serve

# 3. Start Vite (in another terminal)
npm run dev

# 4. Open browser
# http://localhost:8000
```

### After Pulling Changes:
```bash
composer install
npm install
php artisan migrate
php artisan config:clear
npm run build
```

### Before Committing:
```bash
# Test everything works
php artisan test

# Build production assets
npm run build

# Check for errors
php artisan config:cache
```

---

## 📞 Getting Help

### Check Browser Console (F12):
- Look for JavaScript errors (red text)
- Check Network tab for failed requests
- Look for 404 or 500 errors

### Check Laravel Logs:
```bash
# View latest errors
cat storage/logs/laravel.log

# Watch logs live
tail -f storage/logs/laravel.log
```

### Test Components:
```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Test routes
php artisan route:list

# Test migrations
php artisan migrate:status

# Check config
php artisan config:show database
```

---

## 🎯 Quick Fixes

### Complete Reset:
```bash
# 1. Stop all servers
# 2. Reset database
php artisan migrate:fresh --seed

# 3. Clear all caches
php artisan optimize:clear

# 4. Rebuild assets
npm run build

# 5. Restart servers
php artisan serve
npm run dev
```

### Fresh Install:
```bash
# 1. Remove dependencies
rm -rf vendor node_modules
rm composer.lock package-lock.json

# 2. Reinstall
composer install
npm install

# 3. Rebuild
php artisan key:generate
php artisan migrate:fresh --seed
npm run build
```

---

## ✨ Prevention Tips

1. **Always start MySQL first** before Laravel
2. **Run `npm run dev`** for hot reload during development
3. **Run `npm run build`** before testing production
4. **Clear caches** after changing config files
5. **Use `.jsx` consistently** - we're not using TypeScript
6. **Check browser console** before asking for help
7. **Keep backups** of working `.env` files

---

## 🆘 Still Stuck?

1. Check this guide again carefully
2. Review the README.md
3. Check Laravel documentation: https://laravel.com/docs
4. Check Inertia.js docs: https://inertiajs.com
5. Contact the development team

---

**Most issues are solved by:**
1. Starting MySQL
2. Running `npm run build`
3. Clearing caches
4. Hard refreshing browser (Ctrl+Shift+R)

Good luck! 🚀
