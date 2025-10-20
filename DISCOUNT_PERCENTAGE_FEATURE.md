# Discount Percentage Feature for Products

## Date: October 20, 2025

## Feature Added
Added an automatic discount percentage calculator to the product Create and Edit forms. This feature allows admins to:
1. Enter a discount percentage and automatically calculate the sale price
2. Enter a sale price and automatically calculate the discount percentage
3. Change the regular price and have the sale price update based on the discount percentage

## How It Works

### Three-Way Synchronization:
1. **Regular Price → Discount % → Sale Price**
   - Enter regular price: $100
   - Enter discount: 20%
   - Sale price automatically becomes: $80

2. **Sale Price → Discount %**
   - Regular price: $100
   - Enter sale price: $75
   - Discount automatically becomes: 25%

3. **Price Change Updates Sale Price**
   - Discount set: 30%
   - Change price from $100 to $150
   - Sale price automatically updates to: $105

## Changes Made

### 1. Create Product Form (`Create.jsx`)

**Added State:**
```jsx
const [discountPercentage, setDiscountPercentage] = useState('');
```

**Added Handler Functions:**
```jsx
const handlePriceChange = (newPrice) => {
    setData('price', newPrice);
    if (discountPercentage && newPrice) {
        const calculatedSalePrice = (parseFloat(newPrice) * (1 - parseFloat(discountPercentage) / 100)).toFixed(2);
        setData('sale_price', calculatedSalePrice);
    }
};

const handleDiscountChange = (discount) => {
    setDiscountPercentage(discount);
    if (discount && data.price) {
        const calculatedSalePrice = (parseFloat(data.price) * (1 - parseFloat(discount) / 100)).toFixed(2);
        setData('sale_price', calculatedSalePrice);
    } else if (!discount) {
        setData('sale_price', '');
    }
};

const handleSalePriceChange = (salePrice) => {
    setData('sale_price', salePrice);
    if (salePrice && data.price) {
        const calculatedDiscount = ((1 - parseFloat(salePrice) / parseFloat(data.price)) * 100).toFixed(2);
        setDiscountPercentage(calculatedDiscount >= 0 ? calculatedDiscount : '0');
    } else if (!salePrice) {
        setDiscountPercentage('');
    }
};
```

**Updated UI:**
- Changed from 3-column grid to 4-column grid for pricing section
- Added new "Discount %" field between Regular Price and Sale Price
- Added helper text: "Auto-calculates sale price"

### 2. Edit Product Form (`Edit.jsx`)

**Added State with Initial Calculation:**
```jsx
const [discountPercentage, setDiscountPercentage] = useState(() => {
    if (product.sale_price && product.price) {
        return ((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100).toFixed(2);
    }
    return '';
});
```

**Added Same Handler Functions:**
- `handlePriceChange()`
- `handleDiscountChange()`
- `handleSalePriceChange()`

**Updated UI:**
- Same 4-column grid layout as Create form
- Pre-calculates discount percentage from existing product data

## UI Layout

### Before (3 columns):
```
[Regular Price] [Sale Price] [Stock Quantity]
```

### After (4 columns):
```
[Regular Price] [Discount %] [Sale Price] [Stock Quantity]
```

## Field Specifications

### Discount % Field:
- **Type:** Number input
- **Step:** 0.01 (allows decimals like 15.50%)
- **Min:** 0
- **Max:** 100
- **Placeholder:** "0"
- **Helper Text:** "Auto-calculates sale price"
- **Position:** Between Regular Price and Sale Price

## Calculation Formulas

### Sale Price from Discount:
```javascript
Sale Price = Regular Price × (1 - Discount% / 100)
```
**Example:** $100 × (1 - 20/100) = $100 × 0.8 = $80

### Discount from Sale Price:
```javascript
Discount% = (1 - Sale Price / Regular Price) × 100
```
**Example:** (1 - $80/$100) × 100 = 0.2 × 100 = 20%

## User Experience

### Creating a Product:
1. Enter product name, category, etc.
2. Enter Regular Price: $100
3. **Option A:** Enter Discount %: 25
   - Sale Price automatically becomes: $75
4. **Option B:** Enter Sale Price: $70
   - Discount % automatically becomes: 30

### Editing a Product:
1. Open edit form
2. If product has a sale price, discount % is pre-calculated and displayed
3. Can adjust any of the three values (price, discount, sale price)
4. Other values update automatically

## Edge Cases Handled

1. **Empty Fields:**
   - If discount % is cleared, sale price is also cleared
   - If sale price is cleared, discount % is also cleared

2. **Negative Discounts:**
   - If sale price > regular price, discount is set to 0 (prevents negative discounts)

3. **Precision:**
   - All calculations rounded to 2 decimal places (.toFixed(2))
   - Suitable for currency values

4. **Zero Values:**
   - Handles zero prices gracefully
   - Prevents division by zero errors

## Benefits

✅ **Faster Data Entry** - No need to manually calculate sale prices  
✅ **Error Prevention** - Eliminates calculation mistakes  
✅ **Flexibility** - Can work from either discount % or sale price  
✅ **Transparency** - Always shows the relationship between price, discount, and sale price  
✅ **Edit Convenience** - Pre-calculates existing discount when editing  

## Testing Checklist

### Create Form:
- ✅ Enter regular price $100, discount 20% → Sale price should be $80
- ✅ Enter regular price $50, sale price $40 → Discount should be 20%
- ✅ Set discount 30%, change price from $100 to $200 → Sale price should update to $140
- ✅ Clear discount % → Sale price should clear
- ✅ Clear sale price → Discount % should clear

### Edit Form:
- ✅ Open product with price $100, sale $75 → Discount should show 25%
- ✅ Open product without sale price → Discount should be empty
- ✅ Change discount % → Sale price should update
- ✅ Change sale price → Discount % should update
- ✅ Change regular price with discount set → Sale price should update

## Example Scenarios

### Scenario 1: Standard Discount
```
Regular Price: $100.00
Discount %: 15
Sale Price: $85.00 (auto-calculated)
```

### Scenario 2: Custom Sale Price
```
Regular Price: $299.99
Sale Price: $199.99 (manually entered)
Discount %: 33.33 (auto-calculated)
```

### Scenario 3: Price Change
```
Initial:
- Regular Price: $50
- Discount %: 20
- Sale Price: $40

Change price to $100:
- Regular Price: $100
- Discount %: 20 (unchanged)
- Sale Price: $80 (auto-updated)
```

## Technical Details

### State Management:
- Uses React `useState` for discount percentage (local state)
- Inertia.js `useForm` for form data (price, sale_price)
- Separation allows UI calculations without affecting form submission

### Form Submission:
- Discount percentage is NOT submitted to backend
- Only Regular Price and Sale Price are submitted
- Backend receives final calculated values

### Decimal Handling:
- Uses `parseFloat()` for calculations
- Uses `.toFixed(2)` for display
- Ensures consistent currency formatting

## Files Modified

1. ✅ `resources/js/Pages/Admin/Products/Create.jsx`
   - Added discount percentage state
   - Added calculation handlers
   - Updated pricing grid layout

2. ✅ `resources/js/Pages/Admin/Products/Edit.jsx`
   - Added discount percentage state with pre-calculation
   - Added same calculation handlers
   - Updated pricing grid layout

## Status
✅ **IMPLEMENTED** - Both Create and Edit forms now support automatic discount percentage calculations

## Future Enhancements (Optional)

1. **Bulk Discount Application:**
   - Apply same discount % to multiple products at once
   
2. **Scheduled Discounts:**
   - Set start/end dates for discount periods
   
3. **Discount Rules:**
   - Different discounts for different customer groups
   - Quantity-based discounts

4. **Visual Savings Display:**
   - Show "You Save: $X (Y%)" on product cards
   - Highlight discount percentage on frontend

5. **Discount History:**
   - Track historical discount changes
   - Analytics on discount effectiveness
