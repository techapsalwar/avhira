# Avhira CI/CD Deployment Setup Script
# This script helps configure GitHub Secrets and test SSH connection

Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AVHIRA CI/CD DEPLOYMENT SETUP" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Configuration
$HOSTINGER_HOST = "89.117.188.174"
$HOSTINGER_USERNAME = "u885878505"
$HOSTINGER_PORT = "65002"
$HOSTINGER_APP_PATH = "/home/u885878505/domains/avhira.com/public_html"
$SSH_KEY_PATH = "$HOME\.ssh\avhira_deploy"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $HOSTINGER_HOST" -ForegroundColor White
Write-Host "  Username: $HOSTINGER_USERNAME" -ForegroundColor White
Write-Host "  Port: $HOSTINGER_PORT" -ForegroundColor White
Write-Host "  App Path: $HOSTINGER_APP_PATH" -ForegroundColor White
Write-Host "  SSH Key: $SSH_KEY_PATH" -ForegroundColor White
Write-Host "`n"

# Step 1: Display Public Key
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: PUBLIC KEY FOR HOSTINGER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

if (Test-Path "$SSH_KEY_PATH.pub") {
    Write-Host "Public Key (copy this to Hostinger):" -ForegroundColor Green
    Write-Host "`n"
    Get-Content "$SSH_KEY_PATH.pub"
    Write-Host "`n"
    Write-Host "Instructions:" -ForegroundColor Yellow
    Write-Host "1. Login to Hostinger Control Panel" -ForegroundColor White
    Write-Host "2. Go to: Advanced → SSH Access" -ForegroundColor White
    Write-Host "3. Click 'Manage SSH Keys'" -ForegroundColor White
    Write-Host "4. Add the public key above" -ForegroundColor White
    Write-Host "`n"
    $response = Read-Host "Have you added the public key to Hostinger? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "`nPlease add the public key first, then run this script again." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "SSH key not found at $SSH_KEY_PATH" -ForegroundColor Red
    Write-Host "Please run the key generation first." -ForegroundColor Yellow
    exit
}

# Step 2: Test SSH Connection
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 2: TESTING SSH CONNECTION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Testing connection to Hostinger..." -ForegroundColor White
$testCommand = "ssh -i `"$SSH_KEY_PATH`" -p $HOSTINGER_PORT -o StrictHostKeyChecking=no -o ConnectTimeout=10 $HOSTINGER_USERNAME@$HOSTINGER_HOST 'echo Connection successful!'"

try {
    $result = Invoke-Expression $testCommand 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ SSH Connection successful!" -ForegroundColor Green
        Write-Host "`n"
    } else {
        Write-Host "✗ SSH Connection failed!" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
        Write-Host "`nPlease check:" -ForegroundColor Yellow
        Write-Host "1. Public key is added to Hostinger" -ForegroundColor White
        Write-Host "2. SSH access is enabled" -ForegroundColor White
        Write-Host "3. Host/Port/Username are correct" -ForegroundColor White
        exit
    }
} catch {
    Write-Host "✗ SSH Connection failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit
}

# Step 3: Display Private Key for GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: GITHUB SECRETS CONFIGURATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Go to GitHub Repository:" -ForegroundColor Yellow
Write-Host "https://github.com/techapsalwar/avhira/settings/secrets/actions" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Add the following 5 secrets:" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "1. HOSTINGER_HOST" -ForegroundColor Green
Write-Host "   Value: $HOSTINGER_HOST" -ForegroundColor White
Write-Host "`n"

Write-Host "2. HOSTINGER_USERNAME" -ForegroundColor Green
Write-Host "   Value: $HOSTINGER_USERNAME" -ForegroundColor White
Write-Host "`n"

Write-Host "3. HOSTINGER_PORT" -ForegroundColor Green
Write-Host "   Value: $HOSTINGER_PORT" -ForegroundColor White
Write-Host "`n"

Write-Host "4. HOSTINGER_APP_PATH" -ForegroundColor Green
Write-Host "   Value: $HOSTINGER_APP_PATH" -ForegroundColor White
Write-Host "`n"

Write-Host "5. HOSTINGER_SSH_KEY" -ForegroundColor Green
Write-Host "   Value (PRIVATE KEY - copy ALL lines including BEGIN/END):" -ForegroundColor White
Write-Host "`n--- BEGIN PRIVATE KEY ---" -ForegroundColor DarkGray
Get-Content "$SSH_KEY_PATH"
Write-Host "--- END PRIVATE KEY ---`n" -ForegroundColor DarkGray

Write-Host "`n"
Write-Host "Copy the private key above (including BEGIN/END lines)" -ForegroundColor Yellow
Write-Host "`n"

# Copy private key to clipboard
Get-Content "$SSH_KEY_PATH" | Set-Clipboard
Write-Host "✓ Private key copied to clipboard!" -ForegroundColor Green
Write-Host "`n"

$response = Read-Host "Have you added all 5 secrets to GitHub? (yes/no)"
if ($response -ne "yes") {
    Write-Host "`nPlease add the secrets, then continue with deployment." -ForegroundColor Yellow
    exit
}

# Step 4: Deployment Instructions
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: READY TO DEPLOY!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push workflow file:" -ForegroundColor White
Write-Host "   git add .github/workflows/deploy.yml" -ForegroundColor Gray
Write-Host "   git commit -m 'feat: Add CI/CD deployment pipeline'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host "`n"
Write-Host "2. Monitor deployment at:" -ForegroundColor White
Write-Host "   https://github.com/techapsalwar/avhira/actions" -ForegroundColor Cyan
Write-Host "`n"
Write-Host "3. After deployment, configure document root in Hostinger:" -ForegroundColor White
Write-Host "   Set to: $HOSTINGER_APP_PATH/public" -ForegroundColor Gray
Write-Host "`n"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"
