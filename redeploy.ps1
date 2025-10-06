# Quick Redeploy Script
# Run this to trigger deployment after fixing SSH key

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TRIGGERING DEPLOYMENT" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Creating empty commit to trigger deployment...`n" -ForegroundColor Yellow

# Create empty commit to trigger workflow
git commit --allow-empty -m "chore: Trigger deployment after SSH key update

- Updated SSH key from ED25519 to RSA format
- RSA key tested and working
- GitHub Secret updated with new key"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created`n" -ForegroundColor Green
    
    Write-Host "Pushing to GitHub...`n" -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n" -ForegroundColor Green
        Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                                                                ║" -ForegroundColor Green
        Write-Host "║           ✅ DEPLOYMENT TRIGGERED SUCCESSFULLY! ✅              ║" -ForegroundColor Green
        Write-Host "║                                                                ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host "`n"
        
        Write-Host "🚀 Deployment started with fixed SSH key!`n" -ForegroundColor Yellow
        Write-Host "📊 Monitor at: https://github.com/techapsalwar/avhira/actions" -ForegroundColor Cyan
        Write-Host "`n"
        Write-Host "This time SSH authentication should work!" -ForegroundColor Green
        Write-Host "`n"
        
        $openBrowser = Read-Host "Open GitHub Actions to monitor? (yes/no)"
        if ($openBrowser -eq "yes") {
            Start-Process "https://github.com/techapsalwar/avhira/actions"
        }
    } else {
        Write-Host "`n✗ Push failed!" -ForegroundColor Red
    }
} else {
    Write-Host "`n✗ Commit failed!" -ForegroundColor Red
}

Write-Host "`n"
