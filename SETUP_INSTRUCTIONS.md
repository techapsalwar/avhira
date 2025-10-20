# Two-Branch Workflow Setup Instructions

## 📋 Overview

This guide will help you set up the two-branch Git workflow for your Avhira website project.

**Branches:**
- **`main`** - Production branch (auto-deploys, minimal files)
- **`developer`** - Development branch (all files, complete codebase)

## 🚀 Step-by-Step Setup

### Step 1: Create Developer Branch

```powershell
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create developer branch from current main
git checkout -b developer

# Push developer branch to GitHub
git push -u origin developer
```

### Step 2: Set Up Production .gitignore on Main Branch

```powershell
# Switch to main branch
git checkout main

# Copy production gitignore
Copy-Item .gitignore.production .gitignore

# Remove cached files that should be excluded
git rm -r --cached .
git add .
git commit -m "chore: apply production .gitignore to main branch"

# Force push to clean main branch (WARNING: This will rewrite history)
git push origin main --force

# Note: Only do the force push if this is a new project or you've coordinated with your team
```

### Step 3: Configure Branch Protection Rules

1. Go to GitHub repository settings
2. Navigate to **Branches** → **Add branch protection rule**
3. For **`main` branch**:
   - Branch name pattern: `main`
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
   - ✅ Include administrators
   - ❌ Allow force pushes (NEVER!)
   - ❌ Allow deletions

4. For **`developer` branch**:
   - Branch name pattern: `developer`
   - ✅ Require status checks to pass (optional)
   - More flexible settings

### Step 4: Set Up GitHub Secrets

For automated deployment to work, add these secrets in GitHub:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `PRODUCTION_HOST` | Server IP or domain | `123.45.67.89` or `server.example.com` |
| `PRODUCTION_USER` | SSH username | `ubuntu` or `root` |
| `PRODUCTION_SSH_KEY` | Private SSH key for server access | (Full SSH private key) |
| `PRODUCTION_PORT` | SSH port (usually 22) | `22` |
| `PRODUCTION_PATH` | Full path to project on server | `/var/www/html/avhira` |
| `PRODUCTION_URL` | Live website URL | `https://avhira.com` |
| `DB_USERNAME` | Database username on server | `avhira_user` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `DB_DATABASE` | Database name | `avhira_db` |
| `SLACK_WEBHOOK` | (Optional) Slack notifications | `https://hooks.slack.com/...` |

### Step 5: Make Deployment Script Executable

```powershell
# On Windows, the script will work with Git Bash
# You may need to convert line endings

# Using Git Bash (recommended)
git update-index --chmod=+x deploy-to-production.sh

# Commit the change
git add deploy-to-production.sh
git commit -m "chore: make deployment script executable"
git push origin developer
```

### Step 6: Configure Server for Auto-Deployment

On your production server, ensure:

1. **SSH key authentication is set up**
   ```bash
   # On your local machine, copy your SSH public key
   cat ~/.ssh/id_rsa.pub
   
   # On the server, add to authorized_keys
   echo "your-public-key-here" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Git repository is initialized**
   ```bash
   cd /var/www/html
   git clone https://github.com/your-username/avhira.git
   cd avhira
   git checkout main
   ```

3. **Composer and Node.js are installed**
   ```bash
   composer --version
   node --version
   npm --version
   ```

4. **Permissions are correct**
   ```bash
   chown -R www-data:www-data /var/www/html/avhira
   chmod -R 775 /var/www/html/avhira/storage
   chmod -R 775 /var/www/html/avhira/bootstrap/cache
   ```

5. **Deployment user can restart services**
   ```bash
   # Edit sudoers file
   sudo visudo
   
   # Add these lines (replace 'ubuntu' with your username):
   ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl restart php8.2-fpm
   ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
   ```

### Step 7: Test the Workflow

1. **Make a test change on developer branch**
   ```powershell
   git checkout developer
   
   # Make a small change (e.g., add a comment in a file)
   # Then commit
   git add .
   git commit -m "test: verify deployment workflow"
   git push origin developer
   ```

2. **Test the deployment script**
   ```powershell
   # In Git Bash (if on Windows)
   bash deploy-to-production.sh
   
   # Or in PowerShell (if script is converted)
   ./deploy-to-production.sh
   ```

3. **Verify in GitHub Actions**
   - Go to your repository on GitHub
   - Click **Actions** tab
   - Watch the deployment workflow run
   - Check for any errors

4. **Check production site**
   - Visit your live website
   - Verify the change was deployed
   - Check logs for errors

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Developer branch exists and is pushed to GitHub
- [ ] Main branch has production .gitignore applied
- [ ] Branch protection rules are configured
- [ ] All GitHub secrets are added
- [ ] Deployment script is executable
- [ ] Server SSH access works
- [ ] Server has Git, Composer, Node.js installed
- [ ] Server permissions are correct
- [ ] Test deployment completes successfully
- [ ] GitHub Actions workflow runs without errors
- [ ] Production site displays correctly after deployment

## 🔄 Daily Workflow (After Setup)

### For Development Work:
```powershell
# Always work on developer branch
git checkout developer
git pull origin developer

# Make your changes...
# Test locally...

# Commit and push
git add .
git commit -m "feat: description of changes"
git push origin developer
```

### For Production Deployment:
```powershell
# Use the automated script
bash deploy-to-production.sh

# Or manually:
git checkout main
git merge developer --no-ff -m "Release: deployment description"
git push origin main  # This triggers auto-deployment
git checkout developer
git merge main
git push origin developer
```

## 🐛 Troubleshooting

### If GitHub Actions Fails:

1. Check the Actions logs in GitHub
2. Verify all secrets are set correctly
3. Test SSH connection to server manually
4. Check server logs: `tail -f storage/logs/laravel.log`

### If Deployment Script Fails:

```powershell
# Make sure you're on developer branch
git checkout developer

# Check for uncommitted changes
git status

# If tests fail, skip them (not recommended)
# Edit deploy-to-production.sh and comment out test section
```

### If Main Branch Gets Messy:

```powershell
# Reset main to match GitHub
git checkout main
git fetch origin
git reset --hard origin/main

# Or rebuild from developer
git checkout main
git reset --hard developer
git push origin main --force  # Use with caution!
```

## 📚 Documentation Files Created

- **GIT_WORKFLOW_GUIDE.md** - Complete workflow documentation
- **DEPLOYMENT_SUMMARY.md** - Quick reference guide
- **deploy-to-production.sh** - Automated deployment script
- **.github/workflows/deploy-production.yml** - GitHub Actions workflow
- **.gitignore.production** - Production gitignore template
- **SETUP_INSTRUCTIONS.md** - This file

## 🎯 Next Steps

1. Complete all setup steps above
2. Test with a small change
3. Share workflow documentation with team
4. Customize scripts for your specific needs
5. Set up monitoring/alerting (optional)

## ⚠️ Important Notes

- **Never force push to main** except during initial setup
- **Always test on developer** before deploying to main
- **Monitor deployments** for 10-15 minutes after pushing
- **Keep branches synced** to avoid conflicts
- **Back up database** before major deployments
- **Use the deployment script** instead of manual merges

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check server error logs
4. Consult GIT_WORKFLOW_GUIDE.md for detailed procedures

---

**Setup Date:** [Add date when completed]
**Last Updated:** 2025-01-XX
**Maintained By:** Development Team
