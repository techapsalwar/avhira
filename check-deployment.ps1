#!/usr/bin/env pwsh
# Quick script to check deployment status

Write-Host "`n🔍 Checking Deployment Status...`n" -ForegroundColor Cyan

# Check server for new build
Write-Host "📦 Checking server for new build files..." -ForegroundColor Yellow
ssh -i "$HOME\.ssh\avhira_deploy_rsa" -p 65002 u885878505@89.117.188.174 @"
cd /home/u885878505/domains/avhira.com/public_html
echo '=== Build Assets ==='
ls -lh build/assets/app-*.js | tail -1
echo ''
echo '=== Last Deployment Time ==='
stat -c '%y' build/assets/app-*.js | tail -1
echo ''
echo '=== Checking pages directory ==='
ls -ld resources/js/pages
echo ''
echo '=== Welcome.jsx exists? ==='
ls -lh resources/js/pages/Welcome.jsx
"@

Write-Host "`n✅ Check complete!" -ForegroundColor Green
Write-Host "`nExpected after successful deployment:" -ForegroundColor White
Write-Host "  • New app-*.js file (different hash than app-C5YYyOKf.js)" -ForegroundColor Cyan
Write-Host "  • Recent timestamp (today's date)" -ForegroundColor Cyan
Write-Host "  • resources/js/pages directory exists" -ForegroundColor Cyan
Write-Host "  • Welcome.jsx file present" -ForegroundColor Cyan
Write-Host "`nGitHub Actions: https://github.com/techapsalwar/avhira/actions`n" -ForegroundColor Magenta
