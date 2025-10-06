# 🚀 Git and GitHub Setup Script for Avhira CI/CD

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Avhira - GitHub Setup & Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git Repository
Write-Host "Step 1: Initializing Git Repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}
Write-Host ""

# Step 2: Add Remote Repository
Write-Host "Step 2: Setting up remote repository..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "✓ Remote 'origin' already configured" -ForegroundColor Green
    Write-Host "   URL: $remoteExists" -ForegroundColor Gray
} else {
    Write-Host "Adding remote repository: techapsalwar/avhira" -ForegroundColor Gray
    git remote add origin https://github.com/techapsalwar/avhira.git
    Write-Host "✓ Remote 'origin' configured" -ForegroundColor Green
}
Write-Host ""

# Step 3: Add Files
Write-Host "Step 3: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added to staging" -ForegroundColor Green
Write-Host ""

# Step 4: Check Git Status
Write-Host "Step 4: Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Step 5: Commit Changes
Write-Host "Step 5: Creating commit..." -ForegroundColor Yellow
$commitMessage = "Add CI/CD pipeline for automated Hostinger deployment"
git commit -m "$commitMessage"
Write-Host "✓ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 6: Set Main Branch
Write-Host "Step 6: Setting up main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to 'main'" -ForegroundColor Green
Write-Host ""

# Step 7: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "WARNING: You'll be prompted for GitHub authentication" -ForegroundColor Red
Write-Host "   Option 1: Use Personal Access Token (recommended)" -ForegroundColor Yellow
Write-Host "   Option 2: Use GitHub Desktop for authentication" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pushing to: https://github.com/techapsalwar/avhira.git" -ForegroundColor Gray
Write-Host ""

$pushConfirm = Read-Host "Ready to push? (Y/N)"
if ($pushConfirm -eq "Y" -or $pushConfirm -eq "y") {
    git push -u origin main
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "⚠ Push cancelled. Run manually: git push -u origin main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure GitHub Secrets:" -ForegroundColor White
Write-Host "   Go to: https://github.com/techapsalwar/avhira/settings/secrets/actions" -ForegroundColor Gray
Write-Host "   Add these secrets:" -ForegroundColor Gray
Write-Host "   - SSH_HOST: 89.117.188.174" -ForegroundColor Gray
Write-Host "   - SSH_USERNAME: u885878505" -ForegroundColor Gray
Write-Host "   - SSH_PASSWORD: <your-hostinger-password>" -ForegroundColor Gray
Write-Host "   - SSH_PORT: 65002" -ForegroundColor Gray
Write-Host "   - PROJECT_PATH: /home/u885878505/public_html/avhira" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Prepare Hostinger Server:" -ForegroundColor White
Write-Host "   ssh -p 65002 u885878505@89.117.188.174" -ForegroundColor Gray
Write-Host "   Follow: .github/DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Monitor Deployment:" -ForegroundColor White
Write-Host "   https://github.com/techapsalwar/avhira/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""
