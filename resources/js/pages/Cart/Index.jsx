// File: resources/js/Pages/Cart/Index.jsx

import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useToast } from '@/Components/GlobalToastProvider';
import { useState } from 'react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function CartIndex({ cartItems }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState({});

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setLoading(prev => ({ ...prev, [cartId]: true }));
        try {
            await window.axios.put(`/cart/${cartId}`, { quantity: newQuantity });
            router.reload();
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
            router.reload();
            showToast('Item removed from cart');
            window.dispatchEvent(new Event('cart-updated'));
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
        <MainLayout>
            <Head title="Shopping Cart - Avhira" />
            
            <div className="bg-avhira-bg min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Add some items to get started!</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    let imageUrl = 'https://via.placeholder.com/150x150.png?text=No+Image';
                                    
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
                                        <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 flex gap-6">
                                            {/* Product Image */}
                                            <Link href={`/products/${product.slug}`} className="flex-shrink-0">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        className="text-lg font-semibold text-gray-900 hover:text-avhira-red transition-colors"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    
                                                    {item.size && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Size: <span className="font-medium">{item.size}</span>
                                                        </p>
                                                    )}

                                                    <div className="mt-2 flex items-center gap-3">
                                                        {(() => {
                                                            const priceNum = parseFloat(product.price) || 0;
                                                            const saleRaw = product.sale_price;
                                                            const saleNum = (saleRaw !== null && saleRaw !== undefined && saleRaw !== '') ? parseFloat(saleRaw) : null;
                                                            const hasValidSale = (saleNum !== null && !isNaN(saleNum) && saleNum < priceNum);

                                                            if (hasValidSale) {
                                                                return (
                                                                    <>
                                                                        <span className="text-sm text-gray-500 line-through">
                                                                            {formatPrice(priceNum)}
                                                                        </span>
                                                                        <span className="text-lg font-bold text-avhira-red">
                                                                            {formatPrice(saleNum)}
                                                                        </span>
                                                                    </>
                                                                );
                                                            }

                                                            return (
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {formatPrice(priceNum)}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={loading[item.id] || item.quantity <= 1}
                                                            className="px-3 py-1.5 text-gray-600 hover:text-avhira-red hover:bg-avhira-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="px-4 py-1.5 text-gray-900 font-medium border-x border-gray-300">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={loading[item.id]}
                                                            className="px-3 py-1.5 text-gray-600 hover:text-avhira-red hover:bg-avhira-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={loading[item.id]}
                                                        className="text-gray-500 hover:text-avhira-red transition-colors disabled:opacity-50"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium">{formatPrice(originalSubtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="font-medium">{formatPrice(shipping)}</span>
                                        </div>
                                        {totalDiscount > 0 && (
                                            <div className="flex justify-between text-green-700">
                                                <span>Total Discount</span>
                                                <span className="font-medium">{formatPrice(totalDiscount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="block w-full text-center py-3 px-4 rounded-lg font-semibold shadow-lg transition-all mb-3"
                                        style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // If user is authenticated, go directly to checkout
                                            try {
                                                const auth = window.page?.props?.auth;
                                                if (auth && auth.user) {
                                                    router.visit('/checkout');
                                                    return;
                                                }
                                            } catch (err) {
                                                // ignore
                                            }

                                            // Guest: save redirect and cart contents so we can restore after login
                                            try {
                                                sessionStorage.setItem('postAuthRedirect', '/checkout');
                                                const toSave = cartItems.map(i => ({ product_id: i.product.id, quantity: i.quantity, size: i.size || null }));
                                                sessionStorage.setItem('guestCartToRestore', JSON.stringify(toSave));
                                            } catch (e) {}
                                            window.dispatchEvent(new Event('open-auth-modal'));
                                        }}
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <Link
                                        href="/products"
                                        className="block w-full text-center py-3 px-4 rounded-lg font-semibold border-2 border-avhira-red text-avhira-red hover:bg-avhira-bg transition-all"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
