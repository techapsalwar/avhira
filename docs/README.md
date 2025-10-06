# 📚 Avhira Documentation

Welcome to the Avhira documentation! This directory contains all technical documentation for the project.

## 📖 Table of Contents

### Getting Started
- **[Getting Started Guide](../GETTING_STARTED.md)** - Quick start guide for new developers
- **[Quick Start MySQL](../QUICK_START_MYSQL.md)** - MySQL-specific setup instructions
- **[Admin Panel Quick Start](../ADMIN_PANEL_QUICK_START.md)** - Quick setup for admin features

### Core Documentation
- **[Project Overview](PROJECT_OVERVIEW.md)** - High-level project architecture and overview
- **[Database Setup](DATABASE.md)** - MySQL/SQLite setup and configuration
- **[Authentication System](AUTHENTICATION.md)** - User authentication, registration, and 2FA
- **[Admin Panel](ADMIN_PANEL.md)** - Admin dashboard and management features
- **[Checkout System](CHECKOUT.md)** - Complete checkout flow and payment integration

### Operations & Deployment
- **[🚀 Deployment Quick Start](DEPLOYMENT_QUICKSTART.md)** - ⚡ 5-minute deployment setup (START HERE!)
- **[📋 Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment verification
- **[📊 CI/CD Visual Guide](CI_CD_VISUAL_GUIDE.md)** - Architecture diagrams and flow charts
- **[📖 CI/CD Pipeline](CI_CD.md)** - Complete GitHub Actions + Hostinger deployment guide
- **[✅ CI/CD Setup Complete](CI_CD_SETUP_COMPLETE.md)** - What was built and how it works
- **[🏗️ Deployment Guide](DEPLOYMENT.md)** - General production deployment instructions
- **[🔧 Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

## 🚀 Quick Links

### For New Developers
1. Start with [Getting Started Guide](../GETTING_STARTED.md)
2. Set up database: [Database Setup](DATABASE.md)
3. Run the application locally

### For Administrators
1. [Admin Panel Quick Start](../ADMIN_PANEL_QUICK_START.md)
2. [Admin Panel Full Guide](ADMIN_PANEL.md)

### For DevOps
1. **[🚀 Deployment Quick Start](DEPLOYMENT_QUICKSTART.md)** - Start here! 5-minute setup
2. **[📋 Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Verify each step
3. **[📊 CI/CD Visual Guide](CI_CD_VISUAL_GUIDE.md)** - Understand the flow
4. **[📖 CI/CD Pipeline](CI_CD.md)** - Complete reference guide
5. **[🔧 Troubleshooting](TROUBLESHOOTING.md)** - Fix common issues

## 📁 Project Structure

```
avhira/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # Controllers
│   ├── Models/             # Eloquent models
│   └── Providers/          # Service providers
├── config/                 # Configuration files
├── database/               # Migrations, seeders, factories
├── docs/                   # 📚 Documentation (you are here)
├── public/                 # Public assets
├── resources/              # Views, JS, CSS
│   ├── js/                 # React components
│   └── views/              # Blade templates
├── routes/                 # Route definitions
├── storage/                # File storage
└── tests/                  # Unit and feature tests
```

## 🔧 Technology Stack

- **Backend**: Laravel 12
- **Frontend**: React 19 with Inertia.js
- **Styling**: Tailwind CSS v4
- **Database**: MySQL / SQLite
- **Payment**: Razorpay
- **Authentication**: Laravel Fortify with 2FA

## 📝 Documentation Standards

When contributing to documentation:
- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep documentation up-to-date
- Use markdown formatting

## 🆘 Need Help?

- Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- Review specific feature documentation above
- Check main [README](../README.md)

## 📧 Support

For additional support or questions:
- Create an issue on GitHub
- Contact the development team

---

**Last Updated**: October 7, 2025
**Project**: Avhira - Premium Clothing Brand E-commerce Platform
