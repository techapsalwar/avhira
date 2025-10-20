# =============================================================================
# Avhira Website - Production Deployment Script (PowerShell)
# =============================================================================
# This script automates the deployment process from developer branch to main
# Usage: .\deploy-to-production.ps1
# =============================================================================

# Ensure script stops on errors
$ErrorActionPreference = "Stop"

# Color functions
function Write-Header($message) {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "  $message" -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

function Write-Error-Custom($message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

function Write-Warning-Custom($message) {
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

function Write-Info($message) {
    Write-Host "ℹ $message" -ForegroundColor Cyan
}

# =============================================================================
# Pre-deployment Checks
# =============================================================================

Write-Header "Pre-Deployment Checks"

# Check if we're in a git repository
try {
    $gitCheck = git rev-parse --is-inside-work-tree 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not in a git repository"
    }
    Write-Success "Git repository detected"
} catch {
    Write-Error-Custom "Not in a git repository!"
    exit 1
}

# Get current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Info "Current branch: $currentBranch"

# Make sure we're on developer branch
if ($currentBranch -ne "developer") {
    Write-Warning-Custom "You're not on the developer branch. Switching..."
    try {
        git checkout developer
        Write-Success "Switched to developer branch"
    } catch {
        Write-Error-Custom "Failed to switch to developer branch"
        exit 1
    }
}
Write-Success "On developer branch"

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Error-Custom "You have uncommitted changes!"
    Write-Host ""
    git status --short
    Write-Host ""
    
    $response = Read-Host "Do you want to commit these changes? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        $commitMsg = Read-Host "Enter commit message"
        git add .
        git commit -m $commitMsg
        Write-Success "Changes committed"
    } else {
        Write-Error-Custom "Please commit or stash your changes before deploying"
        exit 1
    }
}
Write-Success "Working directory is clean"

# Pull latest changes from remote
Write-Info "Pulling latest changes from remote..."
try {
    git pull origin developer
    Write-Success "Up to date with remote"
} catch {
    Write-Error-Custom "Failed to pull from remote"
    exit 1
}

# =============================================================================
# Testing
# =============================================================================

Write-Header "Running Tests"

# Check if composer is installed
if (Get-Command composer -ErrorAction SilentlyContinue) {
    Write-Info "Installing/updating PHP dependencies..."
    try {
        composer install --no-interaction
        Write-Success "PHP dependencies ready"
    } catch {
        Write-Warning-Custom "Composer install failed, but continuing..."
    }
} else {
    Write-Warning-Custom "Composer not found, skipping dependency check"
}

# Check if npm is installed
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Info "Installing/updating Node dependencies..."
    try {
        npm install
        
        Write-Info "Building frontend assets..."
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed"
        }
        Write-Success "Frontend assets built successfully"
    } catch {
        Write-Error-Custom "Build failed! Cannot deploy broken assets."
        exit 1
    }
} else {
    Write-Warning-Custom "npm not found, skipping frontend build"
}

# Run PHP tests if they exist
if (Test-Path "phpunit.xml") {
    Write-Info "Running PHP tests..."
    if (Get-Command php -ErrorAction SilentlyContinue) {
        try {
            php artisan test --stop-on-failure
            if ($LASTEXITCODE -ne 0) {
                throw "Tests failed"
            }
            Write-Success "All tests passed"
        } catch {
            Write-Error-Custom "Tests failed! Cannot deploy."
            $response = Read-Host "Deploy anyway? (y/n)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                exit 1
            }
        }
    } else {
        Write-Warning-Custom "PHP not found, skipping tests"
    }
}

# =============================================================================
# Deployment Confirmation
# =============================================================================

Write-Header "Deployment Confirmation"

Write-Host ""
Write-Host "You are about to deploy to PRODUCTION!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Changes to be deployed:" -ForegroundColor Cyan
git log --oneline --graph origin/main..HEAD | Select-Object -First 10
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne 'yes' -and $confirmation -ne 'YES') {
    Write-Info "Deployment cancelled"
    exit 0
}

# =============================================================================
# Merge to Main Branch
# =============================================================================

Write-Header "Merging to Main Branch"

# Switch to main branch
Write-Info "Switching to main branch..."
try {
    git checkout main
    Write-Success "Switched to main branch"
} catch {
    Write-Error-Custom "Failed to switch to main branch"
    exit 1
}

# Pull latest main
Write-Info "Pulling latest main..."
try {
    git pull origin main
} catch {
    Write-Error-Custom "Failed to pull main"
    git checkout developer
    exit 1
}

# Merge developer into main
Write-Info "Merging developer into main..."
$mergeDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
try {
    git merge developer --no-ff -m "Release: Deployment from developer on $mergeDate"
    Write-Success "Merge successful"
} catch {
    Write-Error-Custom "Merge failed! Please resolve conflicts manually."
    Write-Info "After resolving conflicts, run:"
    Write-Host "  git add ." -ForegroundColor Yellow
    Write-Host "  git commit" -ForegroundColor Yellow
    Write-Host "  git push origin main" -ForegroundColor Yellow
    Write-Host "  git checkout developer" -ForegroundColor Yellow
    Write-Host "  git merge main" -ForegroundColor Yellow
    exit 1
}

# =============================================================================
# Push to Production
# =============================================================================

Write-Header "Pushing to Production"

# Push to remote main
Write-Info "Pushing to remote main branch..."
try {
    git push origin main
    Write-Success "Pushed to production successfully!"
} catch {
    Write-Error-Custom "Failed to push to production"
    Write-Info "You may need to pull and merge again"
    git checkout developer
    exit 1
}

# =============================================================================
# Sync Developer Branch
# =============================================================================

Write-Header "Syncing Developer Branch"

# Switch back to developer
Write-Info "Switching back to developer branch..."
git checkout developer

# Merge main back to developer
Write-Info "Merging main back to developer..."
git merge main

# Push updated developer
Write-Info "Pushing updated developer branch..."
git push origin developer

Write-Success "Developer branch synced"

# =============================================================================
# Deployment Summary
# =============================================================================

Write-Header "Deployment Complete!"

Write-Host ""
Write-Success "Deployment successful! 🎉"
Write-Host ""
Write-Info "Next steps:"
Write-Host "  1. Check GitHub Actions for deployment status" -ForegroundColor Cyan
Write-Host "  2. Monitor production logs for errors" -ForegroundColor Cyan
Write-Host "  3. Verify the changes on the live website" -ForegroundColor Cyan
Write-Host "  4. Test critical functionality" -ForegroundColor Cyan
Write-Host ""
Write-Info "Production URL: https://your-production-url.com"
Write-Info "GitHub Actions: https://github.com/your-username/your-repo/actions"
Write-Host ""
Write-Warning-Custom "Remember to monitor the deployment for the next 10-15 minutes"
Write-Host ""

# Optionally open GitHub Actions in browser
# Start-Process "https://github.com/your-username/your-repo/actions"

exit 0
