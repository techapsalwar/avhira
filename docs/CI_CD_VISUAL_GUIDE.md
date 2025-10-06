# 🚀 CI/CD Pipeline - Visual Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  👨‍💻 Developer                                                        │
│     │                                                                │
│     ├─ Make changes to code                                         │
│     ├─ Test locally (npm run dev)                                   │
│     ├─ Commit changes (git commit)                                  │
│     └─ Push to GitHub (git push origin main)                        │
│                        │                                             │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📦 BUILD STAGE (Ubuntu Runner)                                      │
│     ├─ Checkout code                                                │
│     ├─ Setup PHP 8.2 + Extensions                                   │
│     ├─ Setup Node.js 20                                             │
│     ├─ Cache Composer dependencies                                  │
│     ├─ Install Composer packages                                    │
│     ├─ Install NPM packages                                         │
│     └─ Build frontend assets (Vite)                                 │
│           │                                                          │
│           ▼                                                          │
│  📦 PACKAGE STAGE                                                    │
│     ├─ Create deployment directory                                  │
│     ├─ Exclude unnecessary files                                    │
│     └─ Compress to deploy.tar.gz                                    │
│           │                                                          │
│           ▼                                                          │
│  🚀 DEPLOY STAGE                                                     │
│     ├─ SSH to Hostinger                                             │
│     ├─ Create timestamped backup                                    │
│     ├─ Enable maintenance mode                                      │
│     ├─ Upload package via SCP                                       │
│     ├─ Extract files                                                │
│     ├─ Set permissions                                              │
│     ├─ Run migrations                                               │
│     ├─ Optimize caches                                              │
│     └─ Disable maintenance mode                                     │
│           │                                                          │
└───────────┼─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  HOSTINGER PRODUCTION                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🌐 avhira.com                                                       │
│     ├─ Laravel 12 Application                                       │
│     ├─ React 19 Frontend                                            │
│     ├─ MySQL Database                                               │
│     └─ ✅ LIVE AND READY!                                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Deployment Timeline

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   0:00       │   1:00       │   2:00       │   2:30       │   3:00       │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │              │
│ Push to      │ Build        │ Package      │ Deploy       │ ✅ LIVE      │
│ GitHub       │ Dependencies │ & Upload     │ & Optimize   │              │
│              │              │              │              │              │
│ ⚡ Trigger   │ 📦 PHP/JS    │ 🗜️ Compress  │ 🔄 Migrate   │ 🎉 Success   │
│   workflow   │   install    │   transfer   │   optimize   │   deployed   │
│              │              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
              ← First build: ~3-5 minutes (no cache) →
              ← Subsequent: ~1-2 minutes (with cache) →
```

## File Flow

```
LOCAL MACHINE                    GITHUB                    HOSTINGER
─────────────                    ──────                    ─────────

your-code/                       Repository                /home/u123456789/
├── app/                        ┌──────────┐              domains/avhira.com/
├── resources/     git push     │          │   deploy     public_html/
├── public/       ────────────► │ GitHub   │ ──────────►  ├── app/
├── routes/                     │ Actions  │              ├── public/
├── database/                   │          │              ├── storage/
├── .github/                    └──────────┘              ├── vendor/
│   └── workflows/                   │                    ├── .env
│       └── deploy.yml               │                    └── backups/
├── package.json                     │                        ├── latest/
├── composer.json                    ▼                        └── [timestamps]/
└── vite.config.ts           Build + Package
                                     │
                             ┌───────┴───────┐
                             │ deploy.tar.gz │
                             │    (~20 MB)   │
                             └───────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SSH KEY SETUP                                 │
└─────────────────────────────────────────────────────────────────────┘

1. LOCAL MACHINE                2. HOSTINGER SERVER         3. GITHUB
   ─────────────                   ─────────────────            ──────
   
   ssh-keygen                      authorized_keys             Secrets
   ├── avhira_deploy ────────────► ~/.ssh/                     ├── HOST
   │   (private key)                authorized_keys             ├── USERNAME
   │                               [public key]                 ├── SSH_KEY
   └── avhira_deploy.pub                                        │   [private key]
       (public key)          ┌─────────────────────┐           ├── PORT
                             │  Secure Connection  │           └── APP_PATH
                             │        SSH          │
                             │  🔐 Encrypted      │
                             └─────────────────────┘
```

## Backup & Rollback Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT WITH BACKUPS                           │
└─────────────────────────────────────────────────────────────────────┘

BEFORE DEPLOYMENT                DURING DEPLOYMENT        AFTER DEPLOYMENT
─────────────────                ─────────────────        ────────────────

public_html/                     public_html/             public_html/
├── app/                         ├── app/ (old)           ├── app/ (new) ✨
├── storage/                     ├── storage/             ├── storage/
├── .env                         ├── .env                 ├── .env
└── backups/                     └── backups/             └── backups/
    ├── 20250114_120000/             ├── 20250114_120000/     ├── 20250114_120000/
    └── latest/                      ├── 20250115_143022/ ⬅   ├── 20250115_143022/
                                     │   ├── .env              │   ├── .env
                                     │   └── storage_app/      │   └── storage_app/
                                     └── latest/ ────────────► └── latest/ ─┐
                                                                    (symlink) │
                                                                              ▼
                                                                  20250115_143022/

ROLLBACK IF NEEDED:
$ cp backups/latest/.env .env
$ cp -r backups/latest/storage_app/* storage/app/
$ php artisan config:clear
$ php artisan up
```

## Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS UI                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Workflow: Deploy to Hostinger                                      │
│  Status: ✅ Success                                                  │
│  Branch: main                                                        │
│  Commit: feat: Updated hero section                                 │
│  Duration: 2m 34s                                                    │
│                                                                      │
│  Jobs:                                                               │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ ✅ deploy (2m 34s)                                      │         │
│  │    ├─ ✅ Checkout Code (3s)                             │         │
│  │    ├─ ✅ Setup PHP (12s)                                │         │
│  │    ├─ ✅ Setup Node.js (8s)                             │         │
│  │    ├─ ✅ Cache Composer Dependencies (2s)               │         │
│  │    ├─ ✅ Install Composer Dependencies (24s)            │         │
│  │    ├─ ✅ Install NPM Dependencies (18s)                 │         │
│  │    ├─ ✅ Build Frontend Assets (32s)                    │         │
│  │    ├─ ✅ Create Deployment Package (5s)                 │         │
│  │    ├─ ✅ Deploy to Hostinger via SSH (8s)               │         │
│  │    ├─ ✅ Upload Deployment Package (15s)                │         │
│  │    └─ ✅ Extract and Finalize Deployment (27s)          │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Environment Comparison

```
┌──────────────────────┬─────────────────┬──────────────────────────┐
│     ENVIRONMENT      │    TRIGGER      │        DEPLOYMENT        │
├──────────────────────┼─────────────────┼──────────────────────────┤
│                      │                 │                          │
│  💻 LOCAL            │  Manual         │  npm run dev             │
│     Development      │  npm run dev    │  php artisan serve       │
│     localhost:8000   │                 │  Hot reload enabled      │
│     APP_DEBUG=true   │                 │  Source maps visible     │
│                      │                 │                          │
├──────────────────────┼─────────────────┼──────────────────────────┤
│                      │                 │                          │
│  🌐 PRODUCTION       │  git push main  │  Automatic via GitHub    │
│     avhira.com       │  or manual      │  Production build        │
│     APP_DEBUG=false  │  workflow       │  Optimized assets        │
│     HTTPS enabled    │  dispatch       │  Cached routes/views     │
│                      │                 │                          │
└──────────────────────┴─────────────────┴──────────────────────────┘
```

## Laravel Optimization Pipeline

```
DEPLOYMENT PROCESS              OPTIMIZATIONS
──────────────────              ─────────────

Extract files          ──────►  Set permissions
        │                       chmod 755 storage/
        │                       chmod 775 logs/
        ▼
Restore .env          ──────►  Verify configuration
        │                       DB credentials
        │                       APP_KEY present
        ▼
Run migrations        ──────►  Update database schema
        │                       php artisan migrate --force
        ▼
Config cache          ──────►  Cache configuration
        │                       php artisan config:cache
        ▼
Route cache           ──────►  Cache routes
        │                       php artisan route:cache
        ▼
View cache            ──────►  Compile Blade templates
        │                       php artisan view:cache
        ▼
Event cache           ──────►  Cache event listeners
        │                       php artisan event:cache
        ▼
Optimize              ──────►  General optimization
        │                       php artisan optimize
        ▼
Disable maintenance   ──────►  Site goes live
        │                       php artisan up
        ▼
    ✅ DEPLOYED!
```

## Performance Metrics

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BUILD PERFORMANCE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  First Build (No Cache)          Subsequent Builds (Cached)         │
│  ─────────────────────           ──────────────────────────         │
│                                                                      │
│  ▓▓▓▓▓▓▓▓░░░░░░░ 3-5 min        ▓▓░░░░░░░░░░░░░ 1-2 min            │
│                                                                      │
│  Breakdown:                      Breakdown:                         │
│  • Checkout: 5s                  • Checkout: 3s                     │
│  • PHP Setup: 20s                • PHP Setup: 8s                    │
│  • Node Setup: 15s               • Node Setup: 5s                   │
│  • Composer: 90s                 • Composer: 15s (cached)           │
│  • NPM: 60s                      • NPM: 10s (cached)                │
│  • Vite Build: 45s               • Vite Build: 30s                  │
│  • Package: 10s                  • Package: 5s                      │
│  • Deploy: 35s                   • Deploy: 25s                      │
│                                                                      │
│  Cache Savings: ~60-70% faster with caching! 🚀                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ERROR DETECTION                                 │
└─────────────────────────────────────────────────────────────────────┘

DEPLOYMENT STAGE                IF ERROR                   RECOVERY
────────────────                ────────                   ────────

Build Stage              ──────► Build fails      ──────►  ❌ Stop deployment
├─ Checkout                      │                         • Check logs
├─ Setup                         │                         • Fix code locally
├─ Install deps                  │                         • Push fix
└─ Build assets                  └─► No deployment         • Auto-retry

Deploy Stage             ──────► SSH fails        ──────►  ❌ Stop deployment
├─ Connect                       │                         • Check secrets
├─ Backup                        │                         • Test SSH
├─ Enable maint                  └─► No changes made       • Update keys

Migration Stage          ──────► Migration fails  ──────►  ⚠️  Partial deploy
├─ Extract files                 │                         • Rollback available
├─ Run migrate                   └─► Backup exists         • Restore .env
└─ Optimize                                                • Clear caches

Final Stage              ──────► Tests fail       ──────►  ✅ Site still works
├─ Disable maint                 │                         • Maintenance mode
└─ Deploy complete               └─► Rollback easy         • Use backups
```

## Quick Reference Commands

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMMON OPERATIONS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LOCAL DEVELOPMENT                                                   │
│  ─────────────────                                                   │
│  $ npm run dev              # Start development server              │
│  $ npm run build            # Build for production                  │
│  $ php artisan serve        # Run Laravel server                    │
│  $ php artisan migrate      # Run migrations                        │
│                                                                      │
│  DEPLOYMENT                                                          │
│  ──────────                                                          │
│  $ git push origin main     # Automatic deployment                  │
│  GitHub → Actions → Run     # Manual deployment                     │
│                                                                      │
│  SERVER MANAGEMENT (SSH)                                             │
│  ────────────────────────                                            │
│  $ ssh u123456789@avhira.com              # Connect to server       │
│  $ cd public_html                          # Navigate to app        │
│  $ tail -f storage/logs/laravel.log       # View logs               │
│  $ php artisan down                        # Enable maintenance      │
│  $ php artisan up                          # Disable maintenance     │
│  $ php artisan cache:clear                 # Clear cache            │
│  $ php artisan config:cache                # Cache config           │
│  $ ls -la backups/                         # List backups           │
│  $ cp backups/latest/.env .env             # Restore from backup    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Success Indicators

```
✅ DEPLOYMENT SUCCESSFUL WHEN:

┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  1. GitHub Actions                                                   │
│     ✅ All stages show green checkmarks                              │
│     ✅ No error messages in logs                                     │
│     ✅ Duration within expected range (1-3 minutes)                  │
│                                                                      │
│  2. Application                                                      │
│     ✅ Site loads: https://avhira.com                                │
│     ✅ No 500 errors                                                 │
│     ✅ CSS/JS assets load correctly                                  │
│     ✅ Images display properly                                       │
│     ✅ Database queries work                                         │
│                                                                      │
│  3. Server Logs                                                      │
│     ✅ No critical errors in laravel.log                             │
│     ✅ Permissions correct (755/775)                                 │
│     ✅ Backup created successfully                                   │
│     ✅ Maintenance mode disabled                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Quick Links

- **📋 Checklist**: `docs/DEPLOYMENT_CHECKLIST.md`
- **⚡ Quick Start**: `docs/DEPLOYMENT_QUICKSTART.md`
- **📖 Full Guide**: `docs/CI_CD.md`
- **🔧 Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **✅ Setup Complete**: `docs/CI_CD_SETUP_COMPLETE.md`

---

**Visual Guide Created**: January 15, 2025  
**Pipeline**: GitHub Actions → SSH → Hostinger  
**Domain**: avhira.com