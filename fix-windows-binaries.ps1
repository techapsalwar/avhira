# Fix Windows Native Binaries for npm
# This script fixes the npm bug (issue #4828) where optional dependencies 
# don't install correctly on Windows with Node.js v24+

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Windows Native Binaries" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "Installing Windows-specific native binaries..." -ForegroundColor Yellow
Write-Host ""

# 1. Install Rollup Windows Binary
Write-Host "[1/3] Installing @rollup/rollup-win32-x64-msvc..." -ForegroundColor Green
try {
    New-Item -ItemType Directory -Force -Path "node_modules\@rollup\rollup-win32-x64-msvc" | Out-Null
    Invoke-WebRequest -Uri "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.30.1.tgz" -OutFile "rollup-temp.tgz" -ErrorAction Stop
    tar -xzf rollup-temp.tgz -C node_modules\@rollup\rollup-win32-x64-msvc --strip-components=1
    Remove-Item rollup-temp.tgz
    Write-Host "  ✓ Rollup binary installed successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to install Rollup binary: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Install LightningCSS Windows Binary
Write-Host "[2/3] Installing lightningcss-win32-x64-msvc..." -ForegroundColor Green
try {
    New-Item -ItemType Directory -Force -Path "node_modules\lightningcss-win32-x64-msvc" | Out-Null
    Invoke-WebRequest -Uri "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.29.1.tgz" -OutFile "lightning-temp.tgz" -ErrorAction Stop
    tar -xzf lightning-temp.tgz -C node_modules\lightningcss-win32-x64-msvc --strip-components=1
    Remove-Item lightning-temp.tgz
    Write-Host "  ✓ LightningCSS binary installed successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to install LightningCSS binary: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. Install TailwindCSS Oxide Windows Binary
Write-Host "[3/3] Installing @tailwindcss/oxide-win32-x64-msvc..." -ForegroundColor Green
try {
    New-Item -ItemType Directory -Force -Path "node_modules\@tailwindcss\oxide-win32-x64-msvc" | Out-Null
    Invoke-WebRequest -Uri "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.1.14.tgz" -OutFile "tailwind-temp.tgz" -ErrorAction Stop
    tar -xzf tailwind-temp.tgz -C node_modules\@tailwindcss\oxide-win32-x64-msvc --strip-components=1
    Remove-Item tailwind-temp.tgz
    Write-Host "  ✓ TailwindCSS Oxide binary installed successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to install TailwindCSS Oxide binary: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ All binaries installed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run: npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: This fix is only for Windows development." -ForegroundColor Gray
Write-Host "Production deployments on Linux are unaffected." -ForegroundColor Gray
Write-Host ""
