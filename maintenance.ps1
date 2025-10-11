# Maintenance Mode Helper Script
# Usage: .\maintenance.ps1 -Action [enable|disable|status]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('enable', 'disable', 'status')]
    [string]$Action,
    
    [string]$Message = "We are performing scheduled maintenance",
    [int]$Retry = 300,
    [string]$Secret = ""
)

# Configuration
$SSH_KEY = "$HOME\.ssh\avhira_deploy_rsa"
$SSH_PORT = "65002"
$SSH_USER = "u885878505"
$SSH_HOST = "89.117.188.174"
$LARAVEL_PATH = "/home/u885878505/domains/avhira.com/avhira"

Write-Host "`n=== Avhira Maintenance Mode Manager ===" -ForegroundColor Cyan

if ($Action -eq 'enable') {
    Write-Host "`nEnabling Maintenance Mode..." -ForegroundColor Yellow
    
    $cmd = "cd $LARAVEL_PATH; php artisan down"
    
    if ($Message) {
        $escapedMsg = $Message -replace "'", "'"
        $cmd += " --message='$escapedMsg'"
    }
    
    if ($Retry -gt 0) {
        $cmd += " --retry=$Retry"
    }
    
    if ($Secret) {
        $cmd += " --secret='$Secret'"
    }
    
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
    
    Write-Host "`nMaintenance mode enabled!" -ForegroundColor Green
    if ($Secret) {
        Write-Host "Bypass URL: https://avhira.com/$Secret" -ForegroundColor Cyan
    }
    Write-Host "Retry after: $Retry seconds" -ForegroundColor Gray
}
elseif ($Action -eq 'disable') {
    Write-Host "`nDisabling Maintenance Mode..." -ForegroundColor Green
    
    $cmd = "cd $LARAVEL_PATH; php artisan up"
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
    
    Write-Host "`nSite is back online at https://avhira.com" -ForegroundColor Green
}
elseif ($Action -eq 'status') {
    Write-Host "`nChecking Maintenance Status..." -ForegroundColor Cyan
    
    $cmd = "cd $LARAVEL_PATH; if [ -f storage/framework/down ]; then echo 'MAINTENANCE MODE: ENABLED'; cat storage/framework/down; else echo 'MAINTENANCE MODE: DISABLED - Site is live'; fi"
    ssh -i $SSH_KEY -p $SSH_PORT "$SSH_USER@$SSH_HOST" $cmd
}

Write-Host ""
