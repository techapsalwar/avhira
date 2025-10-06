# MySQL Database Setup for Avhira

## Why We Changed from SQLite to MySQL

**SQLite** (old setup):
- Stores database in a single file (`database/database.sqlite`)
- Simple, no separate service needed
- Good for small projects and development
- Limited concurrent access

**MySQL** (your setup):
- Full-featured database server
- Better for production and larger projects
- Supports multiple connections
- Industry standard for web applications

---

## Understanding the Scripts

### Original Code (SQLite):
```powershell
if (-not (Test-Path database\database.sqlite)) {
    New-Item -ItemType File -Path database\database.sqlite -Force
}
```

**What it did:**
- `Test-Path database\database.sqlite` - Checks if the SQLite database **file** exists
- If not found, creates an empty file
- SQLite databases are just files on your computer

### New Code (MySQL):
```powershell
Write-Host "⚠️  Make sure MySQL is running!"
Write-Host "Database: avhira"
```

**What it does:**
- No file checking needed - MySQL runs as a service
- Instead, reminds you to start MySQL server (XAMPP/WAMP/standalone)
- Asks you to confirm the database exists before continuing

---

## Setting Up MySQL for Avhira

### Option 1: Using XAMPP (Recommended for Windows)

1. **Download & Install XAMPP**
   - Download from: https://www.apachefriends.org/
   - Install in default location (C:\xampp)

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for green "Running" status

3. **Create Database**
   - Click "Admin" next to MySQL (opens phpMyAdmin)
   - Click "New" in left sidebar
   - Database name: `avhira`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

4. **Verify Settings in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avhira
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   (Leave password empty for XAMPP default)

---

### Option 2: Using MySQL Standalone

1. **Download MySQL**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install MySQL Community Server

2. **During Installation**
   - Set root password (remember it!)
   - Choose "Use Legacy Authentication Method"
   - Enable MySQL as Windows Service

3. **Create Database**
   
   **Option A: Using MySQL Workbench (GUI)**
   - Open MySQL Workbench
   - Connect to localhost
   - Create new schema: `avhira`
   
   **Option B: Using Command Line**
   ```bash
   mysql -u root -p
   # Enter your password
   
   CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   exit;
   ```

4. **Update `.env` with Your Password**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avhira
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password_here
   ```

---

### Option 3: Using WAMP

1. **Download & Install WAMP**
   - Download from: https://www.wampserver.com/
   - Install and start WAMP (icon turns green)

2. **Create Database**
   - Click WAMP icon in system tray
   - Go to phpMyAdmin
   - Create database: `avhira`

3. **Settings** (same as XAMPP)
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avhira
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

## Running the Setup

### Step-by-Step:

1. **Start MySQL First**
   - Start XAMPP/WAMP/MySQL service
   - Verify it's running (green light in XAMPP/WAMP)

2. **Create the Database**
   ```sql
   CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Configure `.env`**
   - Copy `.env.example` to `.env`
   - Update database settings:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avhira
   DB_USERNAME=root
   DB_PASSWORD=your_password_if_any
   ```

4. **Run Setup Script**
   ```powershell
   .\setup.ps1
   ```
   - It will ask if MySQL is running → Answer: Y
   - Migrations will create all tables automatically

5. **Start Development Servers**
   ```powershell
   .\start-dev.ps1
   ```

---

## Troubleshooting

### Error: "SQLSTATE[HY000] [2002] No connection could be made"

**Problem:** MySQL is not running

**Solution:**
- Start XAMPP/WAMP
- Or start MySQL service:
  ```powershell
  net start mysql
  ```

---

### Error: "Access denied for user 'root'@'localhost'"

**Problem:** Wrong password

**Solution:**
- Check password in `.env`
- For XAMPP, password is usually empty
- For standalone MySQL, use the password you set during installation

---

### Error: "Unknown database 'avhira'"

**Problem:** Database doesn't exist

**Solution:**
```sql
CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### How to Reset Everything

1. **Drop and Recreate Database**
   ```sql
   DROP DATABASE IF EXISTS avhira;
   CREATE DATABASE avhira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run Migrations Again**
   ```bash
   php artisan migrate:fresh --seed
   ```

---

## Verifying Your Setup

### Check MySQL Connection:
```bash
php artisan migrate:status
```

Should show your migrations table.

### Test Database Connection:
```bash
php artisan tinker
```
```php
DB::connection()->getPdo();
// Should return PDO object without error
```

---

## Benefits of MySQL for Avhira

✅ **Better Performance** - Faster queries for product catalog
✅ **Concurrent Users** - Multiple customers can shop simultaneously
✅ **Production Ready** - Same database for development and live site
✅ **Better Tools** - phpMyAdmin, MySQL Workbench, etc.
✅ **Industry Standard** - Easy to find hosting and support
✅ **Scalability** - Grows with your business

---

## Quick Reference

### Common MySQL Commands:

```sql
-- Show all databases
SHOW DATABASES;

-- Use avhira database
USE avhira;

-- Show all tables
SHOW TABLES;

-- Show products
SELECT * FROM products;

-- Show table structure
DESCRIBE products;

-- Count products
SELECT COUNT(*) FROM products;
```

### Laravel Artisan Commands:

```bash
# Run migrations
php artisan migrate

# Reset database and seed
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status

# Rollback last migration
php artisan migrate:rollback

# Open tinker (Laravel console)
php artisan tinker
```

---

## Need Help?

1. Check if MySQL is running (green in XAMPP/WAMP)
2. Verify database exists in phpMyAdmin
3. Confirm `.env` settings match your MySQL setup
4. Check MySQL error logs (in XAMPP/WAMP logs folder)

---

**You're all set! MySQL is much better for your e-commerce site.** 🚀
