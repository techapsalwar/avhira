// File: resources/js/Components/CartSlider.jsx

import { Link, router } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';
import { useState, useEffect } from 'react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function CartSlider({ isOpen, onClose }) {
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState({});
    const [fetchingCart, setFetchingCart] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
        }
    }, [isOpen]);

    const fetchCartItems = async () => {
        setFetchingCart(true);
        try {
            const response = await window.axios.get('/cart/items');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            showToast('Failed to load cart');
        } finally {
            setFetchingCart(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setLoading(prev => ({ ...prev, [cartId]: true }));
        try {
            await window.axios.put(`/cart/${cartId}`, { quantity: newQuantity });
            await fetchCartItems();
            window.dispatchEvent(new Event('cart-updated'));
            showToast('Cart updated');
        } catch (err) {
            showToast('Failed to update cart');
        } finally {
            setLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    const removeItem = async (cartId) => {
        setLoading(prev => ({ ...prev, [cartId]: true }));
        try {
            await window.axios.delete(`/cart/${cartId}`);
            await fetchCartItems();
            window.dispatchEvent(new Event('cart-updated'));
            showToast('Item removed from cart');
        } catch (err) {
            showToast('Failed to remove item');
        } finally {
            setLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    // Calculate totals robustly (handle string prices, missing sale_price)
    const originalSubtotal = cartItems.reduce((sum, item) => {
        const priceNum = parseFloat(item.product.price) || 0;
        return sum + (priceNum * item.quantity);
    }, 0);

    const discountedSubtotal = cartItems.reduce((sum, item) => {
        const priceNum = parseFloat(item.product.price) || 0;
        const saleNumRaw = item.product.sale_price;
        const saleNum = (saleNumRaw !== null && saleNumRaw !== undefined && saleNumRaw !== '') ? parseFloat(saleNumRaw) : null;
        const effective = (saleNum !== null && !isNaN(saleNum) && saleNum < priceNum) ? saleNum : priceNum;
        return sum + (effective * item.quantity);
    }, 0);

    const totalDiscount = Math.max(0, originalSubtotal - discountedSubtotal);

    const shipping = discountedSubtotal > 0 ? 0 : 0; // keep same shipping logic for now
    const total = discountedSubtotal + shipping;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Slider Panel */}
            <div 
                className={`fixed bottom-0 left-0 md:top-0 md:right-0 md:left-auto md:bottom-auto h-[50vh] md:h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-t-3xl md:rounded-none overflow-hidden ${
                    isOpen ? 'translate-y-0 md:translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header - Minimalistic */}
                    <div className="flex-shrink-0 flex items-center justify-center py-2 md:py-3 border-b border-gray-200 relative"
                         style={{ backgroundColor: '#faf5f6' }}>
                        {/* Cart count badge - left side */}
                        <div className="absolute left-4 md:left-6">
                            {cartItems.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="text-sm md:text-base font-bold text-gray-900">
                                        {cartItems.length}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Animated down arrow - center */}
                        <button
                            onClick={onClose}
                            className="flex flex-col items-center justify-center group"
                        >
                            <svg className="w-6 h-6 text-gray-600 animate-bounce group-hover:text-[#be1e2d] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                            <svg className="w-6 h-6 text-gray-600 -mt-3 animate-bounce group-hover:text-[#be1e2d] transition-colors" style={{ animationDelay: '150ms' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Close X button - right side (desktop) */}
                        <button
                            onClick={onClose}
                            className="hidden md:flex absolute right-6 p-2 rounded-full hover:bg-white transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 md:py-4 min-h-0">
                        {fetchingCart ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2"
                                     style={{ borderColor: '#be1e2d' }} />
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-600 mb-6">Add some items to get started!</p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105"
                                    style={{ backgroundColor: '#be1e2d' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 md:space-y-4">
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    const svgPlaceholder100 = `data:image/svg+xml;utf8,${encodeURIComponent(`
                                        <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
                                            <rect width='100%' height='100%' fill='%23f3f4f6' />
                                            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='10'>No Image</text>
                                        </svg>
                                    `)}`;
                                    let imageUrl = svgPlaceholder100;
                                    
                                    try {
                                        const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                                        if (Array.isArray(images) && images.length > 0) {
                                            imageUrl = `/storage/${images[0].replace(/\\/g, '')}`;
                                        }
                                    } catch (e) {
                                        console.error("Failed to parse product images:", e);
                                    }

                                    const price = product.sale_price || product.price;

                                    return (
                                        <div key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors relative">
                                            {/* Product Image */}
                                            <Link 
                                                href={`/products/${product.slug}`} 
                                                onClick={onClose}
                                                className="flex-shrink-0"
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0 pr-12">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    onClick={onClose}
                                                    className="text-sm md:text-base font-semibold text-gray-900 hover:text-avhira-red transition-colors line-clamp-2"
                                                >
                                                    {product.name}
                                                </Link>
                                                
                                                {item.size && (
                                                    <p className="text-xs text-gray-600 mt-0.5 md:mt-1">
                                                        Size: <span className="font-medium">{item.size}</span>
                                                    </p>
                                                )}

                                                        <div className="mt-1.5 md:mt-2">
                                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                                {(() => {
                                                                    const priceNum = parseFloat(product.price) || 0;
                                                                    const saleRaw = product.sale_price;
                                                                    const saleNum = (saleRaw !== null && saleRaw !== undefined && saleRaw !== '') ? parseFloat(saleRaw) : null;
                                                                    const hasValidSale = (saleNum !== null && !isNaN(saleNum) && saleNum < priceNum);

                                                                    if (hasValidSale) {
                                                                        return (
                                                                            <>
                                                                                <span className="text-xs text-gray-500 line-through">
                                                                                    {formatPrice(priceNum)}
                                                                                </span>
                                                                                <span className="text-sm md:text-base font-bold" style={{ color: '#be1e2d' }}>
                                                                                    {formatPrice(saleNum)}
                                                                                </span>
                                                                            </>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <span className="text-sm md:text-base font-bold text-gray-900">
                                                                            {formatPrice(priceNum)}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                            </div>

                                            {/* Right Side Controls (Stacked) */}
                                            <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col items-end gap-2">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={loading[item.id] || item.quantity <= 1}
                                                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-white hover:border-avhira-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-6 md:w-7 text-center text-xs md:text-sm font-medium text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={loading[item.id]}
                                                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-white hover:border-avhira-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={loading[item.id]}
                                                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    title="Remove item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer - Compact Order Summary & Checkout */}
                    {cartItems.length > 0 && (
                        <div className="flex-shrink-0 border-t border-gray-200 px-4 md:px-6 py-2.5 md:py-3"
                             style={{ backgroundColor: '#faf5f6' }}>
                            {/* Totals - Single Line with discount */}
                            <div className="flex items-center justify-between mb-2.5">
                                <div className="flex flex-col text-xs md:text-sm text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <span>Subtotal: <span className="font-medium text-gray-900">{formatPrice(originalSubtotal)}</span></span>
                                        <span>•</span>
                                        <span>Shipping: <span className="font-medium text-gray-900">{formatPrice(shipping)}</span></span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="text-sm text-green-700 mt-1">
                                            You saved <span className="font-semibold">{formatPrice(totalDiscount)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-base md:text-lg font-bold" style={{ color: '#be1e2d' }}>
                                    {formatPrice(total)}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="flex-1 text-center px-4 md:px-6 py-3.5 md:py-4 rounded-full text-sm md:text-base font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                                    style={{ backgroundColor: '#be1e2d' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                >
                                    Checkout
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex-none text-center px-4 md:px-5 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold border-2 transition-all hover:bg-white"
                                    style={{ 
                                        borderColor: '#be1e2d',
                                        color: '#be1e2d'
                                    }}
                                >
                                    Cart
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
