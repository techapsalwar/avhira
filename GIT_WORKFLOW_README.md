# 🚀 Avhira Website - Git Workflow System

> Professional two-branch Git workflow with automated deployments for Laravel + React projects

## 📖 Quick Links

- **[Start Here: Setup Instructions](SETUP_INSTRUCTIONS.md)** - First-time setup guide
- **[Daily Workflow Guide](GIT_WORKFLOW_GUIDE.md)** - Complete workflow documentation  
- **[Quick Reference](DEPLOYMENT_SUMMARY.md)** - Common commands and troubleshooting
- **[Implementation Overview](WORKFLOW_IMPLEMENTATION_COMPLETE.md)** - What's included

## 🎯 What Is This?

A complete Git workflow system that separates **production code** from **development work** using two branches:

| Branch | Purpose | Contents | Deployment |
|--------|---------|----------|------------|
| **main** | Production | Essential files only | Auto-deploys on push |
| **developer** | Development | All files (tests, docs, etc.) | Manual testing |

## ⚡ Quick Start

### For First-Time Setup

```powershell
# 1. Create developer branch
git checkout -b developer
git push -u origin developer

# 2. Follow detailed setup guide
# See: SETUP_INSTRUCTIONS.md
```

### For Daily Development

```powershell
# Work on developer branch
git checkout developer

# Make changes, then commit
git add .
git commit -m "feat: your feature"
git push origin developer
```

### For Production Deployment

```powershell
# Use the automated script (recommended)
.\deploy-to-production.ps1

# Or run bash version
bash deploy-to-production.sh
```

## 📦 What's Included

### 📄 Documentation (4 files)
- `GIT_WORKFLOW_GUIDE.md` - Complete workflow procedures
- `SETUP_INSTRUCTIONS.md` - One-time setup steps
- `DEPLOYMENT_SUMMARY.md` - Quick reference guide
- `WORKFLOW_IMPLEMENTATION_COMPLETE.md` - System overview

### 🤖 Automation (3 files)
- `deploy-to-production.sh` - Bash deployment script
- `deploy-to-production.ps1` - PowerShell deployment script
- `.github/workflows/deploy-production.yml` - GitHub Actions

### ⚙️ Configuration (1 file)
- `.gitignore.production` - Production gitignore template

## ✨ Key Features

- ✅ **Automated Deployments** - Push to main = auto-deploy
- ✅ **Safety Checks** - Pre-deployment testing and validation
- ✅ **Branch Protection** - Prevent accidental force pushes
- ✅ **Rollback Support** - Automatic rollback on failure
- ✅ **Clean Deployments** - Only essential files in production
- ✅ **Complete Documentation** - Step-by-step guides
- ✅ **Cross-Platform** - Works on Windows, Mac, Linux

## 🎓 Learning Path

**If you're new to this workflow:**

1. **Read:** [WORKFLOW_IMPLEMENTATION_COMPLETE.md](WORKFLOW_IMPLEMENTATION_COMPLETE.md)
   - Understand the concept and benefits

2. **Setup:** [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
   - Configure your repository and server

3. **Practice:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
   - Learn common commands

4. **Master:** [GIT_WORKFLOW_GUIDE.md](GIT_WORKFLOW_GUIDE.md)
   - Deep dive into all procedures

## 🔧 Prerequisites

Before using this workflow, ensure you have:

- ✅ Git installed
- ✅ GitHub repository set up
- ✅ Production server with SSH access
- ✅ Composer and Node.js installed
- ✅ Laravel application configured

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Branch                          │
│  • All files (code, tests, docs, configs)                   │
│  • Daily development work                                    │
│  • Feature branches merge here first                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Deploy Script
                        │ (Automated merge)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Main Branch                              │
│  • Production files only                                     │
│  • No tests, docs, or dev files                             │
│  • Protected from direct commits                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ GitHub Actions
                        │ (Auto-triggered)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Production Server                           │
│  • Automatic deployment                                      │
│  • Migrations run automatically                              │
│  • Caches cleared and optimized                             │
│  • Services restarted                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Common Tasks

### Deploy to Production
```powershell
.\deploy-to-production.ps1
```

### Check Deployment Status
Visit: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

### Rollback to Previous Version
```powershell
git checkout main
git reset --hard HEAD~1
git push origin main --force-with-lease
```

### View Production Logs
```bash
ssh user@server
tail -f /path/to/project/storage/logs/laravel.log
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Deployment fails | Check GitHub Actions logs |
| Tests fail | Fix tests or skip (not recommended) |
| Merge conflicts | Resolve manually, see guide |
| Site not updating | Clear caches, verify deployment |

For detailed troubleshooting, see [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md#-troubleshooting)

## 🔐 Security

### Required GitHub Secrets

To enable automated deployments, configure these secrets:

- `PRODUCTION_HOST` - Server IP/domain
- `PRODUCTION_USER` - SSH username
- `PRODUCTION_SSH_KEY` - Private SSH key
- `PRODUCTION_PATH` - Project path on server
- `PRODUCTION_URL` - Live site URL
- Database credentials (username, password, database name)

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md#step-4-set-up-github-secrets) for details.

## 📝 Commit Message Convention

Use conventional commits for better organization:

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
chore: update dependencies
refactor: improve code structure
```

## 🎉 Benefits

### For Developers
- ✅ Complete dev environment always available
- ✅ Tests and documentation stay with code
- ✅ Rapid development without production concerns

### For Production
- ✅ Lean, fast deployments
- ✅ No unnecessary files
- ✅ Reduced security surface area
- ✅ Automated and consistent

### For Teams
- ✅ Clear workflow everyone follows
- ✅ Reduced deployment errors
- ✅ Easy onboarding for new developers
- ✅ Comprehensive documentation

## 📞 Need Help?

1. **Check the docs** - Comprehensive guides for all scenarios
2. **Review logs** - GitHub Actions and Laravel logs
3. **Test locally** - Verify changes before deploying
4. **Ask for help** - Share logs and error messages

## 🚦 Status

| Component | Status | Version |
|-----------|--------|---------|
| Workflow System | ✅ Ready | 1.0.0 |
| Documentation | ✅ Complete | - |
| Deployment Scripts | ✅ Tested | - |
| GitHub Actions | ✅ Configured | - |

## 📅 Changelog

### Version 1.0.0 (2025-01-XX)
- ✨ Initial implementation
- 📚 Complete documentation
- 🤖 Automated deployment scripts
- 🔄 GitHub Actions CI/CD workflow
- 🛡️ Branch protection setup

## 🙏 Best Practices

### DO ✅
- Always work on developer branch
- Test before deploying
- Use the deployment script
- Monitor deployments
- Keep branches synced

### DON'T ❌
- Never commit directly to main
- Never force push to main
- Never skip testing
- Never deploy without backup
- Never ignore error notifications

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions Guide](https://docs.github.com/en/actions)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🎓 Next Steps

1. ✅ **Read this README** (you're here!)
2. 📖 **Review:** [WORKFLOW_IMPLEMENTATION_COMPLETE.md](WORKFLOW_IMPLEMENTATION_COMPLETE.md)
3. ⚙️ **Setup:** Follow [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
4. 🚀 **Deploy:** Test with a small change
5. 📊 **Monitor:** Watch first deployment closely
6. 🎯 **Master:** Practice the daily workflow

---

**Created by:** Development Team  
**Last Updated:** 2025-01-XX  
**License:** Proprietary  
**Support:** See documentation files

**Previous Project Updates:**
- ✅ Fixed category management (delete buttons, subcategory counts)
- ✅ Implemented discount percentage calculator for products
- ✅ Implemented professional two-branch Git workflow

---

💡 **Tip:** Start with [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for your first deployment!
