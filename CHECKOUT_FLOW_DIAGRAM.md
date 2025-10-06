# Avhira Checkout Flow Diagram

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SHOPPING CART                                    │
│  User adds products → Cart Slider → "Proceed to Checkout" Button       │
└─────────────────────┬───────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Is User Logged In?   │
         └────────┬───────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼ NO                 ▼ YES
┌───────────────┐    ┌──────────────────┐
│  GUEST USER   │    │  LOGGED-IN USER  │
└───────┬───────┘    └────────┬─────────┘
        │                     │
        │                     │ (Skip Step 1)
        ▼                     │
╔═══════════════════╗         │
║   STEP 1: CONTACT ║         │
║   INFORMATION     ║         │
╠═══════════════════╣         │
║ • Name            ║         │
║ • Email           ║         │
║ • Phone           ║         │
║ • Password (NEW)  ║         │
╚═══════════════════╝         │
        │                     │
        │ [Continue] ────────►│
        │                     │
        ▼                     ▼
╔════════════════════════════════════════╗
║   STEP 2: DELIVERY ADDRESS & PAYMENT   ║
╠════════════════════════════════════════╣
║ Contact Info (Logged-in: Pre-filled)   ║
║ ✓ Name: [Auto-filled from account]    ║
║ ✓ Email: [Auto-filled from account]   ║
║ ✓ Phone: [Auto-filled if saved]       ║
║                                        ║
║ Delivery Address (Pre-fill if exists)  ║
║ • Complete Address                     ║
║ • Pincode                              ║
║ • City                                 ║
║ • State                                ║
║ • Country (India - default)            ║
╚════════════════════════════════════════╝
        │
        │ [Proceed to Payment] Button
        │
        ▼
┌────────────────────────────────────────┐
│  VALIDATION                             │
│  ✓ All required fields filled          │
│  ✓ Email format valid                  │
│  ✓ Phone 10 digits                     │
│  ✓ Pincode 6 digits                    │
└────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────┐
│  CREATE RAZORPAY ORDER                  │
│  POST /api/checkout/create-razorpay-    │
│  order                                  │
│  → Returns: order_id, amount            │
└────────────────────────────────────────┘
        │
        ▼
╔════════════════════════════════════════╗
║      RAZORPAY PAYMENT MODAL            ║
╠════════════════════════════════════════╣
║  Payment Options:                      ║
║  □ Credit/Debit Card                   ║
║  □ UPI                                 ║
║  □ Netbanking                          ║
║  □ Wallet                              ║
║                                        ║
║  [Complete Payment] Button             ║
╚════════════════════════════════════════╝
        │
        ▼
┌────────────────────────────────────────┐
│  USER COMPLETES PAYMENT                 │
│  Razorpay processes transaction        │
└────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────┐
│  RAZORPAY RETURNS RESPONSE              │
│  • razorpay_payment_id                 │
│  • razorpay_order_id                   │
│  • razorpay_signature                  │
└────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────┐
│  SUBMIT TO BACKEND                      │
│  POST /checkout                         │
│  With: form data + payment details     │
└────────────────────────────────────────┘
        │
        ▼
╔════════════════════════════════════════╗
║  BACKEND PROCESSING                     ║
╠════════════════════════════════════════╣
║ 1. Verify Razorpay Signature          ║
║    (Security check)                    ║
║                                        ║
║ 2. Create/Login User (if guest)       ║
║    • Check if email exists            ║
║    • Create new user OR               ║
║    • Login existing user              ║
║                                        ║
║ 3. Update User Profile                ║
║    • Save phone, address if new       ║
║    • Update if changed                ║
║                                        ║
║ 4. Create Order Record                ║
║    • Generate order number            ║
║    • Save shipping details            ║
║    • Store payment ID                 ║
║                                        ║
║ 5. Create Order Items                 ║
║    • Link products to order           ║
║    • Save quantities & prices         ║
║                                        ║
║ 6. Clear Cart                         ║
║    • Delete from database             ║
║    • Clear session cart               ║
╚════════════════════════════════════════╝
        │
        ▼
┌────────────────────────────────────────┐
│  REDIRECT TO SUCCESS PAGE               │
│  /order/success/{orderId}              │
└────────────────────────────────────────┘
        │
        ▼
╔════════════════════════════════════════╗
║     ORDER CONFIRMATION PAGE            ║
╠════════════════════════════════════════╣
║  ✓ Order Confirmed! 🎉                 ║
║                                        ║
║  Order Details:                        ║
║  • Order Number                        ║
║  • Items purchased                     ║
║  • Total amount                        ║
║  • Shipping address                    ║
║                                        ║
║  What's Next:                          ║
║  1. Order Confirmation (email)         ║
║  2. Order Processing                   ║
║  3. Shipping with tracking             ║
║                                        ║
║  [Continue Shopping] [View Order]      ║
╚════════════════════════════════════════╝
```

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. FRONTEND VALIDATION                                  │
│     ✓ Required fields check                             │
│     ✓ Email format validation                           │
│     ✓ Phone number format (10 digits)                   │
│     ✓ Pincode format (6 digits)                         │
│     ✓ Password strength (min 8 chars)                   │
│                                                           │
│  2. CSRF PROTECTION                                      │
│     ✓ Laravel CSRF tokens on all forms                  │
│     ✓ Inertia.js automatic token handling               │
│                                                           │
│  3. RAZORPAY SIGNATURE VERIFICATION                      │
│     ✓ Hash payment details with secret                  │
│     ✓ Compare with Razorpay signature                   │
│     ✓ Reject if mismatch                                │
│                                                           │
│  4. BACKEND VALIDATION                                   │
│     ✓ Re-validate all fields                            │
│     ✓ Check cart not empty                              │
│     ✓ Verify product availability                       │
│                                                           │
│  5. PASSWORD SECURITY                                    │
│     ✓ Bcrypt hashing (Laravel default)                  │
│     ✓ Salt automatically added                          │
│     ✓ Never stored in plain text                        │
│                                                           │
│  6. DATABASE TRANSACTIONS                                │
│     ✓ All-or-nothing order creation                     │
│     ✓ Rollback on error                                 │
│     ✓ Data consistency guaranteed                       │
│                                                           │
│  7. AUTHORIZATION                                        │
│     ✓ Orders linked to users                            │
│     ✓ Access control on order view                      │
│     ✓ Admin/user permission checks                      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

```
GUEST USER FIRST ORDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enter Details → Create Account → Save Address → Place Order
                    ↓                ↓               ↓
                User Record     Update Profile   Order Record
                (password)      (address)        (linked to user)

RETURNING USER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Login → Pre-fill Data → Edit (optional) → Place Order
          ↓                    ↓               ↓
    From User Table    Update if Changed  Order Record
```

## 🎯 State Management

```
┌─────────────────────────────────────────────────────────┐
│                   REACT STATE                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  currentStep: 1 | 2                                     │
│  ↳ Controls which form is displayed                    │
│                                                          │
│  form: {                                                │
│    name, email, phone, password,                        │
│    address, city, state, pincode, country              │
│  }                                                       │
│  ↳ Stores all user input                               │
│                                                          │
│  errors: {}                                             │
│  ↳ Validation error messages                           │
│                                                          │
│  loading: boolean                                       │
│  ↳ Payment processing state                            │
│                                                          │
│  cartItems: []                                          │
│  ↳ Products being purchased                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 💾 Database Schema Relationships

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   USERS     │────1:N──│   ORDERS    │────1:N──│ ORDER_ITEMS │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id          │         │ id          │         │ id          │
│ name        │         │ user_id  FK │         │ order_id FK │
│ email       │         │ order_number│         │ product_id  │
│ password    │         │ total_amount│         │ quantity    │
│ phone       │◄────┐   │ status      │         │ price       │
│ address     │     │   │ ship_address│         │ size        │
│ city        │     │   │ ship_city   │         └─────────────┘
│ state       │     │   │ ship_state  │
│ pincode     │     │   │ ship_pincode│
│ country     │     │   │ phone       │
└─────────────┘     │   │ notes       │
                    │   └─────────────┘
                    │
                    └── User address info
                        copied to order
                        for record keeping
```

## 🚀 Performance Optimizations

```
✓ Lazy loading of Razorpay script
✓ Single API call for cart items
✓ Debounced validation
✓ Optimistic UI updates
✓ Database indexing (user_id, order_id)
✓ Eager loading (with('product'))
✓ Minimal re-renders (React memo where needed)
```

---

**Built with ❤️ for Avhira**
*Modern, Secure, User-Friendly Checkout Experience*
