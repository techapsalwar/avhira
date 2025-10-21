# =============================================================================
# Repository Cleanup Script - Main Branch Production-Only Files
# =============================================================================
# This script cleans the main branch to contain only production-necessary files
# All files are safely stored in the developer branch
# =============================================================================

$ErrorActionPreference = "Stop"

# Colors
function Write-Header($msg) { Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue; Write-Host "  $msg" -ForegroundColor Blue; Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue }
function Write-Success($msg) { Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Error-Custom($msg) { Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Warning-Custom($msg) { Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Write-Info($msg) { Write-Host "ℹ $msg" -ForegroundColor Cyan }

Write-Header "Repository Cleanup - Main Branch"

# =============================================================================
# Safety Checks
# =============================================================================

Write-Info "Running safety checks..."

# Check if we're in a git repository
try {
    $gitCheck = git rev-parse --is-inside-work-tree 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Not in git repo" }
    Write-Success "Git repository detected"
} catch {
    Write-Error-Custom "Not in a git repository!"
    exit 1
}

# Check current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Info "Current branch: $currentBranch"

if ($currentBranch -ne "main") {
    Write-Warning-Custom "Not on main branch. Switching..."
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Failed to switch to main branch"
        exit 1
    }
}

# Check if developer branch exists
$branches = git branch -a
if ($branches -notmatch "developer") {
    Write-Error-Custom "Developer branch doesn't exist! Please create it first:"
    Write-Host "  git checkout -b developer" -ForegroundColor Yellow
    Write-Host "  git push -u origin developer" -ForegroundColor Yellow
    exit 1
}
Write-Success "Developer branch exists (backup confirmed)"

# =============================================================================
# Confirmation
# =============================================================================

Write-Host ""
Write-Warning-Custom "⚠️  This will DELETE many files from the main branch!"
Write-Host ""
Write-Info "Files to be removed:"
Write-Host "  • All .md documentation files (except README.md)" -ForegroundColor Yellow
Write-Host "  • Test scripts (test-*.php)" -ForegroundColor Yellow
Write-Host "  • Deployment scripts" -ForegroundColor Yellow
Write-Host "  • Extra database seeders" -ForegroundColor Yellow
Write-Host "  • Development migration files" -ForegroundColor Yellow
Write-Host ""
Write-Success "✓ All files are safe in the developer branch"
Write-Host ""

$confirm = Read-Host "Continue with cleanup? (type 'yes' to continue)"
if ($confirm -ne "yes") {
    Write-Info "Cleanup cancelled"
    exit 0
}

# =============================================================================
# Backup Current State
# =============================================================================

Write-Header "Creating Backup"

Write-Info "Committing current state before cleanup..."
git add .
git commit -m "chore: backup before main branch cleanup" -q 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Current state saved"
} else {
    Write-Info "Nothing to commit (already clean)"
}

# =============================================================================
# Remove Documentation Files
# =============================================================================

Write-Header "Removing Documentation Files"

$docsToRemove = @(
    "ADMIN_CATEGORY_GUIDE.md",
    "CATEGORY_ADMIN_IMPROVEMENTS.md",
    "CATEGORY_MIGRATION_SUMMARY.md",
    "CATEGORY_REFRESH_COMPLETE.md",
    "CATEGORY_SYSTEM.md",
    "CATEGORY_UPDATE_SUMMARY.md",
    "CLEANUP_AND_BRANCH_SETUP.md",
    "DEPLOYMENT_FIX_LOG.md",
    "DEPLOYMENT_LEARNINGS_REPORT.md",
    "DEPLOYMENT_STATUS.md",
    "DEPLOYMENT_SUCCESS.md",
    "DEPLOYMENT_SUMMARY.md",
    "DISCOUNT_PERCENTAGE_FEATURE.md",
    "GITHUB_ACTIONS_SETUP.md",
    "GITHUB_SECRETS.md",
    "GIT_WORKFLOW_GUIDE.md",
    "GIT_WORKFLOW_README.md",
    "HOW_TO_ADD_PRODUCTS.md",
    "MAIN_CATEGORY_DELETE_FIX.md",
    "MAIN_CATEGORY_PRODUCTS_FEATURE.md",
    "MANUAL_DEPLOYMENT.md",
    "POST_DEPLOYMENT_GUIDE.md",
    "QUICK_ADD_PRODUCT.md",
    "QUICK_SEPARATE_TABLES.md",
    "SEPARATE_TABLES_COMPLETE.md",
    "SETUP_INSTRUCTIONS.md",
    "STAGING_SETUP_COMPLETE.md",
    "STAGING_SETUP_STATUS.md",
    "SUBCATEGORIES_COUNT_FIX.md",
    "WINDOWS-DEV-SETUP.md",
    "WORKFLOW_IMPLEMENTATION_COMPLETE.md"
)

$removedDocs = 0
foreach ($doc in $docsToRemove) {
    if (Test-Path $doc) {
        Remove-Item $doc -Force
        Write-Info "Removed: $doc"
        $removedDocs++
    }
}
Write-Success "Removed $removedDocs documentation files"

# =============================================================================
# Remove Test Scripts
# =============================================================================

Write-Header "Removing Test Scripts"

$testScripts = Get-ChildItem -Path "." -Filter "test-*.php"
$removedTests = 0
foreach ($script in $testScripts) {
    Remove-Item $script.FullName -Force
    Write-Info "Removed: $($script.Name)"
    $removedTests++
}
Write-Success "Removed $removedTests test scripts"

# =============================================================================
# Remove Deployment Scripts
# =============================================================================

Write-Header "Removing Deployment Scripts"

$deployScripts = @(
    "deploy-to-production.sh",
    "deploy-to-production.ps1",
    "cleanup-main-branch.ps1"
)

$removedDeploy = 0
foreach ($script in $deployScripts) {
    if (Test-Path $script) {
        Remove-Item $script -Force
        Write-Info "Removed: $script"
        $removedDeploy++
    }
}
Write-Success "Removed $removedDeploy deployment scripts"

# =============================================================================
# Clean Database Seeders
# =============================================================================

Write-Header "Cleaning Database Seeders"

$seedersToRemove = @(
    "database\seeders\AddJacketProductSeeder.php",
    "database\seeders\CategorySeeder.php",
    "database\seeders\CompleteRefreshCategoriesSeeder.php",
    "database\seeders\MigrateProductsToNewCategoriesSeeder.php",
    "database\seeders\MigrateProductsToSubcategoriesSeeder.php",
    "database\seeders\RefreshCategoriesSeeder.php",
    "database\seeders\SeparateTablesSeeder.php"
)

$removedSeeders = 0
foreach ($seeder in $seedersToRemove) {
    if (Test-Path $seeder) {
        Remove-Item $seeder -Force
        Write-Info "Removed: $seeder"
        $removedSeeders++
    }
}
Write-Success "Removed $removedSeeders development seeders"
Write-Info "Kept: DatabaseSeeder.php"

# =============================================================================
# Clean Development Migrations
# =============================================================================

Write-Header "Cleaning Development Migrations"

$migrationsToRemove = @(
    "database\migrations\2025_10_20_095811_update_categories_table_add_parent_id.php",
    "database\migrations\2025_10_20_100406_add_display_order_and_is_active_to_categories.php"
)

$removedMigrations = 0
foreach ($migration in $migrationsToRemove) {
    if (Test-Path $migration) {
        Remove-Item $migration -Force
        Write-Info "Removed: $migration"
        $removedMigrations++
    }
}
Write-Success "Removed $removedMigrations development migrations"
Write-Info "Kept production migrations"

# =============================================================================
# Remove Extra Config Files
# =============================================================================

Write-Header "Cleaning Configuration Files"

if (Test-Path ".gitignore.production") {
    # First, apply production gitignore
    Copy-Item ".gitignore.production" ".gitignore" -Force
    Write-Success "Applied production .gitignore"
    
    # Then remove the template
    Remove-Item ".gitignore.production" -Force
    Write-Info "Removed: .gitignore.production"
}

# Remove envo-earth directory if it exists (seems to be duplicate project)
if (Test-Path "envo-earth") {
    Remove-Item "envo-earth" -Recurse -Force
    Write-Success "Removed: envo-earth directory"
}

# =============================================================================
# Commit Changes
# =============================================================================

Write-Header "Committing Cleanup"

Write-Info "Staging all changes..."
git add -A

Write-Info "Committing cleanup..."
git commit -m "chore: clean main branch for production-only files

Removed:
- Documentation files (except README.md)
- Test scripts
- Deployment scripts
- Development seeders
- Development migrations
- Extra configuration files

Production-ready main branch created.
All files preserved in developer branch."

if ($LASTEXITCODE -eq 0) {
    Write-Success "Cleanup committed successfully"
} else {
    Write-Warning-Custom "Commit may have failed or no changes detected"
}

# =============================================================================
# Summary
# =============================================================================

Write-Header "Cleanup Complete!"

Write-Host ""
Write-Success "✓ Main branch cleaned for production"
Write-Host ""
Write-Info "Summary of changes:"
Write-Host "  • Documentation files removed: $removedDocs" -ForegroundColor Cyan
Write-Host "  • Test scripts removed: $removedTests" -ForegroundColor Cyan
Write-Host "  • Deployment scripts removed: $removedDeploy" -ForegroundColor Cyan
Write-Host "  • Database seeders removed: $removedSeeders" -ForegroundColor Cyan
Write-Host "  • Migrations removed: $removedMigrations" -ForegroundColor Cyan
Write-Host ""
Write-Success "✓ All removed files are safe in developer branch"
Write-Host ""

Write-Info "Next steps:"
Write-Host "  1. Review changes: git status" -ForegroundColor Yellow
Write-Host "  2. Push to GitHub: git push origin main" -ForegroundColor Yellow
Write-Host "  3. Switch to developer: git checkout developer" -ForegroundColor Yellow
Write-Host ""
Write-Warning-Custom "⚠️  Before pushing, verify this is what you want!"
Write-Host ""

$pushNow = Read-Host "Push changes to GitHub now? (yes/no)"
if ($pushNow -eq "yes") {
    Write-Info "Pushing to origin/main..."
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Pushed to GitHub successfully!"
        Write-Info "Main branch is now production-ready"
    } else {
        Write-Error-Custom "Push failed. Please push manually: git push origin main"
    }
} else {
    Write-Info "Skipped push. Run manually: git push origin main"
}

Write-Host ""
Write-Success "🎉 Cleanup complete!"
Write-Host ""

exit 0
