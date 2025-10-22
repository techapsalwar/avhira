// File: resources/js/Pages/Dashboard.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ user, activeOrder, deliveredOrders }) {
    // Use modern Lucide/Feather SVG icons for a premium look
    const orderStatuses = [
        {
            key: 'pending',
            label: 'Order Placed',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" className="fill-avhira-red/10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M12 14v4m0 0l-2-2m2 2l2-2" />
                </svg>
            )
        },
        {
            key: 'processing',
            label: 'Processing',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" className="fill-avhira-red/10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
            )
        },
        {
            key: 'shipped',
            label: 'Shipped',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="10" rx="3" className="fill-avhira-red/10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l10 5 10-5" />
                </svg>
            )
        },
        {
            key: 'delivered',
            label: 'Delivered',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" className="fill-avhira-red/10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
            )
        }
    ];

    const getStatusIndex = (status) => {
        return orderStatuses.findIndex(s => s.key === status);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-600">Manage your orders and account settings</p>
                    </div>

                    {/* Active Order Section */}
                    {activeOrder && (
                        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Order</h2>

                            {/* Order Info */}
                            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order Number</p>
                                            <p className="font-semibold text-lg">#{activeOrder.order_number || activeOrder.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-semibold">{formatDate(activeOrder.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="font-semibold text-lg text-avhira-red">{formatPrice(activeOrder.total_amount || activeOrder.total)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Stepper */}
                            <div className="relative">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
                                <div className="flex items-center justify-between relative">
                                    {/* Gradient connecting line behind steps */}
                                    <div className="absolute top-1/2 left-0 right-0 h-2 z-0 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" style={{ transform: 'translateY(-50%)' }} />
                                    {/* Animated progress gradient line */}
                                    <div
                                        className="absolute top-1/2 left-0 h-2 z-10 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(getStatusIndex(activeOrder.status)) / (orderStatuses.length - 1) * 100}%`,
                                            background: 'linear-gradient(90deg, #be1e2d 0%, #ff6a6a 100%)',
                                            boxShadow: '0 0 12px 2px rgba(190, 30, 45, 0.5)',
                                            transform: 'translateY(-50%)',
                                        }}
                                    />
                                    {orderStatuses.map((status, index) => {
                                        const isCompleted = getStatusIndex(activeOrder.status) > index;
                                        const isCurrent = activeOrder.status === status.key;
                                        const isLast = index === orderStatuses.length - 1;
                                        return (
                                            <div key={status.key} className="flex flex-col items-center flex-1 z-20 relative">
                                                {/* Step Circle with animation and shadow */}
                                                <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-2 border-4 transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'bg-gradient-to-br from-avhira-red to-[#ff6a6a] border-avhira-red shadow-xl scale-110 text-white'
                                                        : isCurrent
                                                            ? 'bg-white border-avhira-red text-avhira-red shadow-md scale-105 animate-pulse'
                                                            : 'bg-gray-100 border-gray-300 text-gray-400 opacity-70'
                                                }`}>
                                                    {status.icon}
                                                </div>
                                                {/* Step Label */}
                                                <p className={`text-xs sm:text-sm font-semibold text-center mt-1 ${
                                                    isCompleted || isCurrent ? 'text-avhira-red' : 'text-gray-400'
                                                }`}>
                                                    {status.label}
                                                </p>
                                                {/* Connector dot for all but last */}
                                                {!isLast && (
                                                    <div className="absolute right-0 top-1/2 w-3 h-3 bg-white border-2 border-avhira-red rounded-full z-30" style={{ transform: 'translateY(-50%) translateX(50%)' }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Previous Orders Section */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Previous Orders</h2>
                            {deliveredOrders && deliveredOrders.length > 0 && (
                                <Link
                                    href="/orders"
                                    className="text-avhira-red hover:text-avhira-red/80 font-semibold text-sm"
                                >
                                    View All Orders →
                                </Link>
                            )}
                        </div>

                        {deliveredOrders && deliveredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {deliveredOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-900">
                                                        Order #{order.order_number || order.id}
                                                    </h3>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✅ Delivered
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Ordered:</span> {formatDate(order.created_at)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Delivered:</span> {formatDate(order.updated_at)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Total:</span> {formatPrice(order.total_amount || order.total)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                                <button className="px-4 py-2 bg-avhira-red hover:bg-avhira-red/90 text-white rounded-lg font-medium transition-colors">
                                                    Buy Again
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {deliveredOrders.length > 5 && (
                                    <div className="text-center pt-4">
                                        <Link
                                            href="/orders"
                                            className="text-avhira-red hover:text-avhira-red/80 font-semibold"
                                        >
                                            View {deliveredOrders.length - 5} more orders →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No previous orders</h3>
                                <p className="text-gray-600 mb-6">Your delivered orders will appear here</p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center px-6 py-3 bg-avhira-red text-white rounded-lg font-medium hover:bg-avhira-red/90 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-8 mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/products"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Browse Products</h3>
                                    <p className="text-sm text-gray-600">Explore our collection</p>
                                </div>
                            </Link>

                            <Link
                                href="/cart"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                                    <p className="text-sm text-gray-600">View your cart</p>
                                </div>
                            </Link>

                            <Link
                                href="/profile"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                                    <p className="text-sm text-gray-600">Manage your account</p>
                                </div>
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Account Settings</h3>
                                    <p className="text-sm text-gray-600">Update preferences</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
