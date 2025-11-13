import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Dashboard({ user, activeOrder, deliveredOrders = [], cancelledOrders = [] }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orderStatuses = [
        { key: 'pending', label: 'Placed', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { key: 'processing', label: 'Processing', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { key: 'shipped', label: 'Shipped', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { key: 'delivered', label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100' },
    ];

    const recentOrders = useMemo(() => {
        return [...deliveredOrders]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    }, [deliveredOrders]);

    const recentCancelled = useMemo(() => {
        return [...cancelledOrders]
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 3);
    }, [cancelledOrders]);

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateTime = (date) => {
        if (!date) return '—';
        const d = new Date(date);
        return `${d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })} at ${d.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })}`;
    };

    const formatPrice = (amount) => {
        if (!amount && amount !== 0) return '—';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getStatusInfo = (status) => {
        return orderStatuses.find((s) => s.key === status) || orderStatuses[0];
    };

    const getStatusIndex = (status) => {
        return orderStatuses.findIndex((s) => s.key === status);
    };

    const stats = useMemo(() => {
        const totalOrders = (deliveredOrders?.length || 0) + (cancelledOrders?.length || 0) + (activeOrder ? 1 : 0);
        const totalSpent = deliveredOrders?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0;

        return {
            totalOrders,
            totalSpent,
            delivered: deliveredOrders?.length || 0,
            cancelled: cancelledOrders?.length || 0,
            active: activeOrder ? 1 : 0,
        };
    }, [deliveredOrders, cancelledOrders, activeOrder]);

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#be1e2d] to-[#8b1520] p-6 text-white shadow-lg sm:p-8">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                            </h1>
                            <p className="mt-2 text-sm text-white/90 sm:text-base">
                                Track your orders and manage your acco
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <p className="text-xs text-gray-600 sm:text-sm">Total Orders</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <p className="text-xs text-gray-600 sm:text-sm">Active</p>
                                <p className="mt-1 text-2xl font-bold text-[#be1e2d]">{stats.active}</p>
                            </div>
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <p className="text-xs text-gray-600 sm:text-sm">Delivered</p>
                                <p className="mt-1 text-2xl font-bold text-green-600">{stats.delivered}</p>
                            </div>
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <p className="text-xs text-gray-600 sm:text-sm">Total Spent</p>
                                <p className="mt-1 text-lg font-bold text-gray-900 sm:text-2xl">{formatPrice(stats.totalSpent)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {activeOrder ? (
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Active Order</h2>
                                            <p className="mt-1 text-sm text-gray-600">Order #{activeOrder.order_number}</p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                getStatusInfo(activeOrder.status).bgColor
                                            } ${getStatusInfo(activeOrder.status).color}`}
                                        >
                                            {getStatusInfo(activeOrder.status).label}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <div className="relative">
                                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#be1e2d] to-[#ff6b6b] transition-all duration-500"
                                                    style={{
                                                        width: `${((getStatusIndex(activeOrder.status) + 1) / orderStatuses.length) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {orderStatuses.map((status, idx) => (
                                                <div key={status.key} className="text-center">
                                                    <div
                                                        className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                                            idx <= getStatusIndex(activeOrder.status)
                                                                ? 'bg-[#be1e2d] text-white'
                                                                : 'bg-gray-200 text-gray-400'
                                                        }`}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    <p
                                                        className={`text-xs font-medium ${
                                                            idx <= getStatusIndex(activeOrder.status)
                                                                ? 'text-[#be1e2d]'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {status.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Order Date</span>
                                            <span className="font-medium text-gray-900">{formatDate(activeOrder.created_at)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Items</span>
                                            <span className="font-medium text-gray-900">
                                                {activeOrder.order_items?.length || 0} item(s)
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-3">
                                            <span className="font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-lg font-bold text-[#be1e2d]">
                                                {formatPrice(activeOrder.total_amount)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedOrder(activeOrder)}
                                        className="mt-4 w-full rounded-lg bg-[#be1e2d] py-3 font-semibold text-white transition hover:bg-[#9a1824]"
                                    >
                                        View Full Order Details
                                    </button>
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <svg
                                            className="h-8 w-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">No Active Orders</h3>
                                    <p className="mt-2 text-sm text-gray-600">Start shopping to place your first order</p>
                                    <Link
                                        href="/products"
                                        className="mt-4 inline-flex items-center rounded-full bg-[#be1e2d] px-6 py-3 font-semibold text-white transition hover:bg-[#9a1824]"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            )}

                            {recentOrders.length > 0 && (
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                                        {deliveredOrders.length > 5 && (
                                            <Link href="/orders" className="text-sm font-semibold text-[#be1e2d] hover:underline">
                                                View All
                                            </Link>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-[#be1e2d] hover:bg-gray-50"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">#{order.order_number}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                                                    <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                        Delivered
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="ml-4 rounded-lg border border-[#be1e2d] px-4 py-2 text-sm font-semibold text-[#be1e2d] transition hover:bg-[#be1e2d] hover:text-white"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recentCancelled.length > 0 && (
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900">Cancelled Orders</h2>
                                    <div className="space-y-3">
                                        {recentCancelled.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">#{order.order_number}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.updated_at)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                                                    <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                                        Cancelled
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="ml-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link
                                        href="/products"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-[#be1e2d] hover:bg-gray-50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#be1e2d]/10">
                                            <svg
                                                className="h-5 w-5 text-[#be1e2d]"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">Shop Products</p>
                                            <p className="text-xs text-gray-600">Browse our collection</p>
                                        </div>
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-[#be1e2d] hover:bg-gray-50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#be1e2d]/10">
                                            <svg
                                                className="h-5 w-5 text-[#be1e2d]"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">View Cart</p>
                                            <p className="text-xs text-gray-600">Check your items</p>
                                        </div>
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-[#be1e2d] hover:bg-gray-50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#be1e2d]/10">
                                            <svg
                                                className="h-5 w-5 text-[#be1e2d]"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">My Profile</p>
                                            <p className="text-xs text-gray-600">Update your details</p>
                                        </div>
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-lg font-bold text-gray-900">Account Info</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#be1e2d] text-lg font-bold text-white">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedOrder && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <div
                            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.order_number}</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                                                getStatusInfo(selectedOrder.status).bgColor
                                            } ${getStatusInfo(selectedOrder.status).color}`}
                                        >
                                            {getStatusInfo(selectedOrder.status).label}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order Number</p>
                                        <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{selectedOrder.order_number}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Placed On</p>
                                        <p className="mt-1 text-sm font-medium text-gray-900">{formatDateTime(selectedOrder.created_at)}</p>
                                    </div>
                                    {selectedOrder.updated_at && selectedOrder.status !== 'pending' && (
                                        <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last Updated</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{formatDateTime(selectedOrder.updated_at)}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                                        Order Items ({selectedOrder.order_items?.length || 0})
                                    </h3>
                                    {(selectedOrder.order_items || []).length === 0 ? (
                                        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                                            <p className="text-sm text-gray-500">No items found in this order</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {(selectedOrder.order_items || []).map((item, index) => (
                                                <div key={item.id || index} className="flex gap-4 rounded-lg border border-gray-200 p-4">
                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                        {item.product?.images?.[0] ? (
                                                            <img
                                                                src={`/storage/${item.product.images[0]}`}
                                                                alt={item.product_name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                                <svg
                                                                    className="h-10 w-10"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                                                        {item.product?.description && (
                                                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.product.description}</p>
                                                        )}
                                                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                                            {item.size && (
                                                                <span className="text-gray-600">
                                                                    <span className="font-medium">Size:</span> {item.size}
                                                                </span>
                                                            )}
                                                            <span className="text-gray-600">
                                                                <span className="font-medium">Qty:</span> {item.quantity}
                                                            </span>
                                                            <span className="font-semibold text-[#be1e2d]">
                                                                {formatPrice(item.price)} each
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xs uppercase text-gray-500">Subtotal</p>
                                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                                    <h3 className="mb-3 font-bold text-gray-900">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">{formatPrice(selectedOrder.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium text-gray-900">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-300 pt-2">
                                            <span className="text-base font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-[#be1e2d]">{formatPrice(selectedOrder.total_amount)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {selectedOrder.shipping_address && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Shipping Address</p>
                                            <p className="mt-2 text-sm text-gray-900">{selectedOrder.shipping_address}</p>
                                        </div>
                                    )}
                                    {selectedOrder.payment_method && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment Method</p>
                                            <p className="mt-2 text-sm font-medium text-gray-900">{selectedOrder.payment_method}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-900 transition hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
