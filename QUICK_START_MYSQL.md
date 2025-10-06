# 🚀 Avhira Quick Start with MySQL

## Before You Begin

✅ **Install XAMPP or MySQL**
✅ **Start MySQL Service**
✅ **Create Database: `avhira`**

---

## First Time Setup

```powershell
# 1. Create MySQL database first!
# Open phpMyAdmin or MySQL Workbench and run:
CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. Run setup script
.\setup.ps1
# When asked "Is MySQL running?" → Type: Y

# 3. Done! Now start dev servers
.\start-dev.ps1
```

---

## Your Database Settings

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=avhira
DB_USERNAME=root
DB_PASSWORD=          <-- Leave empty for XAMPP, or add your MySQL password
```

---

## What Changed from SQLite?

### OLD (SQLite):
```powershell
# Created a file: database/database.sqlite
Test-Path database\database.sqlite
```
- ❌ Database = single file
- ❌ Limited features
- ❌ Not production-ready

### NEW (MySQL):
```powershell
# Connects to MySQL server (XAMPP/WAMP)
# Database = MySQL service running on your PC
```
- ✅ Full database server
- ✅ Better performance
- ✅ Production-ready
- ✅ Industry standard

---

## Why The Check?

**SQLite Version** (`Test-Path database\database.sqlite`):
- Checked if database **file** existed
- Created file if missing
- Because SQLite = just a file

**MySQL Version** (new code):
- No file to check!
- MySQL runs as a **service** (like Apache)
- Database exists **inside** MySQL server
- We remind you to start MySQL instead

---

## Troubleshooting

### ❌ "No connection could be made"
**Fix:** Start XAMPP/WAMP - Make sure MySQL is running (green light)

### ❌ "Unknown database 'avhira'"
**Fix:** Create the database first:
```sql
CREATE DATABASE avhira;
```

### ❌ "Access denied"
**Fix:** Check password in `.env` file
- XAMPP default: no password (leave empty)
- MySQL standalone: use your password

---

## Daily Workflow

```powershell
# 1. Start MySQL (XAMPP/WAMP)
# 2. Run servers
.\start-dev.ps1

# 3. Visit
http://localhost:8000

# 4. When done, stop XAMPP/WAMP
```

---

## Need Full Details?

📖 Read: `MYSQL_SETUP.md` for complete guide

---

**Remember:** MySQL must be running BEFORE you start the app! 💡
