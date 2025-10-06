# CI/CD Pipeline - GitHub Actions + Hostinger Deployment

## Overview
Automated deployment pipeline using GitHub Actions to deploy Avhira application to Hostinger shared hosting at **avhira.com**.

## Architecture
- **CI/CD Platform**: GitHub Actions
- **Target Environment**: Hostinger Shared Hosting
- **Deployment Method**: SSH-based automated deployment
- **Trigger**: Push to `main` branch or manual workflow dispatch
- **Domain**: avhira.com

## Workflow File
Location: `.github/workflows/deploy.yml`

## Pipeline Stages

### 1. Build Stage
- **Checkout Code**: Clone repository using `actions/checkout@v4`
- **Setup PHP 8.2**: Install PHP with required extensions (mbstring, xml, pdo_mysql, etc.)
- **Setup Node.js 20**: Install Node.js with npm caching
- **Cache Dependencies**: Cache Composer vendor directory for faster builds
- **Install Composer Dependencies**: `composer install --optimize-autoloader --no-dev`
- **Install NPM Dependencies**: `npm ci` (clean install)
- **Build Frontend Assets**: `npm run build` (Vite production build)

### 2. Package Stage
- **Create Deployment Package**: 
  - Exclude unnecessary files (.git, node_modules, tests)
  - Preserve .env template (actual .env is on server)
  - Create compressed tar.gz archive for efficient transfer

### 3. Deploy Stage
- **Pre-Deployment**:
  - SSH to Hostinger server
  - Create timestamped backup (YYYYMMDD_HHMMSS format)
  - Backup .env file and storage/app directory
  - Enable maintenance mode (`php artisan down`)

- **Upload Package**:
  - Transfer deploy.tar.gz via SCP
  - Uses `appleboy/scp-action` for secure file transfer

- **Post-Deployment**:
  - Extract deployment package
  - Restore .env from backup if needed
  - Set proper permissions (755 for storage/bootstrap, 775 for logs)
  - Run Laravel optimizations:
    - `php artisan config:cache`
    - `php artisan route:cache`
    - `php artisan view:cache`
    - `php artisan event:cache`
  - Run database migrations (`php artisan migrate --force`)
  - Optimize application (`php artisan optimize`)
  - Disable maintenance mode (`php artisan up`)
  - Create symlink to latest backup

### 4. Notification Stage
- Display deployment status (success/failure)
- Provide quick recovery instructions if failed

## GitHub Secrets Configuration

### Required Secrets
Add these secrets in GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `HOSTINGER_HOST` | Hostinger server hostname | `avhira.com` or IP address |
| `HOSTINGER_USERNAME` | SSH username | `u123456789` |
| `HOSTINGER_SSH_KEY` | Private SSH key (entire content) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `HOSTINGER_PORT` | SSH port (default 22) | `22` |
| `HOSTINGER_APP_PATH` | Absolute path to application on server | `/home/u123456789/domains/avhira.com/public_html` |

### How to Set Up SSH Key

#### 1. Generate SSH Key Pair (on your local machine)
```bash
# Generate ED25519 key (recommended, more secure)
ssh-keygen -t ed25519 -a 200 -C "github-actions@avhira.com"

# Or generate RSA key (if ED25519 not supported)
ssh-keygen -t rsa -b 4096 -C "github-actions@avhira.com"
```

When prompted:
- Save to: `~/.ssh/avhira_deploy` (custom name to avoid overwriting existing keys)
- Passphrase: Leave empty for automation (or use GitHub secret for passphrase)

#### 2. Copy Public Key to Hostinger
```bash
# For ED25519
cat ~/.ssh/avhira_deploy.pub | ssh u123456789@avhira.com 'cat >> .ssh/authorized_keys'

# Or manually via Hostinger file manager:
# 1. Login to Hostinger control panel
# 2. Go to Files → File Manager
# 3. Navigate to ~/.ssh/ directory (create if doesn't exist)
# 4. Edit authorized_keys file (create if doesn't exist)
# 5. Paste the content of avhira_deploy.pub on a new line
# 6. Set permissions: chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
```

#### 3. Copy Private Key to GitHub Secrets
```bash
# macOS
pbcopy < ~/.ssh/avhira_deploy

# Linux
xclip < ~/.ssh/avhira_deploy

# Windows (PowerShell)
Get-Content ~/.ssh/avhira_deploy | Set-Clipboard

# Or manually
cat ~/.ssh/avhira_deploy
# Copy entire output (including BEGIN/END lines) to HOSTINGER_SSH_KEY secret
```

#### 4. Test SSH Connection
```bash
ssh -i ~/.ssh/avhira_deploy u123456789@avhira.com
# Should connect without password prompt
```

### Security Fingerprint (Optional but Recommended)
Add host fingerprint verification to prevent MITM attacks:

```bash
# Get server fingerprint
ssh avhira.com ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub | cut -d ' ' -f2

# Add to workflow (in deploy.yml):
# fingerprint: ${{ secrets.HOSTINGER_FINGERPRINT }}
```

## Hostinger Server Preparation

### Directory Structure
```
/home/u123456789/domains/avhira.com/
├── public_html/              # Main application directory (set as HOSTINGER_APP_PATH)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/               # Web root (set this in Hostinger control panel)
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   │   ├── app/
│   │   ├── framework/
│   │   └── logs/
│   ├── vendor/
│   ├── .env                  # Production environment file (manually created)
│   ├── artisan
│   ├── composer.json
│   └── backups/              # Auto-created by deployment script
│       ├── latest/           # Symlink to most recent backup
│       ├── 20250115_143022/
│       └── 20250115_120515/
```

### Required Setup on Hostinger

#### 1. Set Document Root
In Hostinger control panel:
1. Go to **Websites → Manage → Advanced → Document Root**
2. Set to: `/home/u123456789/domains/avhira.com/public_html/public`
3. This ensures Laravel's public folder is the web root

#### 2. Create .env File
SSH to server and create production .env:
```bash
cd /home/u123456789/domains/avhira.com/public_html
cp .env.example .env
nano .env
```

Update with production values:
```env
APP_NAME=Avhira
APP_ENV=production
APP_KEY=base64:RtNOWVw8tbeQAeLcb1sStP5oR5DWZgDbstLcVqDLwmI=
APP_DEBUG=false
APP_URL=https://avhira.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u885878505_avhira
DB_USERNAME=u885878505_avhira
DB_PASSWORD=Krishan1!avhira

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

CACHE_STORE=database
# CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379


MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=avhirahouse@gmail.com
MAIL_PASSWORD=cdcizijafuamshib
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=avhirahouse@gmail.com
MAIL_FROM_NAME="Avhira"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

RAZORPAY_KEY=rzp_live_RPrwNi6UTxcxc7
RAZORPAY_SECRET=FpDwSo2FUmWhB72yydyLaLJR

VITE_APP_NAME="${APP_NAME}"
```

#### 3. Set Permissions
```bash
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs storage/framework
```

#### 4. Install Composer (if not available)
```bash
# Check if composer is installed
composer --version

# If not installed, download
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
```

#### 5. Initial Deployment (Manual)
```bash
cd /home/u123456789/domains/avhira.com/public_html
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Deployment Process

### Automatic Deployment (via GitHub Actions)
1. Push code to `main` branch:
   ```bash
   git add .
   git commit -m "Deploy: Updated hero section"
   git push origin main
   ```

2. GitHub Actions automatically:
   - Builds the application
   - Runs tests (if configured)
   - Deploys to Hostinger
   - Optimizes Laravel caches
   - Runs migrations

3. Monitor progress:
   - Go to GitHub repository → **Actions** tab
   - Click on the running workflow
   - View real-time logs

### Manual Deployment (via GitHub Actions)
1. Go to GitHub repository → **Actions** tab
2. Select **Deploy to Hostinger** workflow
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Click **Run workflow**

### Rollback Process
If deployment fails or issues are detected:

```bash
# SSH to Hostinger
ssh u123456789@avhira.com

# Navigate to application directory
cd /home/u123456789/domains/avhira.com/public_html

# List available backups
ls -la backups/

# Restore from specific backup
cp -r backups/20250115_143022/.env .env
cp -r backups/20250115_143022/storage_app/* storage/app/

# Clear caches and restart
php artisan down
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan up
```

## Monitoring and Logs

### GitHub Actions Logs
- **Location**: Repository → Actions → Select workflow run
- **Retention**: 90 days (GitHub default)
- **Download**: Click on job → Download log archive

### Laravel Application Logs
- **Location**: `/home/u123456789/domains/avhira.com/public_html/storage/logs/`
- **View**: `tail -f storage/logs/laravel.log`
- **Rotate**: Logs are rotated daily by Laravel

### Hostinger Server Logs
- **Access Log**: Hostinger control panel → Websites → Logs
- **Error Log**: Check Hostinger control panel for PHP errors

## Troubleshooting

### Deployment Fails at SSH Connection
**Error**: `Permission denied (publickey)`
**Solution**:
1. Verify SSH key is correctly added to GitHub secrets
2. Check authorized_keys on Hostinger server
3. Test SSH connection manually: `ssh -i ~/.ssh/avhira_deploy u123456789@avhira.com`

### Deployment Succeeds but Site Shows Errors
**Error**: 500 Internal Server Error
**Solutions**:
1. Check storage permissions: `chmod -R 775 storage`
2. Clear Laravel caches: `php artisan cache:clear && php artisan config:clear`
3. Check .env file exists and APP_KEY is set
4. Review logs: `tail -f storage/logs/laravel.log`

### Database Migration Fails
**Error**: `SQLSTATE[HY000] [1045] Access denied`
**Solutions**:
1. Verify database credentials in .env
2. Check database exists in Hostinger control panel
3. Run manually: `php artisan migrate --force`

### Assets Not Loading (404 errors)
**Solutions**:
1. Verify document root points to `public` directory
2. Run: `php artisan storage:link`
3. Clear browser cache
4. Check .htaccess file exists in public directory

### Maintenance Mode Stuck
**Error**: Site shows "503 Service Unavailable"
**Solution**:
```bash
ssh u123456789@avhira.com
cd /home/u123456789/domains/avhira.com/public_html
php artisan up
rm -f storage/framework/down
```

## Best Practices

1. **Always Test Locally First**
   - Run `npm run build` before pushing
   - Test migrations on local database
   - Verify no breaking changes

2. **Use Feature Branches**
   - Create feature branches: `git checkout -b feature/new-feature`
   - Merge to main only when ready: `git merge feature/new-feature`
   - Main branch triggers deployment automatically

3. **Monitor Deployments**
   - Watch GitHub Actions logs during deployment
   - Check application immediately after deployment
   - Keep backups for at least 7 days

4. **Security**
   - Never commit .env file to repository
   - Rotate SSH keys every 90 days
   - Use APP_DEBUG=false in production
   - Keep dependencies updated

5. **Performance**
   - Always run Laravel optimizations after deployment
   - Use production assets (npm run build)
   - Enable OPcache on Hostinger
   - Consider using Redis for sessions/cache

## Manual Deployment Alternative

If CI/CD is not available, deploy manually:

```bash
# Local machine - Build assets
npm run build
composer install --optimize-autoloader --no-dev

# Create deployment package
tar -czf deploy.tar.gz --exclude='.git' --exclude='node_modules' --exclude='tests' .

# Upload to server
scp -i ~/.ssh/avhira_deploy deploy.tar.gz u123456789@avhira.com:/home/u123456789/domains/avhira.com/public_html/

# SSH to server
ssh -i ~/.ssh/avhira_deploy u123456789@avhira.com

# Extract and deploy
cd /home/u123456789/domains/avhira.com/public_html
php artisan down
tar -xzf deploy.tar.gz
rm deploy.tar.gz
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
```

## Future Enhancements

- [ ] Add automated testing stage (PHPUnit, Pest)
- [ ] Implement database backup before migrations
- [ ] Add Slack/Discord deployment notifications
- [ ] Set up staging environment
- [ ] Implement blue-green deployment
- [ ] Add performance monitoring (New Relic, Scout APM)
- [ ] Automated security scanning
- [ ] Health check endpoint monitoring