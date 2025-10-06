# AVHIRA E-COMMERCE PROJECT OVERVIEW

## 🎯 Project Summary

This is a modern, feature-rich e-commerce website built specifically for **Avhira**, a premium clothing brand. The project is built using **Laravel 12** (backend) and **React with Inertia.js** (frontend), styled with **Tailwind CSS v4** featuring Avhira's custom brand colors.

---

## 🎨 Brand Identity

### Colors
- **Primary Red**: `#be1e2d` - Main brand color used for CTAs, highlights
- **Dark Red**: `#9a1824` - Hover states, gradients
- **Light Red**: `#d94452` - Accents and subtle highlights
- **Background**: `#faf5f6` - Soft, elegant background throughout the site

### Design Philosophy
- Clean, modern aesthetic
- Focus on product imagery
- Smooth transitions and animations
- Mobile-first responsive design

---

## ✨ Key Features

### 1. Enhanced Product Display
- **Multiple Images**: Support for 3-4 product images from different angles
- **Video Support**: Optional video showcase for products
- **Interactive Gallery**: Thumbnail navigation with smooth transitions
- **Image Dots**: Carousel-style navigation dots on product cards

### 2. Size Management
- **Available Sizes**: M, L, XL, XXL (configurable per product)
- **Size Selection**: Visual size selector on product detail page
- **Cart Integration**: Size information persists through cart to checkout

### 3. Shopping Cart
- **Persistent Cart**: Session-based for guests, user-based for authenticated users
- **Real-time Updates**: Cart count updates immediately
- **Size Tracking**: Each cart item includes selected size
- **Quantity Management**: Increase/decrease quantities easily

### 4. Product Features
- **Sale Prices**: Support for discounted pricing with percentage badges
- **Stock Management**: Real-time stock tracking
- **Featured Products**: Highlight specific products on homepage
- **Category Organization**: Logical product categorization

### 5. User Experience
- **Toast Notifications**: Non-intrusive success/error messages
- **Smooth Animations**: Professional hover effects and transitions
- **Loading States**: Visual feedback during operations
- **Responsive Design**: Works perfectly on all devices

---

## 🗂️ Project Structure

### Backend (Laravel)

#### Database Schema
```
categories
├── id
├── name
├── slug
├── description
├── image
└── timestamps

products
├── id
├── name
├── slug
├── category_id
├── description
├── price
├── sale_price
├── stock_quantity
├── sku
├── images (JSON array)
├── video_url
├── available_sizes (JSON array)
├── is_featured
├── product_type
└── timestamps

carts
├── id
├── user_id (nullable)
├── session_id (nullable)
├── product_id
├── size
├── quantity
└── timestamps

orders
├── id
├── user_id
├── order_number
├── total_amount
├── status
├── shipping_address
├── shipping_city
├── shipping_state
├── shipping_pincode
├── phone
├── notes
└── timestamps

order_items
├── id
├── order_id
├── product_id
├── product_name
├── size
├── quantity
├── price
└── timestamps
```

#### Models
- **Product**: Main product model with image/video handling
- **Category**: Product categorization
- **Cart**: Shopping cart management
- **Order**: Order tracking
- **OrderItem**: Individual order line items

#### Controllers
- **WelcomeController**: Homepage with featured products
- **ProductController**: Product listing and details
- **CategoryController**: Category browsing
- **CartController**: Cart management API

### Frontend (React)

#### Pages
```
resources/js/Pages/
├── Welcome.jsx          # Homepage
├── Products/
│   ├── Index.jsx       # All products with filters
│   └── Show.jsx        # Product detail page
└── Cart/
    └── Index.jsx       # Shopping cart
```

#### Components
```
resources/js/Components/
├── ProductCard.jsx           # Reusable product card
└── GlobalToastProvider.jsx  # Toast notification system
```

#### Layouts
```
resources/js/Layouts/
└── MainLayout.jsx       # Main site layout with nav/footer
```

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Quick Setup

Run the setup script:
```powershell
.\setup.ps1
```

Or manually:

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment Setup**
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   # Create SQLite database
   New-Item -ItemType File -Path database\database.sqlite

   # Run migrations
   php artisan migrate

   # Seed sample data
   php artisan db:seed
   ```

4. **Storage Link**
   ```bash
   php artisan storage:link
   ```

5. **Build Assets**
   ```bash
   npm run build
   ```

6. **Start Servers**
   ```bash
   # Terminal 1
   php artisan serve

   # Terminal 2
   npm run dev
   ```

7. **Visit**: http://localhost:8000

---

## 📝 Usage Guide

### Adding Products

#### Via Tinker (Recommended for development)
```bash
php artisan tinker
```

```php
$product = \App\Models\Product::create([
    'name' => 'Premium Red Shirt',
    'category_id' => 1,
    'description' => 'Elegant red shirt perfect for formal occasions',
    'price' => 1999.00,
    'sale_price' => 1599.00,  // Optional
    'stock_quantity' => 50,
    'sku' => 'SHT-RED-001',
    'images' => [
        'products/red-shirt-front.jpg',
        'products/red-shirt-back.jpg',
        'products/red-shirt-side.jpg'
    ],
    'video_url' => 'products/red-shirt-video.mp4',  // Optional
    'available_sizes' => ['M', 'L', 'XL', 'XXL'],
    'is_featured' => true,
    'product_type' => 'clothing'
]);
```

### Image Upload
1. Place images in: `storage/app/public/products/`
2. Recommended size: 1000x1000px
3. Formats: JPG, PNG, WebP
4. Use descriptive names: `product-name-angle.jpg`

### Video Upload
1. Place videos in: `storage/app/public/products/`
2. Recommended: MP4 format, < 10MB
3. Keep videos short (15-30 seconds)

---

## 🎨 Customization

### Changing Brand Colors

Edit `tailwind.config.js`:
```javascript
colors: {
    'avhira-red': '#YOUR_COLOR',
    'avhira-bg': '#YOUR_BACKGROUND',
}
```

Then rebuild:
```bash
npm run build
```

### Adding More Sizes

When creating products:
```php
'available_sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
```

### Custom Categories

```php
$category = \App\Models\Category::create([
    'name' => 'Accessories',
    'description' => 'Complete your look with our accessories',
    'image' => 'categories/accessories.jpg'
]);
```

---

## 🔧 API Endpoints

### Cart API
```
POST   /cart/add          - Add item to cart
GET    /cart/count        - Get cart item count
GET    /cart              - View cart
PATCH  /cart/{id}         - Update cart item
DELETE /cart/{id}         - Remove from cart
```

### Product Routes
```
GET    /                  - Homepage
GET    /products          - All products
GET    /products/{slug}   - Product details
GET    /categories        - All categories
GET    /categories/{slug} - Category products
```

---

## 📦 Deployment Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false`
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `npm run build`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set up proper file permissions
- [ ] Configure web server (Apache/Nginx)
- [ ] Set up SSL certificate
- [ ] Configure database (MySQL/PostgreSQL)
- [ ] Set up email service
- [ ] Configure backup system

---

## 🐛 Troubleshooting

### Images Not Showing
```bash
php artisan storage:link
# Check permissions on storage/app/public
```

### Cart Not Working
```bash
php artisan cache:clear
php artisan config:clear
# Check session configuration
```

### CSS Not Loading
```bash
npm run build
# Or for development
npm run dev
```

### Database Errors
```bash
php artisan migrate:fresh --seed
```

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Admin dashboard for product management
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Order tracking system
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Social media integration
- [ ] Blog/Content section
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 📚 Technical Stack

### Backend
- **Laravel 12**: PHP framework
- **Inertia.js**: Modern monolith approach
- **SQLite/MySQL**: Database

### Frontend
- **React 19**: UI library
- **Tailwind CSS v4**: Utility-first CSS
- **Vite**: Build tool
- **Axios**: HTTP client

### Key Packages
- `@inertiajs/react`: React adapter for Inertia
- `@headlessui/react`: Accessible UI components
- `@radix-ui/*`: Primitive UI components
- `tailwindcss-animate`: Animation utilities
- `laravel-vite-plugin`: Vite integration

---

## 👥 Team

**Developed by World's Best Web Development Team**

---

## 📄 License

Proprietary - © 2025 Avhira. All rights reserved.

---

## 🤝 Support

For technical support or questions:
- Check the troubleshooting section
- Review the README.md
- Contact the development team

---

**Made with ❤️ for Avhira**
