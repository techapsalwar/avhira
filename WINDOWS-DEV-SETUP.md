# Windows Development Setup Issue

## Problem
npm has a known bug ([issue #4828](https://github.com/npm/cli/issues/4828)) where optional dependencies don't install correctly on Windows, especially with newer Node.js versions (v24+).

This affects three Windows-specific native binaries required for development:
- `@rollup/rollup-win32-x64-msvc` - For Vite bundling
- `lightningcss-win32-x64-msvc` - For CSS processing
- `@tailwindcss/oxide-win32-x64-msvc` - For TailwindCSS compilation

## Solution

### Quick Fix (Recommended)
Run the provided PowerShell script from your project root:

```powershell
.\fix-windows-binaries.ps1
```

### Manual Fix
If you prefer to install manually, run these commands in PowerShell:

```powershell
# Rollup
New-Item -ItemType Directory -Force -Path "node_modules\@rollup\rollup-win32-x64-msvc" | Out-Null
Invoke-WebRequest -Uri "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.30.1.tgz" -OutFile "rollup-temp.tgz"
tar -xzf rollup-temp.tgz -C node_modules\@rollup\rollup-win32-x64-msvc --strip-components=1
Remove-Item rollup-temp.tgz

# LightningCSS
New-Item -ItemType Directory -Force -Path "node_modules\lightningcss-win32-x64-msvc" | Out-Null
Invoke-WebRequest -Uri "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.29.1.tgz" -OutFile "lightning-temp.tgz"
tar -xzf lightning-temp.tgz -C node_modules\lightningcss-win32-x64-msvc --strip-components=1
Remove-Item lightning-temp.tgz

# TailwindCSS
New-Item -ItemType Directory -Force -Path "node_modules\@tailwindcss\oxide-win32-x64-msvc" | Out-Null
Invoke-WebRequest -Uri "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.1.14.tgz" -OutFile "tailwind-temp.tgz"
tar -xzf tailwind-temp.tgz -C node_modules\@tailwindcss\oxide-win32-x64-msvc --strip-components=1
Remove-Item tailwind-temp.tgz
```

## When to Use This Fix

Run the fix script **after**:
- Fresh `npm install`
- Running `npm install` after deleting `node_modules`
- Any time you see this error:
  ```
  Error: Cannot find module @rollup/rollup-win32-x64-msvc
  ```

## Important Notes

### ✅ This is ONLY for Windows Development
- This issue **only affects Windows** machines during local development
- **Production deployments are NOT affected** - they run on Linux where npm works correctly
- You don't need to commit any changes or modify your codebase

### 🔧 Your Development Environment
- **Node.js:** v24.6.0
- **npm:** Affected by optional dependency bug
- **OS:** Windows

### 🚀 Production Environment
- **OS:** Linux (GitHub Actions)
- **npm:** Works correctly, no manual fixes needed
- **Deployment:** Fully automated, no intervention required

## Error Message You Might See

```
Error: Cannot find module @rollup/rollup-win32-x64-msvc. 
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). 
Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

**Don't delete package-lock.json or node_modules!** That won't help due to the npm bug. Just run the fix script instead.

## Workflow

```powershell
# 1. Install dependencies (will fail to install Windows binaries)
npm install

# 2. Fix Windows binaries
.\fix-windows-binaries.ps1

# 3. Start development server
npm run dev
```

## Support

If you continue to experience issues:
1. Ensure you're running PowerShell (not CMD)
2. Check your Node.js version: `node --version`
3. Verify you're in the project root directory
4. Try closing VS Code and reopening it after running the fix

## Links
- [npm Issue #4828](https://github.com/npm/cli/issues/4828)
- [Rollup Documentation](https://rollupjs.org/)
- [Vite Documentation](https://vitejs.dev/)
