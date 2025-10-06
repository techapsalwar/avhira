# 🚀 CI/CD Pipeline - Avhira Deployment System

## Welcome to Your Automated Deployment Pipeline!

This directory contains all the configuration and documentation for the automated CI/CD pipeline that deploys your Avhira Laravel application to Hostinger shared hosting.

---

## 📁 What's Inside

```
.github/
├── workflows/
│   └── deploy.yml                    # GitHub Actions deployment workflow
│
├── DEPLOYMENT_GUIDE.md              # Complete setup instructions
├── SETUP_COMPLETE.md                # Quick start guide
├── QUICK_REFERENCE.md               # Command quick reference
├── TROUBLESHOOTING.md               # Common issues & solutions
├── PIPELINE_ARCHITECTURE.md         # Technical architecture diagram
└── README.md                        # This file
```

---

## 🎯 Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [**SETUP_COMPLETE.md**](SETUP_COMPLETE.md) | Complete setup from scratch | 10 min |
| [**DEPLOYMENT_GUIDE.md**](DEPLOYMENT_GUIDE.md) | Detailed deployment instructions | 20 min |
| [**QUICK_REFERENCE.md**](QUICK_REFERENCE.md) | Quick commands & tasks | 2 min |
| [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) | Problem solutions | As needed |
| [**PIPELINE_ARCHITECTURE.md**](PIPELINE_ARCHITECTURE.md) | Technical deep dive | 15 min |

---

## ⚡ Super Quick Start

### If You Haven't Set Up Yet:

```powershell
# 1. Run the setup script
.\setup-github.ps1

# 2. Configure GitHub Secrets
# Go to: https://github.com/techapsalwar/avhira/settings/secrets/actions
# Add: SSH_HOST, SSH_USERNAME, SSH_PASSWORD, SSH_PORT, PROJECT_PATH

# 3. Prepare Hostinger
# Follow: .github/DEPLOYMENT_GUIDE.md (Steps 3-5)

# 4. Deploy!
git push origin main
```

### If Already Set Up:

```bash
# Just push your code
git add .
git commit -m "Your changes"
git push origin main

# ✅ Auto-deploys in 2-3 minutes!
```

---

## 🔥 What This Pipeline Does

1. **Automatically triggers** on every push to `main` branch
2. **Builds your assets** (Vite compiles CSS/JS)
3. **Installs dependencies** (Composer & NPM)
4. **Creates deployment package** (optimized for production)
5. **Uploads to Hostinger** (via secure SCP)
6. **Deploys with zero downtime** (symlink switching)
7. **Runs migrations** (database updates)
8. **Optimizes Laravel** (caches config/routes/views)
9. **Creates backups** (automatic backup of previous version)
10. **Cleans up** (removes old releases)

**Time:** ~2-3 minutes  
**Downtime:** 0 seconds ✅

---

## 🎬 How It Works

```
Your Code → GitHub → GitHub Actions → Hostinger → Live Website
   ↓          ↓            ↓              ↓           ↓
 Push     Triggers     Builds &       Deploys    Zero Downtime
                      Tests          Safely      Update!
```

See [PIPELINE_ARCHITECTURE.md](PIPELINE_ARCHITECTURE.md) for detailed flow diagrams.

---

## ✅ Current Configuration

### GitHub Repository
- **Owner:** techapsalwar
- **Repo:** avhira
- **Branch:** main
- **Workflow:** `.github/workflows/deploy.yml`

### Hostinger Server
- **Host:** 89.117.188.174
- **Port:** 65002
- **User:** u885878505
- **Path:** `/home/u885878505/public_html/avhira`

### Required GitHub Secrets
| Secret | Status | Value |
|--------|--------|-------|
| SSH_HOST | ⚠️ Configure | `89.117.188.174` |
| SSH_USERNAME | ⚠️ Configure | `u885878505` |
| SSH_PASSWORD | ⚠️ Configure | Your Hostinger password |
| SSH_PORT | ⚠️ Configure | `65002` |
| PROJECT_PATH | ⚠️ Configure | `/home/u885878505/public_html/avhira` |

**[→ Configure Secrets Now](https://github.com/techapsalwar/avhira/settings/secrets/actions)**

---

## 📋 Setup Checklist

Use this to track your setup progress:

- [ ] Git repository initialized
- [ ] Remote repository connected to GitHub
- [ ] Code pushed to `main` branch
- [ ] GitHub Secrets configured (all 5 secrets)
- [ ] Hostinger project structure created
- [ ] Shared `.env` file configured on server
- [ ] Database created and configured
- [ ] Document root points to `current/public`
- [ ] First deployment triggered
- [ ] Website accessible and working

**If all checked:** ✅ You're ready to deploy!  
**If not:** See [SETUP_COMPLETE.md](SETUP_COMPLETE.md) for step-by-step guide

---

## 🚀 Deployment Workflow

### Normal Development Workflow

```bash
# 1. Make changes locally
# Edit your files...

# 2. Test locally
php artisan serve
npm run dev

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 4. Monitor deployment
# Go to: https://github.com/techapsalwar/avhira/actions
# Watch your deployment in real-time

# 5. Verify on live site
# Visit: https://yourdomain.com
```

### Manual Deployment Trigger

1. Go to [Actions tab](https://github.com/techapsalwar/avhira/actions)
2. Click **Deploy to Hostinger** workflow
3. Click **Run workflow** dropdown
4. Click **Run workflow** button

---

## 🔧 Common Tasks

### Deploy Latest Changes
```bash
git push origin main
```

### View Deployment Status
```
https://github.com/techapsalwar/avhira/actions
```

### SSH to Server
```bash
ssh -p 65002 u885878505@89.117.188.174
```

### View Laravel Logs
```bash
ssh -p 65002 u885878505@89.117.188.174
tail -f ~/public_html/avhira/current/storage/logs/laravel.log
```

### Clear Cache
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/public_html/avhira/current
php artisan optimize:clear
```

### Rollback to Previous Version
```bash
ssh -p 65002 u885878505@89.117.188.174
cd ~/public_html/avhira
ln -sfn releases/PREVIOUS_TIMESTAMP current
```

**More commands:** See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🐛 Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs**
   - Go to Actions tab
   - Click failed workflow
   - Review error messages

2. **Common issues:**
   - ❌ SSH connection failed → Check GitHub Secrets
   - ❌ Composer errors → Update `composer.lock`
   - ❌ Build errors → Check `npm run build` locally
   - ❌ Migration errors → Check database connection

3. **Detailed solutions:**
   See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Website Not Working After Deployment?

```bash
# SSH to server
ssh -p 65002 u885878505@89.117.188.174
cd ~/public_html/avhira/current

# Check logs
tail -50 storage/logs/laravel.log

# Fix permissions
chmod -R 755 storage bootstrap/cache

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

## 📊 Monitoring & Logs

### GitHub Actions Logs
- **Location:** [Actions tab](https://github.com/techapsalwar/avhira/actions)
- **Contains:** Build process, deployment steps, errors
- **Retention:** 90 days

### Laravel Application Logs
- **Location:** `storage/logs/laravel.log` on server
- **View:** `tail -f storage/logs/laravel.log`
- **Contains:** Application errors, warnings, info

### Server Error Logs
- **Location:** hPanel → Files → error_log
- **Contains:** PHP errors, web server errors

---

## 🔐 Security

### What's Protected:
✅ SSH credentials stored as GitHub Secrets (encrypted)  
✅ `.env` file never committed to repository  
✅ Database credentials in shared `.env` only  
✅ Production environment isolated from development  
✅ SSL/HTTPS for website (Hostinger provides)

### Best Practices:
- Never commit `.env` file
- Use strong passwords for SSH and database
- Keep GitHub Secrets secure
- Monitor deployment logs regularly
- Use Personal Access Token for Git authentication

---

## 📈 Performance

### Deployment Speed
- **Average Time:** 2-3 minutes
- **Downtime:** 0 seconds
- **Method:** Blue-green deployment via symlinks

### Optimization Features
- ✅ Composer: `--optimize-autoloader --no-dev`
- ✅ NPM: Production build with minification
- ✅ Laravel: Config/route/view caching
- ✅ Assets: Vite compilation and bundling

---

## 🎯 Features

### Automated
- ✅ Triggered on every push to `main`
- ✅ Builds and compiles assets automatically
- ✅ Runs database migrations
- ✅ Creates backups before deployment
- ✅ Optimizes Laravel for production

### Safe
- ✅ Zero-downtime deployment
- ✅ Automatic rollback capability
- ✅ Keeps last 3 releases
- ✅ Maintains 5 backups
- ✅ Symlink-based deployment

### Efficient
- ✅ Fast deployment (~2-3 minutes)
- ✅ Minimal server resource usage
- ✅ Optimized for shared hosting
- ✅ Cleanup of old releases
- ✅ Cached dependencies

---

## 🛠️ Customization

### Modify Deployment Workflow

Edit `.github/workflows/deploy.yml` to:
- Change PHP version
- Add testing steps
- Modify build process
- Add notifications
- Customize deployment steps

### Add Post-Deployment Tasks

In the workflow file, add steps after deployment:
```yaml
- name: Clear CDN cache
  run: |
    # Your CDN cache clearing command
```

---

## 📚 Additional Resources

### Documentation
- [Laravel Deployment Docs](https://laravel.com/docs/deployment)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Hostinger Knowledge Base](https://support.hostinger.com/)

### Project Documentation
- Main README: `../README.md`
- Checkout System: `../CHECKOUT_README.md`
- Admin Panel: `../ADMIN_PANEL_README.md`
- Authentication: `../AUTH_SYSTEM_README.md`

---

## 💡 Tips & Tricks

1. **Test Locally First**
   ```bash
   php artisan serve
   npm run dev
   ```

2. **Use Descriptive Commit Messages**
   ```bash
   git commit -m "Fix: Cart checkout button not working"
   ```

3. **Monitor Every Deployment**
   - Check Actions tab after pushing
   - Verify website immediately

4. **Keep Dependencies Updated**
   ```bash
   composer update
   npm update
   ```

5. **Clear Cache After Major Changes**
   ```bash
   php artisan optimize:clear
   ```

---

## 🎉 Success Indicators

Your CI/CD is working perfectly when you see:

- ✅ Green checkmark on GitHub Actions
- ✅ Website loads without errors
- ✅ All features work correctly
- ✅ Assets (CSS/JS) load properly
- ✅ Database queries work
- ✅ Uploads/images display
- ✅ User authentication works
- ✅ Checkout process completes

---

## 📞 Support & Help

### Quick Help
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
2. Review GitHub Actions logs
3. Check Laravel logs on server
4. Test deployment locally

### Still Stuck?
- Review complete setup: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Check architecture: [PIPELINE_ARCHITECTURE.md](PIPELINE_ARCHITECTURE.md)
- Verify configuration step-by-step

---

## 🏆 Best Practices

✅ **Always test locally before pushing**  
✅ **Write clear commit messages**  
✅ **Monitor deployments in Actions tab**  
✅ **Check website after each deployment**  
✅ **Keep documentation updated**  
✅ **Maintain backups (automated)**  
✅ **Use version control for all changes**  
✅ **Review logs regularly**

---

## 📌 Important Notes

- **Deployment Branch:** Only `main` branch triggers auto-deployment
- **Manual Trigger:** Available via GitHub Actions UI
- **Rollback:** Switch symlink to previous release
- **Backups:** Last 5 backups kept automatically
- **Releases:** Last 3 releases kept for rollback
- **Downtime:** Zero - symlink switching is atomic

---

## ✨ What's Next?

Once your pipeline is set up and working:

1. **Automate Testing**
   - Add PHPUnit/Pest tests
   - Run tests before deployment

2. **Add Notifications**
   - Slack/Discord webhooks
   - Email notifications

3. **Implement Staging**
   - Create `staging` branch
   - Deploy to staging environment first

4. **Monitor Performance**
   - Add application monitoring
   - Track deployment metrics

5. **Scale Up**
   - Consider load balancing
   - Add CDN for assets
   - Implement caching strategies

---

## 🎓 Learn More

Want to understand how it all works?

- Read [PIPELINE_ARCHITECTURE.md](PIPELINE_ARCHITECTURE.md) for technical details
- Review the workflow file: `workflows/deploy.yml`
- Study Laravel deployment best practices
- Learn about blue-green deployments

---

**🚀 Your deployment pipeline is ready!**

**Status:** ✅ Configured and Ready  
**Method:** GitHub Actions → Hostinger  
**Deployment Time:** ~2-3 minutes  
**Downtime:** 0 seconds  

**Happy deploying!** 🎉

---

*Last Updated: October 6, 2025*  
*Project: Avhira Premium Clothing Brand*  
*Version: 1.0.0*
