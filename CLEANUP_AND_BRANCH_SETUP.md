# 🧹 Repository Cleanup & Branch Setup Guide

## Current Situation

Your `main` branch has **many files that shouldn't be in production**:
- ❌ 18+ Markdown documentation files
- ❌ Test scripts (test-*.php)
- ❌ Multiple database seeders
- ❌ Development migration files
- ❌ Deployment scripts (not needed in repo)

## 🎯 Goal

Create a clean two-branch structure:
- **`developer` branch** → ALL files (current state)
- **`main` branch** → ONLY production files

## 📋 Step-by-Step Cleanup Process

### Step 1: Commit Everything to Developer Branch First

```powershell
# We're on main, let's commit everything first
git add .
git commit -m "chore: save all current work before branch restructure"

# Create developer branch with ALL current files
git checkout -b developer
git push -u origin developer
```

### Step 2: Clean Up Main Branch

```powershell
# Switch back to main
git checkout main

# Remove all documentation files (keep only README.md)
Remove-Item -Path "*.md" -Exclude "README.md" -Force

# Remove test scripts
Remove-Item -Path "test-*.php" -Force

# Remove deployment scripts (these should be in developer only)
Remove-Item -Path "deploy-to-production.sh" -Force
Remove-Item -Path "deploy-to-production.ps1" -Force

# Remove extra seeders (keep only DatabaseSeeder.php)
Remove-Item -Path "database\seeders\*Seeder.php" -Exclude "DatabaseSeeder.php" -Force

# Remove development migrations (keep only core migrations)
# Review database/migrations folder and remove experimental ones

# Apply production .gitignore
Copy-Item -Path ".gitignore.production" -Destination ".gitignore" -Force

# Stage all deletions
git add -A
git commit -m "chore: clean main branch for production deployment"

# Push cleaned main
git push origin main
```

### Step 3: Verify Branch Differences

```powershell
# Check what's in developer
git checkout developer
Get-ChildItem -Name

# Check what's in main
git checkout main
Get-ChildItem -Name

# Compare differences
git diff developer..main --name-only
```

## ✅ Automated Cleanup Script

I'll create a PowerShell script to do this automatically for you.

### Files to DELETE from Main Branch:

#### Documentation Files (18 files):
- ADMIN_CATEGORY_GUIDE.md
- CATEGORY_ADMIN_IMPROVEMENTS.md
- CATEGORY_MIGRATION_SUMMARY.md
- CATEGORY_REFRESH_COMPLETE.md
- CATEGORY_SYSTEM.md
- CATEGORY_UPDATE_SUMMARY.md
- DEPLOYMENT_SUMMARY.md
- DISCOUNT_PERCENTAGE_FEATURE.md
- GIT_WORKFLOW_GUIDE.md
- GIT_WORKFLOW_README.md
- HOW_TO_ADD_PRODUCTS.md
- MAIN_CATEGORY_DELETE_FIX.md
- MAIN_CATEGORY_PRODUCTS_FEATURE.md
- QUICK_ADD_PRODUCT.md
- QUICK_SEPARATE_TABLES.md
- SEPARATE_TABLES_COMPLETE.md
- SETUP_INSTRUCTIONS.md
- SUBCATEGORIES_COUNT_FIX.md
- WORKFLOW_IMPLEMENTATION_COMPLETE.md
- (All other deployment/staging related .md files)

#### Test Scripts:
- test-categories.php
- test-main-categories.php
- (Any other test-*.php files)

#### Deployment Scripts:
- deploy-to-production.sh
- deploy-to-production.ps1
- .gitignore.production (after copying to .gitignore)

#### Extra Seeders:
- AddJacketProductSeeder.php
- CategorySeeder.php
- CompleteRefreshCategoriesSeeder.php
- MigrateProductsToNewCategoriesSeeder.php
- MigrateProductsToSubcategoriesSeeder.php
- RefreshCategoriesSeeder.php
- SeparateTablesSeeder.php
- (Keep only: DatabaseSeeder.php)

#### Development Migrations:
- 2025_10_20_095811_update_categories_table_add_parent_id.php
- 2025_10_20_100406_add_display_order_and_is_active_to_categories.php
- (Keep only: Final production-ready migrations)

### Files to KEEP in Main Branch:

✅ **Application Code:**
- app/ (all application code)
- config/
- database/migrations/ (only production migrations)
- database/seeders/DatabaseSeeder.php
- public/
- resources/
- routes/
- bootstrap/
- storage/

✅ **Configuration:**
- composer.json
- composer.lock
- package.json
- package-lock.json
- vite.config.ts
- tailwind.config.js
- postcss.config.js
- .env.example
- artisan
- server.php
- README.md (only this one .md file)

✅ **CI/CD:**
- .github/workflows/deploy-production.yml

## 🚀 Quick Setup Commands

Run these commands in order:

```powershell
# 1. Save everything to developer branch
git checkout main
git add .
git commit -m "chore: save all work before cleanup"
git checkout -b developer
git push -u origin developer

# 2. Run the automated cleanup script
git checkout main
.\cleanup-main-branch.ps1

# 3. Verify
git status
git log --oneline -5
```

## ⚠️ Important Notes

1. **Developer branch = backup** - All files are safe there
2. **Main branch = lean** - Only production essentials
3. **GitHub Actions** - Will still work with cleaned main
4. **Future work** - Always work on developer, merge to main for deployment

## 🔄 Daily Workflow After Cleanup

```powershell
# Development (99% of time)
git checkout developer
# ... make changes ...
git add .
git commit -m "feat: your feature"
git push origin developer

# Deployment (when ready)
.\deploy-to-production.ps1
# This will merge developer → main and trigger deployment
```

## 📊 Before vs After

### Before (Current Main):
```
Total files: ~150+
├── *.md files: 18+
├── Test scripts: 3+
├── Seeders: 8+
├── Migrations: 10+
└── Production code: ✓
```

### After (Clean Main):
```
Total files: ~80
├── *.md files: 1 (README.md)
├── Test scripts: 0
├── Seeders: 1 (DatabaseSeeder.php)
├── Migrations: 3-4 (production only)
└── Production code: ✓
```

## 🎯 Next Steps

1. Read this guide completely
2. Run the cleanup script (next file I'll create)
3. Verify both branches
4. Test deployment
5. Update documentation

---

**Status:** Ready to execute
**Risk Level:** Low (developer branch has backup)
**Time Required:** 5-10 minutes
