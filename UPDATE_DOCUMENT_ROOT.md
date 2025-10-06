# 🎯 Update Document Root - Final Step

## ✅ Deployment Verification Complete!

Your application is successfully deployed at:
```
/home/u885878505/public_html/avhira/current/public/
```

Current status:
- ✅ Release: `20251006-091423`
- ✅ Symlink: `current` → `releases/20251006-091423`
- ✅ Laravel app: `index.php` exists
- ✅ All files deployed correctly

---

## 🔧 Update Document Root in Hostinger

### **Method 1: Via hPanel (Recommended)**

1. **Open Hostinger hPanel**
   - Go to: https://hpanel.hostinger.com
   - Log in to your account

2. **Navigate to Website Settings**
   - Click on **Websites** in the left sidebar
   - Find your domain (avhira.com) and click **Manage**

3. **Go to Advanced Settings**
   - Look for **Advanced** section
   - Click on **Website Settings** or **Domain Settings**

4. **Update Document Root**
   - Find the **Document Root** or **Web Root** field
   - Change from:
     ```
     /public_html
     ```
   - Change to:
     ```
     /public_html/avhira/current/public
     ```

5. **Save Changes**
   - Click **Save** or **Update**
   - Wait 1-2 minutes for changes to propagate

---

### **Method 2: Via .htaccess Redirect (Alternative)**

If you can't find document root settings, you can use a redirect:

**In your SSH terminal, run:**

```bash
# Backup existing .htaccess
cp /home/u885878505/public_html/.htaccess /home/u885878505/public_html/.htaccess.backup 2>/dev/null || true

# Create new .htaccess with redirect
cat > /home/u885878505/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/avhira/current/public/
    RewriteRule ^(.*)$ /avhira/current/public/$1 [L]
</IfModule>
EOF

echo "✅ .htaccess redirect created!"
```

---

### **Method 3: Create Symlink (Quick Fix)**

**In your SSH terminal, run:**

```bash
# Move old public_html content (if any) to backup
mkdir -p /home/u885878505/public_html_backup
mv /home/u885878505/public_html/* /home/u885878505/public_html_backup/ 2>/dev/null || true

# Create symlink from public_html to your Laravel public directory
ln -sfn /home/u885878505/public_html/avhira/current/public/* /home/u885878505/public_html/

echo "✅ Symlink created!"
```

---

## 🧪 Test Your Website

After updating the document root, test your website:

1. **Visit your domain:** https://avhira.com
2. **Clear browser cache:** Ctrl + Shift + R (or Cmd + Shift + R on Mac)
3. **Check these pages:**
   - Homepage: Should show your Avhira store
   - Products: Should display products
   - Admin: Should be accessible at /admin

---

## 🔍 Troubleshooting

If the website still shows old content:

1. **Clear browser cache completely**
2. **Try incognito/private browsing mode**
3. **Wait 2-3 minutes** for DNS/server cache to clear
4. **Check .htaccess permissions:**
   ```bash
   chmod 644 /home/u885878505/public_html/.htaccess
   ```

---

## 📞 Need Help?

If you encounter any issues, run these diagnostic commands in SSH:

```bash
# Check if Laravel routes work
curl -I http://localhost/avhira/current/public/

# Check permissions
ls -la /home/u885878505/public_html/avhira/current/public/

# Check Laravel logs
tail -n 50 /home/u885878505/public_html/avhira/current/storage/logs/laravel.log
```

---

## ✅ Success Checklist

- [ ] Document root updated to `/public_html/avhira/current/public`
- [ ] Browser cache cleared
- [ ] Website loads at https://avhira.com
- [ ] Products page works
- [ ] Cart functionality works
- [ ] Admin panel accessible

---

**Once you update the document root, your website will be live!** 🎉
