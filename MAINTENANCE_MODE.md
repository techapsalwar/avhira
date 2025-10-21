# Maintenance Mode Feature

## Overview
A complete maintenance mode system that allows admins to put the entire website offline for maintenance while keeping the admin panel and login functionality accessible.

## Features

### ✅ Toggle Button in Admin Dashboard
- **Location**: Admin Dashboard (top right of welcome section)
- **Visual Indicator**: Toggle switch with status text
- **States**: 
  - OFF: "Site is online" (gray)
  - ON: "Site is offline" (red)

### ✅ Custom Maintenance Message
- When enabling maintenance mode, admins can set a custom message
- Default message: "We are currently performing scheduled maintenance. Please check back soon!"
- Message is displayed to visitors on the maintenance page

### ✅ Access Control
**Blocked During Maintenance Mode:**
- All public pages (home, products, categories, cart, checkout, etc.)
- Regular users (non-admin)

**Accessible During Maintenance Mode:**
- `/admin` - Full admin panel access
- `/login` - Login functionality
- `/logout` - Logout functionality
- Admins can view the entire site normally

### ✅ Beautiful Maintenance Page
- Avhira-branded design
- Custom message display
- Contact support link
- Animated maintenance icon
- Responsive design

## Usage

### Enabling Maintenance Mode

1. **Log in as Admin**
2. **Navigate to Admin Dashboard** (`/admin`)
3. **Click the Toggle Switch** (top right)
4. **Enter Custom Message** (optional)
5. **Click "Enable"**

The site is now in maintenance mode!

### Disabling Maintenance Mode

1. **Log in as Admin** (login still works)
2. **Navigate to Admin Dashboard**
3. **Click the Toggle Switch**

The site is now back online!

### Testing as Admin

When logged in as admin, you can:
- Browse the entire site normally
- See all pages as if maintenance mode is off
- Use the admin panel to disable maintenance mode

### Testing as Regular User

When maintenance mode is ON:
- Visitors see the maintenance page
- Login page remains accessible
- After login (non-admin users), redirected to maintenance page
- Only admins can bypass maintenance mode

## Technical Details

### Files Created/Modified

#### New Files:
1. **`app/Http/Middleware/CheckMaintenanceMode.php`**
   - Middleware that checks maintenance mode status
   - Allows admin routes, login, and admins to bypass
   - Redirects everyone else to maintenance page

2. **`app/Http/Controllers/MaintenanceController.php`**
   - `show()` - Display maintenance page
   - `toggle()` - Enable/disable maintenance mode
   - `status()` - Get current maintenance status (API)

3. **`resources/js/Pages/Maintenance.jsx`**
   - Beautiful maintenance page component
   - Displays custom message
   - Avhira-branded design
   - Contact support link

#### Modified Files:
1. **`resources/js/Pages/Admin/Dashboard.jsx`**
   - Added maintenance mode toggle switch
   - Added modal for enabling with custom message
   - Added state management for toggle
   - Toast notifications for success

2. **`app/Http/Controllers/Admin/AdminController.php`**
   - Added `maintenanceMode` to Inertia props
   - Passes current status to dashboard

3. **`bootstrap/app.php`**
   - Registered `CheckMaintenanceMode` middleware
   - Applied to all web routes

4. **`routes/admin.php`**
   - Added maintenance toggle route: `POST /admin/maintenance/toggle`
   - Added status check route: `GET /admin/maintenance/status`

5. **`routes/web.php`**
   - Added maintenance page route: `GET /maintenance`

### Data Storage

Maintenance mode state is stored in **Laravel Cache**:
- `site_maintenance_mode` - boolean (enabled/disabled)
- `maintenance_message` - string (custom message)

Using `Cache::forever()` ensures persistence across requests.

### How It Works

1. **Request Flow**:
   ```
   User Request → CheckMaintenanceMode Middleware
   ↓
   Is maintenance mode ON?
   ├─ No → Continue to page
   └─ Yes → Is admin route or admin user?
           ├─ Yes → Continue to page
           └─ No → Redirect to /maintenance
   ```

2. **Admin Toggle**:
   ```
   Admin clicks toggle → POST /admin/maintenance/toggle
   ↓
   MaintenanceController::toggle()
   ↓
   Cache::forever('site_maintenance_mode', true/false)
   ↓
   Return success message
   ```

## API Endpoints

### Toggle Maintenance Mode (Admin Only)
```
POST /admin/maintenance/toggle
```

**Request Body** (optional):
```json
{
  "message": "Custom maintenance message"
}
```

**Response**:
Redirects back with success message

### Get Maintenance Status
```
GET /admin/maintenance/status
```

**Response**:
```json
{
  "enabled": true,
  "message": "We are currently performing scheduled maintenance..."
}
```

## Security

✅ **Admin-Only Access**: Only admins can toggle maintenance mode  
✅ **Protected Routes**: Admin routes are protected by `auth` and `admin` middleware  
✅ **Login Preserved**: Users can still login during maintenance  
✅ **Admin Bypass**: Admins can always access the site

## Customization

### Change Maintenance Page Design

Edit `resources/js/Pages/Maintenance.jsx`:
- Modify colors, layout, or branding
- Add company logo
- Change support email

### Change Default Message

Edit `app/Http/Controllers/MaintenanceController.php`:
```php
Cache::get('maintenance_message', 'Your custom default message here')
```

### Add Scheduled Maintenance

You can programmatically enable maintenance mode:
```php
use Illuminate\Support\Facades\Cache;

// Enable
Cache::forever('site_maintenance_mode', true);
Cache::forever('maintenance_message', 'Scheduled maintenance from 2 AM to 4 AM');

// Disable
Cache::forget('site_maintenance_mode');
Cache::forget('maintenance_message');
```

## Testing

### Test Maintenance Mode

1. **Enable as admin**:
   - Login as admin
   - Go to `/admin`
   - Toggle ON
   - Verify toast notification

2. **Test as visitor**:
   - Open incognito window
   - Go to home page
   - Should see maintenance page

3. **Test login still works**:
   - In incognito, go to `/login`
   - Login should work (redirects to maintenance if not admin)

4. **Test admin bypass**:
   - Login as admin
   - Browse entire site
   - Everything should work normally

5. **Disable**:
   - Go to `/admin`
   - Toggle OFF
   - Verify site is accessible

## Troubleshooting

### Maintenance mode stuck ON?

Clear cache manually:
```bash
php artisan cache:clear
```

Or via Tinker:
```bash
php artisan tinker
Cache::forget('site_maintenance_mode');
```

### Can't access admin panel?

The admin panel should always be accessible. Check:
1. Are you logged in as admin? (`is_admin = 1` in database)
2. Is the middleware registered correctly in `bootstrap/app.php`?
3. Try clearing cache: `php artisan cache:clear`

### Maintenance page not showing?

1. Check if middleware is registered in `bootstrap/app.php`
2. Verify route exists in `routes/web.php`
3. Clear route cache: `php artisan route:clear`

## Future Enhancements

Potential additions:
- [ ] Schedule maintenance windows
- [ ] Allow specific IPs to bypass maintenance
- [ ] Email notifications when enabling
- [ ] Countdown timer on maintenance page
- [ ] Maintenance log/history

## Support

For issues or questions:
- Email: support@avhira.com
- Check logs: `storage/logs/laravel.log`
