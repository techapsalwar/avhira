# Setting Up Staging Subdomain in Hostinger

## Problem
The GitHub Actions workflow is deploying files to `/home/u885878505/domains/staging.avhira.com/` but the subdomain doesn't exist in Hostinger, so there's no web server configured to serve the files.

## Solution: Create Staging Subdomain in Hostinger

### Step 1: Access Hostinger Control Panel
1. Log in to your Hostinger account at https://hpanel.hostinger.com
2. Select your **avhira.com** website

### Step 2: Create Subdomain
1. In the left sidebar, go to **Domains** → **Subdomains**
2. Click **Create Subdomain** button
3. Enter subdomain name: `staging`
4. The full domain will be: `staging.avhira.com`
5. **Document root**: Set to `/public_html` (this will create `/domains/staging.avhira.com/public_html`)
6. Click **Create**

### Step 3: Verify Subdomain Paths
After creating the subdomain, Hostinger will automatically create these directories:
```
/home/u885878505/domains/staging.avhira.com/
├── public_html/          ← Web server serves files from here
└── avhira/              ← You'll need to create this manually (our workflow will populate it)
```

### Step 4: Create Application Directory
SSH into your server and create the Laravel application directory:

```bash
ssh u885878505@srv648.hstgr.io -p 65002
cd /home/u885878505/domains/staging.avhira.com
mkdir -p avhira
```

### Step 5: Set Up .env File for Staging
1. Navigate to the staging application directory:
   ```bash
   cd /home/u885878505/domains/staging.avhira.com/avhira
   ```

2. Copy the .env from production and modify for staging:
   ```bash
   cp /home/u885878505/domains/avhira.com/avhira/.env .env
   ```

3. Edit the .env file with staging-specific settings:
   ```bash
   nano .env
   ```

4. Update these values:
   ```env
   APP_ENV=staging
   APP_DEBUG=true
   APP_URL=https://staging.avhira.com
   
   # Use a different database for staging (optional but recommended)
   DB_DATABASE=u885878505_avhira_staging
   
   # Disable certain features in staging
   MAIL_MAILER=log  # Don't send real emails from staging
   ```

### Step 6: Test Subdomain
1. Wait 5-10 minutes for DNS propagation
2. Visit `https://staging.avhira.com` in your browser
3. You should see your application (or a "coming soon" page if no files deployed yet)

### Step 7: Trigger Deployment
Once the subdomain is set up, push to the staging branch:
```bash
git push origin staging
```

The GitHub Actions workflow will:
1. Build the application
2. Deploy to `/home/u885878505/domains/staging.avhira.com/avhira`
3. Copy public assets to `/home/u885878505/domains/staging.avhira.com/public_html`
4. Make the site live at `https://staging.avhira.com`

## Troubleshooting

### Subdomain shows "This site can't be reached"
- **Cause**: DNS hasn't propagated yet
- **Solution**: Wait 10-30 minutes and clear your DNS cache:
  ```bash
  # Windows
  ipconfig /flushdns
  
  # Mac/Linux
  sudo dscacheutil -flushcache
  ```

### Subdomain shows 404 or blank page
- **Cause**: Application not deployed yet or index.php missing
- **Solution**: 
  1. Check if files exist in `/domains/staging.avhira.com/public_html/`
  2. Verify `index.php` exists in public_html
  3. Check GitHub Actions logs for deployment errors

### Subdomain shows old production content
- **Cause**: Browser cache or CDN cache
- **Solution**: 
  1. Hard refresh: `Ctrl + Shift + R`
  2. Open in incognito mode
  3. Clear browser cache completely

### "Permission denied" errors during deployment
- **Cause**: Incorrect directory permissions
- **Solution**: Set proper permissions:
  ```bash
  cd /home/u885878505/domains/staging.avhira.com
  chmod -R 755 avhira
  chmod -R 775 avhira/storage
  chmod -R 775 avhira/bootstrap/cache
  ```

## Alternative: Quick Test with Subdirectory

If you want to test immediately without waiting for subdomain setup:

1. Deploy to a subdirectory of your main domain:
   ```bash
   # Modify workflow to use:
   deploy_path: /home/u885878505/domains/avhira.com/staging
   web_root: /home/u885878505/domains/avhira.com/public_html/staging
   ```

2. Access at: `https://avhira.com/staging`

But for a proper staging environment, the subdomain approach (above) is recommended.

## Verification Checklist

After setup, verify:
- [ ] Subdomain created in Hostinger panel
- [ ] Directory `/domains/staging.avhira.com/avhira` exists
- [ ] Directory `/domains/staging.avhira.com/public_html` exists
- [ ] .env file exists with APP_ENV=staging
- [ ] DNS resolves: `nslookup staging.avhira.com`
- [ ] Site accessible at `https://staging.avhira.com`
- [ ] GitHub Actions deployment succeeds
- [ ] Changes visible on staging site

## Quick Commands Reference

```bash
# SSH into server
ssh u885878505@srv648.hstgr.io -p 65002

# Check staging directories exist
ls -la /home/u885878505/domains/staging.avhira.com/

# View staging .env
cat /home/u885878505/domains/staging.avhira.com/avhira/.env

# Check what's in public_html
ls -la /home/u885878505/domains/staging.avhira.com/public_html/

# View deployment logs
cd /home/u885878505/domains/staging.avhira.com/avhira
php artisan about

# Force clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

