# Avhira Admin Panel

A powerful and intuitive admin panel for managing your Avhira clothing e-commerce store.

## 🎯 Features

### Dashboard
- **Revenue Analytics**: 7-day revenue chart with trend analysis
- **Key Metrics**: Total revenue, orders, products, and customers
- **Top Selling Products**: Track your best performers
- **Recent Orders**: Quick view of latest transactions
- **Category Sales**: Visual breakdown of sales by category
- **Low Stock Alerts**: Get notified about products running low
- **Quick Actions**: Fast access to common tasks

### Product Management
- ✅ Create, edit, and delete products
- ✅ Multiple image upload (3-4 images per product)
- ✅ Video URL support for product demonstrations
- ✅ Size management (M, L, XL, XXL)
- ✅ Stock quantity tracking with low stock warnings
- ✅ Sale price support with discount display
- ✅ Featured products toggle
- ✅ SKU management
- ✅ Advanced search and filtering
  - Search by name, description, or SKU
  - Filter by category
  - Filter by stock status (low, out, in stock)
  - Filter by featured status
- ✅ Pagination for large catalogs

### Category Management
- ✅ Create, edit, and delete categories
- ✅ Product count per category
- ✅ Slug auto-generation
- ✅ Search functionality
- ✅ Protection against deleting categories with products

### Order Management
- ✅ View all orders with detailed information
- ✅ Order status tracking (pending, processing, shipped, delivered, cancelled)
- ✅ Status update functionality
- ✅ Order details with customer information
- ✅ Order items breakdown
- ✅ Tracking number management
- ✅ Advanced filtering
  - Search by order ID, customer name/email
  - Filter by status
  - Filter by date range
- ✅ Status counts dashboard
- ✅ Invoice generation (placeholder)

### User Management
- ✅ View all customers and admins
- ✅ Create new users
- ✅ Edit user details
- ✅ Admin role assignment
- ✅ Password management
- ✅ Search by name or email
- ✅ Filter by role (admin/user)
- ✅ Delete users with protection

## 🎨 Design Features

- **Avhira Brand Colors**: Consistent use of #be1e2d (primary) and #faf5f6 (background)
- **Modern UI**: Clean, rounded corners, shadows, and smooth transitions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Intuitive Navigation**: Sidebar with icon-based menu
- **Visual Feedback**: Hover effects, loading states, and success/error messages
- **Data Visualization**: Charts and progress bars for analytics

## 🔐 Access Control

### Admin Middleware
The admin panel is protected by middleware that checks:
- User must be authenticated
- User must have `is_admin = true` in database

### Creating an Admin User

#### Method 1: Using Database Seeder
Add to `database/seeders/DatabaseSeeder.php`:

```php
User::create([
    'name' => 'Admin User',
    'email' => 'admin@avhira.com',
    'password' => Hash::make('password'),
    'is_admin' => true,
]);
```

Then run: `php artisan db:seed`

#### Method 2: Using Tinker
```bash
php artisan tinker
```

Then run:
```php
$user = App\Models\User::find(1); // Replace 1 with your user ID
$user->is_admin = true;
$user->save();
```

#### Method 3: Direct Database
```sql
UPDATE users SET is_admin = 1 WHERE id = 1;
```

## 📁 File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Admin/
│   │       ├── AdminController.php          # Dashboard with analytics
│   │       ├── AdminCategoryController.php  # Category CRUD
│   │       ├── AdminProductController.php   # Product CRUD with images
│   │       ├── AdminOrderController.php     # Order management
│   │       └── AdminUserController.php      # User management
│   └── Middleware/
│       └── AdminMiddleware.php              # Admin access control
│
resources/
└── js/
    ├── Layouts/
    │   └── AdminLayout.jsx                  # Admin panel layout
    └── Pages/
        └── Admin/
            ├── Dashboard.jsx                # Analytics dashboard
            ├── Categories/
            │   ├── Index.jsx                # Category list
            │   ├── Create.jsx               # Add category
            │   └── Edit.jsx                 # Edit category
            ├── Products/
            │   ├── Index.jsx                # Product list with filters
            │   ├── Create.jsx               # Add product
            │   ├── Edit.jsx                 # Edit product
            │   └── Show.jsx                 # View product
            ├── Orders/
            │   ├── Index.jsx                # Order list with filters
            │   ├── Show.jsx                 # Order details
            │   └── Invoice.jsx              # Invoice generation
            └── Users/
                ├── Index.jsx                # User list
                ├── Create.jsx               # Add user
                └── Edit.jsx                 # Edit user
```

## 🚀 Getting Started

### 1. Run Migrations
```bash
php artisan migrate
```

This will add the `is_admin` column to the users table.

### 2. Create an Admin User
Use one of the methods above to create your first admin user.

### 3. Access Admin Panel
Navigate to: `http://your-domain.com/admin`

Login with your admin credentials.

## 🎯 Admin Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/admin` | Dashboard |
| GET | `/admin/categories` | List categories |
| GET | `/admin/categories/create` | Create category form |
| POST | `/admin/categories` | Store new category |
| GET | `/admin/categories/{id}/edit` | Edit category form |
| PUT | `/admin/categories/{id}` | Update category |
| DELETE | `/admin/categories/{id}` | Delete category |
| GET | `/admin/products` | List products |
| GET | `/admin/products/create` | Create product form |
| POST | `/admin/products` | Store new product |
| GET | `/admin/products/{id}` | View product |
| GET | `/admin/products/{id}/edit` | Edit product form |
| PUT | `/admin/products/{id}` | Update product |
| DELETE | `/admin/products/{id}` | Delete product |
| GET | `/admin/orders` | List orders |
| GET | `/admin/orders/{id}` | View order details |
| PATCH | `/admin/orders/{id}/status` | Update order status |
| GET | `/admin/users` | List users |
| GET | `/admin/users/create` | Create user form |
| POST | `/admin/users` | Store new user |
| GET | `/admin/users/{id}/edit` | Edit user form |
| PUT | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Delete user |

## 📊 Dashboard Metrics

### Revenue Data
- 7-day revenue chart
- Day-over-day trend analysis
- Total revenue calculation (excludes cancelled orders)

### Sales Analytics
- Top 5 best-selling products
- Category-wise sales breakdown
- Visual progress bars for comparison

### Order Tracking
- Total orders count
- Pending orders badge
- Processing orders count
- Recent 10 orders with quick links

### Inventory Alerts
- Low stock products count (< 10 units)
- Total products count
- Category count

## 🛠 Customization

### Changing Brand Colors
Update colors in AdminLayout.jsx and Dashboard.jsx:
- Primary: `#be1e2d`
- Background: `#faf5f6`
- Dark variant: `#9a1824`

### Adding New Admin Pages
1. Create controller in `app/Http/Controllers/Admin/`
2. Add routes in `routes/admin.php`
3. Create React component in `resources/js/Pages/Admin/`
4. Update AdminLayout navigation if needed

## 🔒 Security Features

- ✅ Admin middleware protection
- ✅ CSRF token validation
- ✅ Password hashing
- ✅ Self-deletion prevention
- ✅ Category deletion protection (if has products)
- ✅ Input validation on all forms
- ✅ Unique constraints (SKU, email, category names)

## 📱 Mobile Responsive

The admin panel is fully responsive with:
- Collapsible sidebar on mobile
- Touch-friendly buttons and inputs
- Responsive tables with horizontal scroll
- Mobile-optimized navigation

## 🎨 UI Components

### Buttons
- Primary action buttons (Avhira red)
- Secondary action buttons (outlined)
- Delete buttons (red)
- Hover effects with color transitions

### Tables
- Sortable columns
- Filterable data
- Pagination
- Hover highlighting
- Mobile responsive

### Forms
- Validation feedback
- File upload with preview
- Multi-select for sizes
- Rich text editors (ready for integration)

### Cards
- Stat cards with icons
- Chart cards
- List cards
- Quick action cards

## 🚀 Performance Tips

1. **Image Optimization**: Compress product images before upload
2. **Pagination**: Keep page size at 10-15 items for best performance
3. **Search**: Use indexed columns (name, email, SKU)
4. **Caching**: Consider adding Redis for dashboard stats

## 📄 License

This admin panel is part of the Avhira e-commerce platform.

---

**Need Help?** The admin panel is designed to be intuitive, but if you need assistance, check the inline help text or contact support.
