# AVHIRA - Premium Clothing E-commerce Website

A modern, feature-rich e-commerce website built with Laravel 12 and React for the Avhira clothing brand.

## Features

### 🎨 Brand Identity
- Custom color scheme: #be1e2d (primary red) and #faf5f6 (background)
- Modern, elegant design focused on clothing retail
- Responsive layout for all devices

### 📸 Enhanced Product Display
- **Multiple Images**: 3-4 product images from various angles
- **Video Support**: Optional product video display
- **Image Gallery**: Interactive thumbnail navigation
- **Size Selection**: M, L, XL, XXL size options for each product
- **Smooth Transitions**: Professional hover effects and animations

### 🛒 Shopping Features
- Add to cart with size selection
- Real-time cart count updates
- Persistent cart (session-based for guests, user-based for authenticated users)
- Product filtering and sorting
- Category-based browsing

### 💳 Product Management
- Featured products showcase
- Sale prices with discount badges
- Stock quantity tracking
- SKU management
- Category organization

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React with Inertia.js
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (can be changed to MySQL/PostgreSQL)
- **Build Tool**: Vite

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Setup Steps

1. **Install PHP Dependencies**
   ```bash
   composer install
   ```

2. **Install JavaScript Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   # Create database file (SQLite)
   touch database/database.sqlite
   
   # Run migrations
   php artisan migrate
   ```

5. **Create Storage Link**
   ```bash
   php artisan storage:link
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Start Development Servers**
   ```bash
   # Terminal 1: Laravel server
   php artisan serve
   
   # Terminal 2: Vite dev server (for hot reload)
   npm run dev
   ```

8. **Access the Application**
   Open your browser and visit: `http://localhost:8000`

## Database Structure

### Products Table
- Multiple images (JSON array)
- Video URL support
- Available sizes (JSON array: M, L, XL, XXL)
- Price and sale price
- Stock quantity
- Category relationship

### Orders & Cart
- User-based and session-based cart support
- Size tracking in cart items
- Complete order management

## Key Files

### Models
- `app/Models/Product.php` - Product model with images, video, sizes
- `app/Models/Category.php` - Category model
- `app/Models/Cart.php` - Shopping cart model
- `app/Models/Order.php` - Order model

### Controllers
- `app/Http/Controllers/ProductController.php` - Product listings and details
- `app/Http/Controllers/CartController.php` - Cart management
- `app/Http/Controllers/CategoryController.php` - Category browsing
- `app/Http/Controllers/WelcomeController.php` - Homepage

### React Components
- `resources/js/Components/ProductCard.jsx` - Product card with image carousel
- `resources/js/Pages/Products/Show.jsx` - Product detail with gallery & video
- `resources/js/Pages/Welcome.jsx` - Homepage
- `resources/js/Layouts/MainLayout.jsx` - Main site layout

### Styling
- `tailwind.config.js` - Avhira brand colors configuration
- `resources/css/app.css` - Custom CSS with brand colors

## Color Scheme

```css
Primary Red: #be1e2d
Dark Red: #9a1824
Light Red: #d94452
Background: #faf5f6
```

## Adding Products

### Via Tinker (Development)
```bash
php artisan tinker
```

```php
$category = \App\Models\Category::create([
    'name' => 'T-Shirts',
    'description' => 'Comfortable cotton t-shirts'
]);

$product = \App\Models\Product::create([
    'name' => 'Premium Cotton T-Shirt',
    'category_id' => $category->id,
    'description' => 'High-quality cotton t-shirt with modern fit',
    'price' => 999.00,
    'sale_price' => 799.00,
    'stock_quantity' => 50,
    'sku' => 'TSH-001',
    'images' => ['products/tshirt-front.jpg', 'products/tshirt-back.jpg', 'products/tshirt-side.jpg'],
    'video_url' => 'products/tshirt-video.mp4',
    'available_sizes' => ['M', 'L', 'XL', 'XXL'],
    'is_featured' => true,
    'product_type' => 'clothing'
]);
```

## Image Upload Guidelines

1. Store product images in `storage/app/public/products/`
2. Recommended image size: 1000x1000px
3. Supported formats: JPG, PNG, WebP
4. Use descriptive filenames (e.g., `red-tshirt-front.jpg`)

## Customization

### Changing Colors
Edit `tailwind.config.js`:
```javascript
colors: {
    'avhira-red': '#be1e2d',
    'avhira-bg': '#faf5f6',
    // Add more custom colors
}
```

### Adding More Sizes
Update product creation to include additional sizes:
```php
'available_sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
```

## Production Deployment

1. **Optimize Autoloader**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

2. **Cache Configuration**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Build Assets**
   ```bash
   npm run build
   ```

4. **Set Production Environment**
   ```
   APP_ENV=production
   APP_DEBUG=false
   ```

## Troubleshooting

### Images Not Showing
- Ensure storage link is created: `php artisan storage:link`
- Check file permissions on `storage/app/public`

### Cart Not Working
- Clear cache: `php artisan cache:clear`
- Check session configuration in `.env`

### CSS Not Loading
- Run `npm run build` or `npm run dev`
- Clear browser cache

## Future Enhancements

- [ ] Admin panel for product management
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Social media integration

## Support

For questions or issues, please contact the development team.

## License

This project is proprietary software developed for Avhira.

---

**Developed by World's Best Web Development Team** 🚀
