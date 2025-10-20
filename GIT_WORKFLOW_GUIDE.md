# Git Workflow Guide - Production & Development Branches

## Overview

This project uses a **two-branch workflow** to separate production-ready code from development work:

- **`main` branch**: Production-ready code that auto-deploys to the live server
- **`developer` branch**: Full development environment with all files, tests, and documentation

## Branch Structure

```
main (production)           developer (development)
    │                             │
    │                             ├── All source files
    │                             ├── Tests
    │                             ├── Documentation
    │                             ├── Development scripts
    │                             └── IDE configurations
    │
    └── Production files only
        ├── app/
        ├── config/
        ├── database/ (migrations only)
        ├── public/
        ├── resources/
        ├── routes/
        └── Essential configs
```

## Getting Started

### 1. Initial Setup (First Time Only)

```bash
# Make sure you're on the main branch
git checkout main

# Create the developer branch from main
git checkout -b developer

# Push developer branch to GitHub
git push -u origin developer

# Set developer as your default working branch
git config branch.developer.description "Development branch with all files"
```

### 2. Set Up Your Local Environment

```bash
# Always start your work on the developer branch
git checkout developer

# Install dependencies
composer install
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Build assets
npm run build
```

## Daily Workflow

### Working on Features/Fixes

```bash
# 1. Switch to developer branch
git checkout developer

# 2. Pull latest changes
git pull origin developer

# 3. Make your changes
# ... code, code, code ...

# 4. Test your changes
php artisan test
npm run build

# 5. Stage and commit
git add .
git commit -m "feat: add discount percentage feature"

# 6. Push to developer branch
git push origin developer
```

### Deploying to Production

#### Option A: Using the Deployment Script (Recommended)

```bash
# Run the automated deployment script
./deploy-to-production.sh
```

#### Option B: Manual Deployment

```bash
# 1. Make sure developer is clean and tested
git checkout developer
git status  # Should be clean

# 2. Switch to main branch
git checkout main

# 3. Merge developer into main (use --no-ff for merge commit)
git merge developer --no-ff -m "Release: [description of changes]"

# 4. Push to main (triggers auto-deployment)
git push origin main

# 5. Switch back to developer
git checkout developer

# 6. Merge main back to developer (keep branches in sync)
git merge main
git push origin developer
```

## Commit Message Convention

Use conventional commits for better changelog generation:

```bash
# Features
git commit -m "feat: add user authentication"
git commit -m "feat(admin): add product discount calculator"

# Bug Fixes
git commit -m "fix: resolve category deletion error"
git commit -m "fix(ui): correct mobile menu alignment"

# Documentation
git commit -m "docs: update deployment guide"

# Refactoring
git commit -m "refactor: optimize product query performance"

# Tests
git commit -m "test: add category CRUD tests"

# Chores
git commit -m "chore: update dependencies"
git commit -m "chore: clean up unused imports"
```

## Branch Protection Rules

### Main Branch (Production)

**GitHub Settings → Branches → Add Rule for `main`:**

- ✅ Require a pull request before merging
- ✅ Require approvals (at least 1)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ❌ Allow force pushes (NEVER!)
- ❌ Allow deletions (NEVER!)

### Developer Branch

**GitHub Settings → Branches → Add Rule for `developer`:**

- ✅ Require status checks to pass before merging (optional)
- ❌ Require pull request (more flexible for development)
- ✅ Include administrators

## What Goes Where

### Main Branch (Production) - Includes:

✅ **Application Code:**
- `app/` - All PHP application code
- `config/` - Configuration files
- `database/migrations/` - Database migrations
- `routes/` - Route files
- `public/` - Public assets
- `resources/` - Views, JavaScript, CSS
- `bootstrap/` - Bootstrap files
- `storage/` - Storage structure (not logs/cache)

✅ **Configuration:**
- `composer.json` & `composer.lock`
- `package.json` & `package-lock.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `.env.example`
- `artisan`
- `server.php`

### Main Branch - Excludes:

❌ **Development Files:**
- All `.md` documentation (except README.md)
- `tests/` - Test files
- `phpunit.xml` - PHPUnit configuration
- `test-*.php` - Test scripts
- IDE configurations (`.vscode`, `.idea`, etc.)
- `deploy-*.sh` - Deployment scripts

❌ **Development Dependencies:**
- `node_modules/` (installed on server)
- `vendor/` (installed on server)
- Build artifacts (rebuilt on server)

❌ **Sensitive/Unnecessary:**
- `.env` files (except .env.example)
- Database files (`database.sqlite`)
- Log files
- Cache files

### Developer Branch - Includes:

✅ **Everything from Main Branch PLUS:**
- All documentation files (`.md`)
- Test files and test scripts
- Development scripts
- IDE configurations
- Additional development tools
- Database seeders
- Example/demo files

## Syncing Branches

### Keep Developer Updated with Main

```bash
# Switch to developer
git checkout developer

# Pull latest from main
git pull origin main

# Resolve any conflicts
# ... fix conflicts if any ...

# Push updated developer
git push origin developer
```

### Emergency Hotfix

If you need to fix something directly in production:

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug-fix

# 2. Make the fix
# ... fix the bug ...

# 3. Commit the fix
git commit -am "hotfix: fix critical payment bug"

# 4. Merge to main
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

# 5. Merge to developer (important!)
git checkout developer
git merge main
git push origin developer

# 6. Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## CI/CD Pipeline

### Automatic Deployment Triggers

When you push to `main`:
1. GitHub Actions workflow starts
2. Runs tests (if configured)
3. Installs production dependencies
4. Builds frontend assets
5. Deploys to production server
6. Runs migrations
7. Clears caches
8. Sends notification

### Manual Deployment

If auto-deployment fails, you can deploy manually:

```bash
# SSH into your production server
ssh user@your-server.com

# Navigate to project directory
cd /path/to/your/project

# Pull latest changes
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader

# Install npm packages and build
npm ci
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Restart services (if needed)
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
```

## Troubleshooting

### Merge Conflicts

```bash
# If you get conflicts during merge
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "merge: resolve conflicts from main"
```

### Accidental Commit to Main

```bash
# If you accidentally committed to main without testing
git reset --soft HEAD~1  # Undo last commit, keep changes
git stash  # Save changes

# Switch to developer
git checkout developer
git stash pop  # Restore changes

# Commit properly
git add .
git commit -m "feat: proper commit message"
```

### Reset Main to Match GitHub

```bash
# If local main is messed up
git checkout main
git fetch origin
git reset --hard origin/main
```

## Best Practices

### DO ✅

1. **Always work on `developer` branch**
2. **Test thoroughly before merging to main**
3. **Write clear commit messages**
4. **Keep branches synced regularly**
5. **Use pull requests for main branch merges**
6. **Review code before deploying**
7. **Back up database before major deployments**
8. **Monitor deployment logs**

### DON'T ❌

1. **Never commit directly to main**
2. **Never force push to main**
3. **Never skip testing before deployment**
4. **Never commit sensitive data (.env, keys)**
5. **Never leave branches out of sync for long**
6. **Never delete main branch**
7. **Never deploy without backup**
8. **Never commit node_modules or vendor**

## Quick Reference

### Switch Branches
```bash
git checkout developer  # Switch to development
git checkout main       # Switch to production
```

### Check Current Branch
```bash
git branch              # Show local branches (* = current)
git branch -a           # Show all branches (including remote)
```

### View Status
```bash
git status              # See changed files
git log --oneline -10   # See last 10 commits
git diff                # See changes not yet staged
```

### Undo Changes
```bash
git checkout -- file.php    # Discard changes to file
git reset HEAD file.php     # Unstage file
git reset --soft HEAD~1     # Undo last commit, keep changes
git reset --hard HEAD~1     # Undo last commit, discard changes
```

### Clean Up
```bash
git clean -fd           # Remove untracked files
git gc                  # Optimize repository
```

## Emergency Contacts

If something goes wrong:
1. Don't panic
2. Don't force push
3. Check deployment logs
4. Contact team lead
5. Roll back if needed:
   ```bash
   git checkout main
   git reset --hard <previous-commit-sha>
   git push origin main --force-with-lease
   ```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Laravel Deployment](https://laravel.com/docs/deployment)

---

**Remember:** When in doubt, work on `developer` and ask before pushing to `main`!
