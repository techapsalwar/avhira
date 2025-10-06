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

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.sale_price || item.product.price;
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 0 ? 100 : 0;
    const total = subtotal + shipping;

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
                className={`fixed bottom-0 left-0 md:top-0 md:right-0 md:left-auto md:bottom-auto h-1/2 md:h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-t-3xl md:rounded-none ${
                    isOpen ? 'translate-y-0 md:translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200"
                         style={{ backgroundColor: '#faf5f6' }}>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Shopping Cart
                            {cartItems.length > 0 && (
                                <span className="ml-2 text-sm font-normal text-gray-600">
                                    ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
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
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    let imageUrl = 'https://via.placeholder.com/100x100.png?text=No+Image';
                                    
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
                                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            {/* Product Image */}
                                            <Link 
                                                href={`/products/${product.slug}`} 
                                                onClick={onClose}
                                                className="flex-shrink-0"
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    onClick={onClose}
                                                    className="font-semibold text-gray-900 hover:text-avhira-red transition-colors line-clamp-2"
                                                >
                                                    {product.name}
                                                </Link>
                                                
                                                {item.size && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Size: <span className="font-medium">{item.size}</span>
                                                    </p>
                                                )}

                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {product.sale_price && product.sale_price < product.price ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                                <span className="font-bold"
                                                                      style={{ color: '#be1e2d' }}>
                                                                    {formatPrice(product.sale_price)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold text-gray-900">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
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

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={loading[item.id] || item.quantity <= 1}
                                                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-white hover:border-avhira-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-10 text-center font-medium text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={loading[item.id]}
                                                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-white hover:border-avhira-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer - Order Summary & Checkout */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4 space-y-4"
                             style={{ backgroundColor: '#faf5f6' }}>
                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">{formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
                                    <span>Total</span>
                                    <span style={{ color: '#be1e2d' }}>{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="block w-full text-center px-6 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                                    style={{ backgroundColor: '#be1e2d' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="block w-full text-center px-6 py-3 rounded-full font-semibold border-2 transition-all hover:bg-white"
                                    style={{ 
                                        borderColor: '#be1e2d',
                                        color: '#be1e2d'
                                    }}
                                >
                                    View Full Cart
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
