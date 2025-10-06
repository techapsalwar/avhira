# Avhira Checkout System - Setup Instructions

## Overview
A comprehensive checkout system that gracefully handles both logged-in users and guests, with Razorpay payment integration.

## Features
✅ **Dual User Flow**: Supports both authenticated users and guests seamlessly
✅ **Smart Address Management**: Pre-fills and saves user addresses
✅ **Two-Step Process**: Contact info → Delivery & Payment
✅ **Razorpay Integration**: Secure payment processing
✅ **Order Tracking**: Complete order history and status tracking
✅ **Responsive Design**: Mobile-first, optimized for all devices
✅ **Avhira Branding**: Consistent with brand colors and design

## Installation Steps

### 1. Install Razorpay PHP SDK
```bash
composer require razorpay/razorpay
```

### 2. Run Database Migration
```bash
php artisan migrate
```

This will add the following fields to the `users` table:
- phone
- address
- city
- state
- pincode
- country

### 3. Configure Razorpay
Add your Razorpay credentials to `.env`:

```env
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
```

**To get Razorpay credentials:**
1. Sign up at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Secret

### 4. Test the Checkout Flow

#### For Guest Users:
1. Add items to cart
2. Go to `/checkout`
3. Fill contact information (creates account automatically)
4. Fill delivery address
5. Complete Razorpay payment
6. View order confirmation

#### For Logged-In Users:
1. Add items to cart
2. Go to `/checkout`
3. Verify/edit pre-filled contact info
4. Fill/edit delivery address
5. Complete Razorpay payment
6. View order confirmation

## File Structure

```
app/
├── Http/Controllers/
│   └── CheckoutController.php          # Checkout logic, Razorpay integration
├── Models/
│   ├── User.php                        # Updated with address fields
│   ├── Order.php                       # Order model
│   └── OrderItem.php                   # Order items model

config/
└── services.php                        # Razorpay configuration

database/
└── migrations/
    └── 2025_10_05_000001_add_address_fields_to_users_table.php

resources/js/
├── Pages/
│   └── Checkout/
│       ├── Index.jsx                   # Main checkout page
│       └── Success.jsx                 # Order confirmation page
└── Components/
    └── CartSlider.jsx                  # Already has checkout button

routes/
└── web.php                             # Checkout routes added
```

## How It Works

### User Flow

#### Guest Checkout:
1. **Step 1 - Contact Info**:
   - Name, Email, Phone
   - Password creation (auto-creates account)
   - Validation for all fields

2. **Step 2 - Delivery & Payment**:
   - Complete address form
   - City, State, Pincode
   - Razorpay payment modal
   - Order confirmation

#### Returning User Checkout:
1. **Skips to Step 2** (contact info pre-filled)
2. **Address Pre-filled** from previous orders
3. **Editable** - can update any information
4. **Saved** - updates user profile if changed

### Payment Flow

1. User clicks "Proceed to Payment"
2. Frontend validates all form fields
3. Creates Razorpay order via API call
4. Opens Razorpay payment modal
5. User completes payment (Card/UPI/Netbanking/Wallet)
6. Razorpay returns payment details
7. Backend verifies signature
8. Creates order in database
9. Clears cart
10. Redirects to success page

### Security Features

✅ **Signature Verification**: Validates Razorpay payment signature
✅ **CSRF Protection**: Laravel's built-in CSRF tokens
✅ **Password Hashing**: Secure password storage with bcrypt
✅ **Input Validation**: Server-side validation for all fields
✅ **User Authorization**: Orders belong to authenticated users
✅ **Database Transactions**: Atomic order creation

## API Endpoints

```
GET  /checkout                          # Show checkout page
POST /checkout                          # Process order after payment
POST /api/checkout/create-razorpay-order # Create Razorpay order
GET  /order/success/{orderId}          # Order confirmation page
```

## Razorpay Test Cards

For testing in **Test Mode**:

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4000 0000 0000 0002

**UPI:**
- success@razorpay

## Customization

### Change Colors:
Update Avhira red color throughout:
- `#be1e2d` (primary red)
- `#9a1824` (hover state)
- `#faf5f6` (background)

### Add Order Notifications:
Uncomment email sending in `CheckoutController.php`:
```php
// Send confirmation emails
Mail::to($user->email)->send(new OrderConfirmation($order));
```

### Add Discount Codes:
In `CheckoutController@store`:
```php
if ($request->discount_code) {
    $discount = calculateDiscount($request->discount_code);
    $total = $total - $discount;
}
```

### Add Multiple Addresses:
Create `addresses` table and relationship:
```php
User hasMany Address
$user->addresses()->create([...])
```

## Troubleshooting

### "Payment verification failed"
- Check Razorpay secret key in `.env`
- Verify webhook signature verification logic
- Check Razorpay dashboard for payment status

### "Cart is empty"
- Ensure cart items exist before checkout
- Check session/database cart storage
- Verify cart items API endpoint works

### "Undefined method 'check'"
- IDE error, ignore - Laravel Facade methods work at runtime
- Add `/** @var \Illuminate\Auth\AuthManager $auth */` if needed

### Orders not creating
- Check database connection
- Verify orders table exists
- Check Laravel logs: `storage/logs/laravel.log`
- Enable query logging temporarily

## Production Checklist

Before going live:

- [ ] Switch to Razorpay Live keys
- [ ] Test with real payment methods
- [ ] Set up order confirmation emails
- [ ] Configure SMS notifications
- [ ] Add order tracking system
- [ ] Set up admin order management
- [ ] Enable backup system
- [ ] Add monitoring/logging
- [ ] Test edge cases (failed payments, cart changes)
- [ ] Add analytics tracking

## Future Enhancements

1. **Multiple Payment Methods**: Add COD, wallet, EMI
2. **Order Tracking**: Real-time status updates
3. **Invoice Generation**: PDF invoices
4. **Wishlist**: Save for later functionality
5. **Guest Checkout**: Allow checkout without account (email only)
6. **Address Book**: Save multiple addresses
7. **Discount Coupons**: Promo code system
8. **Gift Cards**: Gift card payment option
9. **Subscription Orders**: Recurring payments
10. **International Shipping**: Multi-currency support

## Support

For Razorpay integration issues:
- Docs: https://razorpay.com/docs/
- Support: support@razorpay.com

For Laravel/Inertia issues:
- Laravel: https://laravel.com/docs
- Inertia: https://inertiajs.com/

## License

This checkout system is part of the Avhira e-commerce platform.
