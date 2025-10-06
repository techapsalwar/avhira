# 🧪 Checkout Testing Checklist

## Pre-Testing Setup
- [ ] Razorpay keys added to `.env`
- [ ] Laravel server running (`php artisan serve`)
- [ ] Database migrations completed
- [ ] At least 3-4 products with images in database
- [ ] Clear browser cache/cookies

---

## 🎯 Test Case 1: Guest User - First Time Checkout

### Prerequisites
- [ ] Logged out / Incognito mode
- [ ] Cart is empty

### Steps
1. **Add Products to Cart**
   - [ ] Go to homepage
   - [ ] Add 2-3 products with different quantities
   - [ ] Verify cart counter updates
   - [ ] Open cart slider - verify items shown correctly

2. **Navigate to Checkout**
   - [ ] Click "Proceed to Checkout" in cart slider
   - [ ] Should redirect to `/checkout`
   - [ ] Verify Step 1 form is shown (Contact Information)
   - [ ] Progress indicator shows Step 1 active

3. **Fill Contact Information (Step 1)**
   - [ ] Enter valid name (e.g., "John Doe")
   - [ ] Enter valid email (e.g., "john@example.com")
   - [ ] Enter valid phone (10 digits: "9876543210")
   - [ ] Enter password (min 8 chars: "password123")
   - [ ] Try submitting with empty fields - should show errors
   - [ ] Try invalid email format - should show error
   - [ ] Try short phone number - should show error
   - [ ] Click "Continue to Delivery" with valid data

4. **Fill Delivery Address (Step 2)**
   - [ ] Verify redirected to Step 2
   - [ ] Progress indicator shows Step 2 active
   - [ ] "Back" button visible and works
   - [ ] Enter complete address (multi-line)
   - [ ] Enter 6-digit pincode (e.g., "400001")
   - [ ] Enter city (e.g., "Mumbai")
   - [ ] Enter state (e.g., "Maharashtra")
   - [ ] Verify country pre-filled as "India"
   - [ ] Try submitting with empty fields - should show errors
   - [ ] Try invalid pincode - should show error

5. **Order Summary (Right Sidebar)**
   - [ ] All cart items displayed with images
   - [ ] Quantities correct
   - [ ] Prices correct (sale price if applicable)
   - [ ] Subtotal calculated correctly
   - [ ] Shipping shows "FREE"
   - [ ] Total amount correct
   - [ ] Trust badges visible

6. **Payment Processing**
   - [ ] Click "Proceed to Payment" button
   - [ ] Razorpay modal opens
   - [ ] Order details pre-filled (name, email, phone)
   - [ ] Test Card option available
   - [ ] Enter test card: `4111 1111 1111 1111`
   - [ ] CVV: `123`
   - [ ] Expiry: Any future date (e.g., `12/25`)
   - [ ] Click "Pay Now"

7. **Order Confirmation**
   - [ ] Redirected to `/order/success/{orderId}`
   - [ ] Success animation shows
   - [ ] Order number displayed
   - [ ] Order details correct (items, quantities, prices)
   - [ ] Shipping address displayed correctly
   - [ ] Total amount correct
   - [ ] "What's Next" guide visible
   - [ ] "Continue Shopping" button works
   - [ ] "View Order Details" button present

8. **Verification**
   - [ ] User automatically logged in (check navbar)
   - [ ] Cart is now empty (check cart slider)
   - [ ] Can access dashboard/profile
   - [ ] User record created in database
   - [ ] Order record created in database
   - [ ] Order items created correctly

### Expected Results
✅ User account created with provided details
✅ Address saved to user profile
✅ Order placed successfully
✅ User automatically logged in
✅ Cart cleared
✅ Order visible in database

---

## 🔐 Test Case 2: Existing User - Logged In Checkout

### Prerequisites
- [ ] User account exists (from Test Case 1 or create manually)
- [ ] User is logged in
- [ ] User has saved address from previous order

### Steps
1. **Add Products to Cart**
   - [ ] Add different products than Test Case 1
   - [ ] Try different quantities
   - [ ] Open cart slider - verify items

2. **Navigate to Checkout**
   - [ ] Click "Proceed to Checkout"
   - [ ] Should go directly to Step 2 (Delivery & Payment)
   - [ ] Step 1 skipped (already logged in)

3. **Verify Pre-filled Data**
   - [ ] Name pre-filled from account
   - [ ] Email pre-filled from account (disabled field)
   - [ ] Phone pre-filled if saved
   - [ ] Address pre-filled from previous order
   - [ ] City pre-filled
   - [ ] State pre-filled
   - [ ] Pincode pre-filled
   - [ ] All fields editable (except email)

4. **Edit Address (Optional)**
   - [ ] Change address to new one
   - [ ] Change city
   - [ ] Change pincode
   - [ ] All edits should work

5. **Complete Payment**
   - [ ] Click "Proceed to Payment"
   - [ ] Razorpay modal opens with pre-filled data
   - [ ] Complete payment with test card
   - [ ] Redirected to success page

6. **Verification**
   - [ ] Order placed successfully
   - [ ] If address changed, user profile updated
   - [ ] Cart cleared
   - [ ] New order in database linked to same user

### Expected Results
✅ Faster checkout (Step 1 skipped)
✅ All data pre-filled
✅ Address editable and updates saved
✅ Order placed successfully

---

## 🚫 Test Case 3: Validation & Error Handling

### Test Invalid Inputs
- [ ] **Empty Name**: Should show "Name is required"
- [ ] **Invalid Email**: 
  - [ ] Empty: "Email is required"
  - [ ] Wrong format: "Please enter a valid email"
- [ ] **Invalid Phone**:
  - [ ] Empty: "Phone number is required"
  - [ ] Less than 10 digits: "Please enter a valid 10-digit phone number"
  - [ ] Letters: Should not accept
- [ ] **Weak Password**:
  - [ ] Empty: "Password is required for new accounts"
  - [ ] Less than 8 chars: "Password must be at least 8 characters"
- [ ] **Invalid Address**:
  - [ ] Empty: "Address is required"
- [ ] **Invalid Pincode**:
  - [ ] Empty: "Pincode is required"
  - [ ] Not 6 digits: "Please enter a valid 6-digit pincode"
  - [ ] Letters: Should not accept

### Test Edge Cases
- [ ] **Empty Cart**: Should redirect to cart page with error
- [ ] **Payment Cancellation**: 
  - [ ] Close Razorpay modal
  - [ ] Should stay on checkout page
  - [ ] Cart should not be cleared
  - [ ] Can retry payment
- [ ] **Payment Failure**:
  - [ ] Use test card: `4000 0000 0000 0002`
  - [ ] Payment should fail
  - [ ] Should show error message
  - [ ] Can retry with different card
- [ ] **Network Error**:
  - [ ] Disable internet mid-checkout
  - [ ] Should show error message
  - [ ] Re-enable and retry

### Test Security
- [ ] **CSRF Token**: Check network requests include token
- [ ] **Signature Verification**: Order only created with valid signature
- [ ] **Authorization**: Can only view own orders (test in different browser)

---

## 📱 Test Case 4: Mobile Responsiveness

### Test on Mobile Device or Responsive Mode

#### Mobile View (< 640px)
- [ ] **Cart Slider**: Slides from bottom on mobile, half-screen height
- [ ] **Checkout Form**: Single column layout
- [ ] **Progress Steps**: Stacked vertically or compact
- [ ] **Order Summary**: Below form or collapsible
- [ ] **Payment Button**: Full width, easy to tap
- [ ] **Input Fields**: Large enough to tap
- [ ] **Validation Errors**: Visible below fields

#### Tablet View (640px - 1024px)
- [ ] Form fields in 2 columns where appropriate
- [ ] Cart slider behavior correct
- [ ] All buttons accessible

#### Desktop View (> 1024px)
- [ ] 3-column grid (form spans 2, summary 1)
- [ ] Cart slider from right side
- [ ] Proper margins on sides (lg:px-8 xl:px-16)

---

## 🔄 Test Case 5: Integration Testing

### Cart to Checkout Flow
- [ ] Add product from product page
- [ ] Add product from homepage
- [ ] Update quantity in cart slider
- [ ] Remove item from cart slider
- [ ] Add same product multiple times
- [ ] Checkout with multiple different products
- [ ] Verify all quantities/prices correct

### User Account Integration
- [ ] Guest checkout creates account
- [ ] Can login with created credentials later
- [ ] Address saves to profile
- [ ] Phone saves to profile
- [ ] Subsequent orders use saved data

### Payment Integration
- [ ] Razorpay test mode working
- [ ] Payment ID recorded in order notes
- [ ] Only successful payments create orders
- [ ] Failed payments don't create orders
- [ ] Signature verification works

---

## 🗄️ Test Case 6: Database Verification

### After Each Order, Check Database

#### Users Table
- [ ] New user created (for guest checkout)
- [ ] Phone saved
- [ ] Address saved
- [ ] City, State, Pincode saved
- [ ] Country saved
- [ ] Password hashed (not plain text)

#### Orders Table
- [ ] Order created with unique order_number
- [ ] Linked to correct user_id
- [ ] Total_amount correct
- [ ] Status = 'pending'
- [ ] Shipping address fields populated
- [ ] Phone saved
- [ ] Notes contain payment_id
- [ ] Timestamps correct

#### Order Items Table
- [ ] One row per cart item
- [ ] Correct product_id
- [ ] Correct quantity
- [ ] Correct price (at time of order)
- [ ] Product_name saved (for history)
- [ ] Size saved if applicable

#### Cart Table
- [ ] Cleared after order (no items for user)

---

## 🎨 Test Case 7: UI/UX Testing

### Visual Elements
- [ ] Avhira brand colors used (#be1e2d)
- [ ] Consistent font styles
- [ ] Proper spacing and padding
- [ ] Images load correctly
- [ ] Icons render properly
- [ ] Animations smooth (progress steps, success)

### User Experience
- [ ] Loading states show during API calls
- [ ] Errors clearly visible
- [ ] Success messages encouraging
- [ ] Navigation intuitive
- [ ] Back button works correctly
- [ ] Can edit information easily
- [ ] Trust badges visible
- [ ] Payment secure messaging

### Accessibility
- [ ] All inputs have labels
- [ ] Error messages associated with fields
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient

---

## 🚀 Test Case 8: Performance Testing

### Load Times
- [ ] Checkout page loads < 2 seconds
- [ ] Cart items fetch < 1 second
- [ ] Razorpay script loads quickly
- [ ] Form submission responsive
- [ ] No unnecessary re-renders

### Optimization
- [ ] Images optimized/lazy loaded
- [ ] No console errors
- [ ] No console warnings
- [ ] Network requests minimal
- [ ] No memory leaks

---

## 📊 Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Guest Checkout | ⬜ Pass / ❌ Fail |  |
| Logged-in Checkout | ⬜ Pass / ❌ Fail |  |
| Validation | ⬜ Pass / ❌ Fail |  |
| Mobile Responsive | ⬜ Pass / ❌ Fail |  |
| Integration | ⬜ Pass / ❌ Fail |  |
| Database | ⬜ Pass / ❌ Fail |  |
| UI/UX | ⬜ Pass / ❌ Fail |  |
| Performance | ⬜ Pass / ❌ Fail |  |

---

## 🐛 Bug Tracking Template

**Issue #:**
**Severity:** Critical / High / Medium / Low
**Component:** Frontend / Backend / Payment / Database
**Description:**
**Steps to Reproduce:**
**Expected:**
**Actual:**
**Browser/Device:**
**Screenshot:**
**Status:** Open / In Progress / Fixed / Closed

---

## ✅ Sign-off

**Tested By:**
**Date:**
**Environment:** Test / Staging / Production
**Overall Result:** ⬜ Pass / ❌ Fail

**Notes:**

---

**Remember:** Test thoroughly in Test Mode before deploying to Production!
