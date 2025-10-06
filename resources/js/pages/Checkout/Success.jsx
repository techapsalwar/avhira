// File: resources/js/Pages/Checkout/Success.jsx

import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function CheckoutSuccess({ order }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <MainLayout>
            <Head title="Order Confirmed - Avhira" />

            <div className="min-h-screen py-12" style={{ backgroundColor: '#faf5f6' }}>
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Success Animation */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-bounce">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            Order Confirmed! 🎉
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Thank you for your purchase
                        </p>
                        <p className="text-sm text-gray-500">
                            Order #{order.order_number}
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

                        {/* Order Items */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                            {order.order_items.map((item) => {
                                const imageUrl = (() => {
                                    try {
                                        const images = typeof item.product?.images === 'string'
                                            ? JSON.parse(item.product.images)
                                            : item.product?.images;
                                        return Array.isArray(images) && images.length > 0
                                            ? `/storage/${images[0].replace(/\\/g, '')}`
                                            : 'https://via.placeholder.com/80x80.png?text=Product';
                                    } catch {
                                        return 'https://via.placeholder.com/80x80.png?text=Product';
                                    }
                                })();

                                return (
                                    <div key={item.id} className="flex gap-4">
                                        <img
                                            src={imageUrl}
                                            alt={item.product_name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            {item.size && (
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            )}
                                            <p className="text-lg font-bold text-avhira-red mt-1">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
                            <div className="text-gray-600">
                                <p>{order.shipping_address}</p>
                                <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                                <p className="mt-2">Phone: {order.phone}</p>
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span style={{ color: '#be1e2d' }}>{formatPrice(order.total_amount)}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Payment Status: <span className="text-green-600 font-medium">Completed</span>
                            </p>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-avhira-red text-white flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-900">Order Confirmation</p>
                                    <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-900">Order Processing</p>
                                    <p className="text-sm text-gray-600">We'll prepare your items for shipping</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-900">Shipping</p>
                                    <p className="text-sm text-gray-600">You'll receive tracking information once shipped</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/products"
                            className="flex-1 text-center py-4 px-6 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                            style={{ backgroundColor: '#be1e2d' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href={`/orders/${order.id}`}
                            className="flex-1 text-center py-4 px-6 rounded-full font-bold border-2 transition-all hover:bg-gray-50"
                            style={{ borderColor: '#be1e2d', color: '#be1e2d' }}
                        >
                            View Order Details
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
