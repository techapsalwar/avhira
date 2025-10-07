# 🖼️ Storage Symlink Fix - Product Images

## Issue: Product Images Not Displaying (404 Error)

**Problem**: Product images uploaded successfully but showing 404 errors when accessed via URL.

**Example Error**:
```
Request URL: https://avhira.com/storage/products/jV3rfCXZLQSE875azmcTrPaswg9eAbrUoO8CJEO1.png
Status Code: 404 Not Found
```

**Symptoms**:
- Images upload successfully to `/avhira/storage/app/public/products/`
- Database records updated correctly
- But URL `https://avhira.com/storage/products/image.png` returns 404

---

## Root Cause

The storage symlink in `/public_html/storage/` was pointing to the wrong location or had an incorrect structure.

**Incorrect Symlink Structure**:
```
/public_html/storage/
  └── public/ → /avhira/storage/app/public/
```

This creates: `/public_html/storage/public/products/` (wrong!)  
But Laravel expects: `/public_html/storage/products/` (correct!)

**File Locations**:
- **Actual storage**: `/home/u885878505/domains/avhira.com/avhira/storage/app/public/products/`
- **Web accessible**: `/home/u885878505/domains/avhira.com/public_html/storage/`
- **URL**: `https://avhira.com/storage/products/image.png`

---

## Solution

### Quick Fix (Manual)

SSH to server and recreate the symlink correctly:

```bash
# Connect to server
ssh -i ~/.ssh/avhira_deploy_rsa -p 65002 u885878505@89.117.188.174

# Navigate to project root
cd /home/u885878505/domains/avhira.com

# Remove incorrect symlink
rm -rf public_html/storage

# Create correct symlink
ln -sf /home/u885878505/domains/avhira.com/avhira/storage/app/public /home/u885878505/domains/avhira.com/public_html/storage

# Verify
ls -la public_html/storage/
# Should show: storage -> /home/u885878505/domains/avhira.com/avhira/storage/app/public

# Test access
ls public_html/storage/products/
# Should list your product images

# Exit
exit
```

### Verification

After fixing, test:

```bash
# Check symlink
curl -I https://avhira.com/storage/products/YOUR_IMAGE.png
# Should return: HTTP/2 200
```

Or visit in browser: `https://avhira.com/storage/products/YOUR_IMAGE.png`

---

## Workflow Configuration

The deployment workflow (`.github/workflows/deploy.yml`) already has the correct configuration:

```yaml
# Create storage symlink
rm -f $WEB_ROOT/storage
ln -sf $LARAVEL_PATH/storage/app/public $WEB_ROOT/storage
```

Where:
- `$LARAVEL_PATH` = `/home/u885878505/domains/avhira.com/avhira`
- `$WEB_ROOT` = `/home/u885878505/domains/avhira.com/public_html`

**This ensures every deployment creates the correct symlink automatically.**

---

## Understanding Laravel Storage

### How Laravel Storage Works

1. **Files are stored**: `storage/app/public/`
2. **Symlink created**: `public/storage/` → `storage/app/public/`
3. **Accessed via URL**: `https://domain.com/storage/file.jpg`

### Our Two-Directory Structure

Since we have Laravel in `/avhira/` and web root in `/public_html/`:

```
/avhira/
├── storage/
│   └── app/
│       └── public/
│           └── products/         ← Files stored here
│               └── image.png

/public_html/
├── index.php
└── storage/ → ../avhira/storage/app/public/  ← Symlink
    └── products/                 ← Accessible via this path
        └── image.png             ← Same file!
```

**URL Access**: `https://avhira.com/storage/products/image.png`  
**Resolves to**: `/public_html/storage/products/image.png`  
**Which links to**: `/avhira/storage/app/public/products/image.png`

---

## Common Issues & Solutions

### Issue: Symlink doesn't exist

**Fix**:
```bash
cd /home/u885878505/domains/avhira.com
ln -sf avhira/storage/app/public public_html/storage
```

### Issue: Symlink points to wrong location

**Fix**:
```bash
cd /home/u885878505/domains/avhira.com
rm public_html/storage
ln -sf avhira/storage/app/public public_html/storage
```

### Issue: Permission denied

**Fix**:
```bash
cd /home/u885878505/domains/avhira.com/avhira
chmod -R 775 storage/app/public
```

### Issue: Images uploaded but not accessible

**Check**:
1. Verify symlink exists: `ls -la public_html/storage`
2. Verify images exist: `ls avhira/storage/app/public/products/`
3. Check permissions: `ls -la avhira/storage/app/public/`
4. Test URL: `curl -I https://avhira.com/storage/products/IMAGE.png`

---

## Prevention

To prevent this issue in the future:

1. ✅ **Use the GitHub Actions workflow** - It creates the correct symlink automatically
2. ✅ **Don't run `php artisan storage:link`** on the server - It won't work correctly with our two-directory structure
3. ✅ **Always use the manual symlink command** if needed (see Quick Fix above)
4. ✅ **Verify after deployment** - Check that images are accessible

---

## Testing Checklist

After fixing, verify:

- [ ] Symlink exists: `ls -la /home/u885878505/domains/avhira.com/public_html/storage`
- [ ] Points to correct location: Should show `→ /home/.../avhira/storage/app/public`
- [ ] Products folder accessible: `ls /home/u885878505/domains/avhira.com/public_html/storage/products/`
- [ ] Images load in browser: Visit `https://avhira.com/storage/products/IMAGE.png`
- [ ] Product pages show images correctly
- [ ] Admin upload works and images display

---

## Status

**Issue**: RESOLVED ✅  
**Date**: October 7, 2025  
**Solution**: Recreated storage symlink with correct path  
**Verification**: HTTP 200 response for product images  

**All product images are now displaying correctly!** 🎉
