# Quick Deployment Commands
# Run this after adding GitHub Secrets

Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AVHIRA - QUICK DEPLOYMENT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Change to project directory
cd E:\Avhira\avhirawebsite\avhira

Write-Host "Current directory: $(Get-Location)" -ForegroundColor White
Write-Host "`n"

# Check if workflow file exists
if (Test-Path ".github\workflows\deploy.yml") {
    Write-Host "✓ Workflow file found" -ForegroundColor Green
} else {
    Write-Host "✗ Workflow file not found!" -ForegroundColor Red
    Write-Host "  Expected: .github\workflows\deploy.yml" -ForegroundColor Yellow
    exit
}

Write-Host "`n"
Write-Host "Ready to deploy! Here's what will happen:" -ForegroundColor Yellow
Write-Host "1. Add workflow and docs to git" -ForegroundColor White
Write-Host "2. Commit changes" -ForegroundColor White
Write-Host "3. Push to GitHub (triggers deployment)" -ForegroundColor White
Write-Host "`n"

$response = Read-Host "Have you added all 5 GitHub Secrets? (yes/no)"
if ($response -ne "yes") {
    Write-Host "`n" -ForegroundColor Red
    Write-Host "Please add GitHub Secrets first!" -ForegroundColor Red
    Write-Host "Go to: https://github.com/techapsalwar/avhira/settings/secrets/actions" -ForegroundColor Cyan
    Write-Host "`nSee DEPLOYMENT_STATUS.md for details." -ForegroundColor Yellow
    exit
}

Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 1: Git Status" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

git status

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 2: Adding Files" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

git add .github/workflows/deploy.yml
git add docs/
git add GITHUB_SECRETS.md
git add DEPLOYMENT_STATUS.md
git add deployment-setup.ps1
git add deploy-now.ps1

Write-Host "✓ Files staged for commit" -ForegroundColor Green

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 3: Committing" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

git commit -m "feat: Add CI/CD deployment pipeline for Hostinger

- GitHub Actions workflow for automated deployment
- SSH-based deployment to Hostinger shared hosting
- Comprehensive documentation and guides
- Production environment configuration
- Automated backups and rollback capability

Deployment target: avhira.com (89.117.188.174:65002)"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✗ Commit failed!" -ForegroundColor Red
    exit
}

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 4: Pushing to GitHub" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Pushing to origin/main..." -ForegroundColor White
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ✓ DEPLOYMENT STARTED!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`n"
    
    Write-Host "GitHub Actions is now deploying your application!" -ForegroundColor Yellow
    Write-Host "`n"
    Write-Host "Monitor progress at:" -ForegroundColor White
    Write-Host "https://github.com/techapsalwar/avhira/actions" -ForegroundColor Cyan
    Write-Host "`n"
    Write-Host "What's happening now:" -ForegroundColor Yellow
    Write-Host "1. Building PHP & Node.js environment" -ForegroundColor White
    Write-Host "2. Installing dependencies" -ForegroundColor White
    Write-Host "3. Building production assets" -ForegroundColor White
    Write-Host "4. Creating deployment package" -ForegroundColor White
    Write-Host "5. Deploying to Hostinger via SSH" -ForegroundColor White
    Write-Host "6. Running migrations & optimizations" -ForegroundColor White
    Write-Host "`n"
    Write-Host "Estimated time: 3-5 minutes" -ForegroundColor Cyan
    Write-Host "`n"
    
    Write-Host "After deployment completes:" -ForegroundColor Yellow
    Write-Host "1. Set document root in Hostinger to: /public" -ForegroundColor White
    Write-Host "2. Visit: https://avhira.com" -ForegroundColor White
    Write-Host "3. Run post-deployment commands (see DEPLOYMENT_STATUS.md)" -ForegroundColor White
    Write-Host "`n"
    
    $openBrowser = Read-Host "Open GitHub Actions in browser? (yes/no)"
    if ($openBrowser -eq "yes") {
        Start-Process "https://github.com/techapsalwar/avhira/actions"
    }
    
} else {
    Write-Host "`n✗ Push failed!" -ForegroundColor Red
    Write-Host "Check your git configuration and network connection." -ForegroundColor Yellow
}

Write-Host "`n"
