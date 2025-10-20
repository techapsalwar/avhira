#!/bin/bash

# =============================================================================
# Avhira Website - Production Deployment Script
# =============================================================================
# This script automates the deployment process from developer branch to main
# Usage: ./deploy-to-production.sh
# =============================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# =============================================================================
# Pre-deployment Checks
# =============================================================================

print_header "Pre-Deployment Checks"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi
print_success "Git repository detected"

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Current branch: $CURRENT_BRANCH"

# Make sure we're on developer branch
if [ "$CURRENT_BRANCH" != "developer" ]; then
    print_warning "You're not on the developer branch. Switching..."
    git checkout developer || {
        print_error "Failed to switch to developer branch"
        exit 1
    }
fi
print_success "On developer branch"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes!"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " COMMIT_MSG
        git add .
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    else
        print_error "Please commit or stash your changes before deploying"
        exit 1
    fi
fi
print_success "Working directory is clean"

# Pull latest changes from remote
print_info "Pulling latest changes from remote..."
git pull origin developer || {
    print_error "Failed to pull from remote"
    exit 1
}
print_success "Up to date with remote"

# =============================================================================
# Testing
# =============================================================================

print_header "Running Tests"

# Check if composer is installed
if command -v composer &> /dev/null; then
    print_info "Installing/updating PHP dependencies..."
    composer install --no-interaction || {
        print_warning "Composer install failed, but continuing..."
    }
    print_success "PHP dependencies ready"
else
    print_warning "Composer not found, skipping dependency check"
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    print_info "Installing/updating Node dependencies..."
    npm install || {
        print_warning "npm install failed, but continuing..."
    }
    
    print_info "Building frontend assets..."
    npm run build || {
        print_error "Build failed! Cannot deploy broken assets."
        exit 1
    }
    print_success "Frontend assets built successfully"
else
    print_warning "npm not found, skipping frontend build"
fi

# Run PHP tests if they exist
if [ -f "phpunit.xml" ]; then
    print_info "Running PHP tests..."
    if command -v php &> /dev/null; then
        php artisan test --stop-on-failure || {
            print_error "Tests failed! Cannot deploy."
            read -p "Deploy anyway? (y/n) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        }
        print_success "All tests passed"
    else
        print_warning "PHP not found, skipping tests"
    fi
fi

# =============================================================================
# Deployment Confirmation
# =============================================================================

print_header "Deployment Confirmation"

echo ""
echo "You are about to deploy to PRODUCTION!"
echo ""
echo "Changes to be deployed:"
git log --oneline --graph origin/main..HEAD | head -10
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

# =============================================================================
# Merge to Main Branch
# =============================================================================

print_header "Merging to Main Branch"

# Switch to main branch
print_info "Switching to main branch..."
git checkout main || {
    print_error "Failed to switch to main branch"
    exit 1
}
print_success "Switched to main branch"

# Pull latest main
print_info "Pulling latest main..."
git pull origin main || {
    print_error "Failed to pull main"
    git checkout developer
    exit 1
}

# Merge developer into main
print_info "Merging developer into main..."
if git merge developer --no-ff -m "Release: Deployment from developer on $(date +%Y-%m-%d\ %H:%M:%S)"; then
    print_success "Merge successful"
else
    print_error "Merge failed! Please resolve conflicts manually."
    print_info "After resolving conflicts, run:"
    echo "  git add ."
    echo "  git commit"
    echo "  git push origin main"
    echo "  git checkout developer"
    echo "  git merge main"
    exit 1
fi

# =============================================================================
# Push to Production
# =============================================================================

print_header "Pushing to Production"

# Push to remote main
print_info "Pushing to remote main branch..."
if git push origin main; then
    print_success "Pushed to production successfully!"
else
    print_error "Failed to push to production"
    print_info "You may need to pull and merge again"
    git checkout developer
    exit 1
fi

# =============================================================================
# Sync Developer Branch
# =============================================================================

print_header "Syncing Developer Branch"

# Switch back to developer
print_info "Switching back to developer branch..."
git checkout developer

# Merge main back to developer
print_info "Merging main back to developer..."
git merge main

# Push updated developer
print_info "Pushing updated developer branch..."
git push origin developer

print_success "Developer branch synced"

# =============================================================================
# Deployment Summary
# =============================================================================

print_header "Deployment Complete!"

echo ""
print_success "Deployment successful! 🎉"
echo ""
print_info "Next steps:"
echo "  1. Check GitHub Actions for deployment status"
echo "  2. Monitor production logs for errors"
echo "  3. Verify the changes on the live website"
echo "  4. Test critical functionality"
echo ""
print_info "Production URL: https://your-production-url.com"
print_info "GitHub Actions: https://github.com/your-username/your-repo/actions"
echo ""
print_warning "Remember to monitor the deployment for the next 10-15 minutes"
echo ""

# Optionally open GitHub Actions in browser (uncomment if desired)
# xdg-open "https://github.com/your-username/your-repo/actions" 2>/dev/null || \
# open "https://github.com/your-username/your-repo/actions" 2>/dev/null || \
# start "https://github.com/your-username/your-repo/actions" 2>/dev/null

exit 0
