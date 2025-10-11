# GitHub Actions Auto-Deployment Setup Guide

## Overview
Your existing `deploy.yml` has been updated to support BOTH staging and production deployment:
- **Push to `staging` branch** → Deploys to staging.avhira.com
- **Push to `main` branch** → Deploys to avhira.com (already working)

## What Changed
The workflow now automatically detects which branch you're pushing to and uses the appropriate secrets and paths.

## Required GitHub Secrets

You already have these secrets for production (they're working):
- ✅ `HOSTINGER_HOST`
- ✅ `HOSTINGER_USERNAME`
- ✅ `HOSTINGER_SSH_KEY`
- ✅ `HOSTINGER_PORT`

Now you need to add **4 new secrets** for staging:

### Add Staging Secrets

1. Go to: https://github.com/techapsalwar/avhira/settings/secrets/actions
2. Click **"New repository secret"**
3. Add each secret below:

```
Name: STAGING_HOST
Value: [Same as HOSTINGER_HOST - your Hostinger SSH host]

Name: STAGING_USERNAME  
Value: [Same as HOSTINGER_USERNAME - usually u885878505]

Name: STAGING_SSH_KEY
Value: [Same as HOSTINGER_SSH_KEY - your SSH private key]

Name: STAGING_PORT
Value: [Same as HOSTINGER_PORT - usually 65002]
```

**Note**: Since both staging and production are on the same Hostinger account, the credentials will be identical. The workflow uses different paths to deploy to different domains.

## Server Paths (Already Configured)

### Production (main branch):
- Laravel: `/home/u885878505/domains/avhira.com/avhira`
- Web Root: `/home/u885878505/domains/avhira.com/public_html`

### Staging (staging branch):
- Laravel: `/home/u885878505/domains/staging.avhira.com/avhira`
- Web Root: `/home/u885878505/domains/staging.avhira.com/public_html`

## How It Works

1. **Detect Branch**: Workflow checks if you're pushing to `main` or `staging`
2. **Set Variables**: Uses appropriate secrets and paths for that environment
3. **Build**: Installs dependencies and builds assets
4. **Deploy**: Deploys to the correct server path
5. **Notify**: Shows which environment was deployed

## Test the Setup

### Step 1: Commit the Updated Workflow
```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add staging deployment support to workflow"
git push origin staging
```

### Step 2: Watch the Deployment
1. Go to: https://github.com/techapsalwar/avhira/actions
2. You'll see "Deploy to Hostinger" running
3. Click on it to watch the progress
4. It should deploy to staging.avhira.com

### Step 3: Verify
Visit https://staging.avhira.com to see your changes live!

## Troubleshooting

### If deployment fails with "Permission denied":
- The staging secrets might be missing or incorrect
- Verify all 4 staging secrets are added in GitHub

### If it deploys to wrong location:
- Check that the paths in the workflow match your Hostinger structure
- Run `ls -la /home/u885878505/domains/` on your server to verify paths

### To check server paths:
```bash
# SSH into your server (using the same credentials)
ssh -p 65002 u885878505@[your-host]

# List domains
ls -la /home/u885878505/domains/

# You should see:
# avhira.com/
# staging.avhira.com/
```

## Current Status

✅ Production deployment working (main branch)
⏳ Staging deployment configured (waiting for secrets)
📝 Workflow file updated

## Next Steps

1. ✅ Add the 4 staging secrets to GitHub
2. ✅ Commit and push the updated workflow
3. ✅ Test by pushing to staging branch
4. ✅ Verify at staging.avhira.com

## Workflow Summary

```yaml
Push to staging → Uses STAGING_* secrets → Deploys to staging.avhira.com
Push to main → Uses HOSTINGER_* secrets → Deploys to avhira.com
```

Simple and automated! 🚀

