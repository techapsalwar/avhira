# Deployment Quick Reference

## 🚀 Quick Deploy (Recommended)

```bash
./deploy-to-production.sh
```

## 📋 Manual Deploy Steps

### 1. Pre-Deployment Checklist

```bash
# On developer branch
git checkout developer
git status                    # Ensure clean working directory
git pull origin developer     # Get latest changes
php artisan test             # Run tests
npm run build                # Build assets
```

### 2. Deploy to Production

```bash
git checkout main
git merge developer --no-ff -m "Release: [description]"
git push origin main         # Triggers auto-deployment
```

### 3. Sync Branches

```bash
git checkout developer
git merge main
git push origin developer
```

## 🔧 Common Commands

### Branch Management
```bash
git checkout developer       # Switch to development
git checkout main           # Switch to production
git branch -a               # List all branches
```

### Check Status
```bash
git status                  # Current changes
git log --oneline -10       # Recent commits
git diff                    # Uncommitted changes
```

### Emergency Rollback
```bash
# On main branch
git reset --hard HEAD~1     # Undo last commit
git push origin main --force-with-lease

# Or rollback to specific commit
git reset --hard <commit-sha>
git push origin main --force-with-lease
```

## 🏥 Production Server Commands

### SSH Access
```bash
ssh user@your-server.com
cd /path/to/project
```

### Manual Deployment (if GitHub Actions fails)
```bash
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
```

### Maintenance Mode
```bash
# Enable
php artisan down --message="Upgrading, please wait..."

# Disable
php artisan up
```

### Clear Caches
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear
```

### View Logs
```bash
tail -f storage/logs/laravel.log
tail -f /var/log/nginx/error.log
```

## 🐛 Troubleshooting

### Deployment Failed
1. Check GitHub Actions logs
2. SSH to server and check Laravel logs
3. Run manual deployment commands
4. If needed, rollback: `git reset --hard HEAD~1`

### Site Not Loading
```bash
# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Check Nginx status
sudo systemctl status nginx

# Check Laravel logs
tail -50 storage/logs/laravel.log
```

### Permission Errors
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Database Issues
```bash
# Run migrations
php artisan migrate --force

# Rollback last migration
php artisan migrate:rollback --step=1

# Check migration status
php artisan migrate:status
```

## 📊 Monitoring

### Check Site Health
```bash
curl -I https://your-site.com  # Should return 200 OK
```

### Monitor Real-time
```bash
# Follow Laravel logs
tail -f storage/logs/laravel.log

# Follow Nginx access logs
tail -f /var/log/nginx/access.log
```

## 🔐 Required Secrets (GitHub)

For GitHub Actions to work, set these secrets in your repository:

- `PRODUCTION_HOST` - Server IP or domain
- `PRODUCTION_USER` - SSH username
- `PRODUCTION_SSH_KEY` - Private SSH key
- `PRODUCTION_PORT` - SSH port (default: 22)
- `PRODUCTION_PATH` - Path to project on server
- `PRODUCTION_URL` - Full site URL (for health check)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `SLACK_WEBHOOK` - (Optional) Slack webhook URL

## 📞 Emergency Contacts

If deployment fails critically:
1. Enable maintenance mode: `php artisan down`
2. Rollback: `git reset --hard <previous-good-commit>`
3. Contact team lead
4. Check backup: `~/backups/`

## 🎯 Best Practices

✅ **DO:**
- Test locally before deploying
- Deploy during low-traffic periods
- Monitor for 10-15 minutes after deployment
- Back up database before major changes
- Use the automated script
- Keep developer and main in sync

❌ **DON'T:**
- Deploy without testing
- Force push to main
- Skip the automated script
- Deploy and leave immediately
- Ignore error notifications
- Leave branches out of sync

## 📚 Resources

- Full Guide: [GIT_WORKFLOW_GUIDE.md](./GIT_WORKFLOW_GUIDE.md)
- Deployment Script: [deploy-to-production.sh](./deploy-to-production.sh)
- GitHub Actions: [.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)
- Laravel Deployment: https://laravel.com/docs/deployment

---

**Last Updated:** 2025-01-XX
**Maintained By:** Development Team
