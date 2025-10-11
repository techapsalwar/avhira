# 🛠️ Maintenance Mode Helper Script

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('enable', 'disable', 'status')]
    [string]$Action,
    
    [string]$Message = "We're performing scheduled maintenance. We'll be back soon!",
    [int]$Retry = 300,
    [string]$Secret = ""
)

# Configuration
$SSH_KEY = "$HOME\.ssh\avhira_deploy_rsa"
$SSH_PORT = "65002"
$SSH_USER = "u885878505"
$SSH_HOST = "89.117.188.174"
$LARAVEL_PATH = "/home/u885878505/domains/avhira.com/avhira"

function Enable-Maintenance {
    Write-Host "`n🛠️  Enabling Maintenance Mode..." -ForegroundColor Yellow
    
    $cmd = "cd $LARAVEL_PATH && php artisan down"
    
    if ($Message) {
        $cmd += " --message='$Message'"
    }
    
    if ($Retry -gt 0) {
        $cmd += " --retry=$Retry"
    }
    
    if ($Secret) {
        $cmd += " --secret='$Secret'"
    }
    
    $cmd += " && echo '✅ Maintenance mode enabled'"
    
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
    
    if ($Secret) {
        Write-Host "`n🔑 Bypass URL: https://avhira.com/$Secret" -ForegroundColor Green
    }
    
    Write-Host "🌐 Site is now showing maintenance page" -ForegroundColor Cyan
    Write-Host "⏱️  Retry after: $Retry seconds" -ForegroundColor Gray
}

function Disable-Maintenance {
    Write-Host "`n✅ Disabling Maintenance Mode..." -ForegroundColor Green
    
    $cmd = @"
cd $LARAVEL_PATH
php artisan up
echo '✅ Maintenance mode disabled'
echo '🌐 Site is now live!'
"@
    
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
    
    Write-Host "`n🎉 Site is back online at https://avhira.com" -ForegroundColor Green
}

function Get-MaintenanceStatus {
    Write-Host "`n🔍 Checking Maintenance Status..." -ForegroundColor Cyan
    
    $cmd = @"
cd $LARAVEL_PATH
if [ -f storage/framework/down ]; then
    echo '🛠️  MAINTENANCE MODE: ENABLED'
    echo ''
    echo 'Maintenance file details:'
    cat storage/framework/down | python3 -m json.tool 2>/dev/null || cat storage/framework/down
else
    echo '✅ MAINTENANCE MODE: DISABLED'
    echo '🌐 Site is live and operational'
fi
"@
    
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
}

# Main execution
Write-Host "`n=== Avhira Maintenance Mode Manager ===" -ForegroundColor Cyan

switch ($Action) {
    'enable' { Enable-Maintenance }
    'disable' { Disable-Maintenance }
    'status' { Get-MaintenanceStatus }
}

Write-Host ""

# Usage examples
if ($Action -eq 'enable') {
    Write-Host "`nQuick Commands:" -ForegroundColor Yellow
    Write-Host "  Disable: .\maintenance-mode.ps1 -Action disable" -ForegroundColor Gray
    Write-Host "  Status:  .\maintenance-mode.ps1 -Action status" -ForegroundColor Gray
}
