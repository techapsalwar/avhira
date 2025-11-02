// File: resources/js/Pages/Dashboard.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Dashboard({ user, activeOrder, deliveredOrders = [], cancelledOrders = [] }) {
    const [showActiveDetails, setShowActiveDetails] = useState(false);
    
    const orderStatuses = [
        {
            key: 'pending',
            label: 'Placed',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
            ),
        },
        {
            key: 'processing',
            label: 'Processing',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
            ),
        },
        {
            key: 'shipped',
            label: 'Shipped',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
            ),
        },
        {
            key: 'delivered',
            label: 'Delivered',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
            ),
        },
    ];

    const sortedDelivered = useMemo(() => {
        return [...deliveredOrders].sort((a, b) => {
            return new Date(b.updated_at ?? b.created_at ?? 0).getTime() - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
        });
    }, [deliveredOrders]);

    const sortedCancelled = useMemo(() => {
        return [...cancelledOrders].sort((a, b) => {
            return new Date(b.updated_at ?? b.created_at ?? 0).getTime() - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
        });
    }, [cancelledOrders]);

    const formatDate = (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatPrice = (value) => {
        if (!value && value !== 0) return '—';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getStatusIndex = (status) => {
        const index = orderStatuses.findIndex((stage) => stage.key === status);
        return index >= 0 ? index : 0;
    };

    const currentStatusIndex = activeOrder ? getStatusIndex(activeOrder.status) : 0;
    const statusProgress = orderStatuses.length > 1 ? (currentStatusIndex / (orderStatuses.length - 1)) * 100 : 0;

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    {/* Mobile-optimized Header */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#be1e2d] to-[#9a1824] p-6 text-white shadow-lg sm:p-8">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Hi, {user?.name?.split(' ')[0] ?? 'there'}!
                        </h1>
                        <p className="mt-2 text-sm text-white/90 sm:text-base">
                            Track your orders and manage your account
                        </p>
                    </div>

                    {/* Active Order Card */}
                    {activeOrder ? (
                        <div className="mb-6 rounded-2xl bg-white p-5 shadow-md sm:p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Active Order</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        #{activeOrder.order_number ?? activeOrder.id}
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#be1e2d]/10 px-3 py-1 text-xs font-semibold text-[#be1e2d]">
                                    {orderStatuses[currentStatusIndex].label}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative mb-6">
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#be1e2d] to-[#ff6a6a] transition-all duration-500"
                                        style={{ width: `${statusProgress}%` }}
                                    />
                                </div>
                                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                                    {orderStatuses.map((status, index) => {
                                        const isActive = index <= currentStatusIndex;
                                        return (
                                            <div key={status.key} className="flex flex-col items-center">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                                                        isActive
                                                            ? 'bg-[#be1e2d] text-white'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {status.icon}
                                                </div>
                                                <p
                                                    className={`mt-2 text-xs font-medium ${
                                                        isActive ? 'text-[#be1e2d]' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {status.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date</span>
                                    <span className="font-medium text-gray-900">
                                        {formatDate(activeOrder.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="font-semibold text-[#be1e2d]">
                                        {formatPrice(activeOrder.total_amount ?? activeOrder.total)}
                                    </span>
                                </div>
                            </div>

                            {/* View Details Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowActiveDetails((prev) => !prev)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                {showActiveDetails ? 'Hide Details' : 'View Details'}
                                <svg
                                    className={`h-4 w-4 transition-transform ${showActiveDetails ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Expanded Details */}
                            {showActiveDetails && (
                                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                                    {(activeOrder?.shipping_address ?? activeOrder?.address) && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Shipping Address
                                            </p>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {activeOrder.shipping_address ?? activeOrder.address}
                                            </p>
                                        </div>
                                    )}
                                    {(activeOrder?.payment_method ?? activeOrder?.payment_mode) && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Payment Method
                                            </p>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {activeOrder.payment_method ?? activeOrder.payment_mode}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
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
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Active Orders</h3>
                            <p className="mt-2 text-sm text-gray-600">Start shopping to see your orders here</p>
                            <Link
                                href="/products"
                                className="mt-4 inline-flex items-center rounded-full bg-[#be1e2d] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a1824]"
                            >
                                Browse Products
                            </Link>
                        </div>
                    )}

                    {/* Quick Actions Grid */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                        <Link
                            href="/products"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#be1e2d]/10 text-[#be1e2d]">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                            <p className="mt-2 text-center text-xs font-medium text-gray-900">Shop</p>
                        </Link>

                        <Link
                            href="/profile"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#be1e2d]/10 text-[#be1e2d]">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="mt-2 text-center text-xs font-medium text-gray-900">Profile</p>
                        </Link>

                        <Link
                            href="/cart"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#be1e2d]/10 text-[#be1e2d]">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <p className="mt-2 text-center text-xs font-medium text-gray-900">Cart</p>
                        </Link>

                        <Link
                            href="/settings"
                            className="flex flex-col items-center rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#be1e2d]/10 text-[#be1e2d]">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="mt-2 text-center text-xs font-medium text-gray-900">Settings</p>
                        </Link>
                    </div>

                    {/* Recent Orders */}
                    {sortedDelivered.length > 0 && (
                        <div className="mb-6 rounded-2xl bg-white p-5 shadow-md sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Recent Orders</h2>
                                <Link href="/orders" className="text-sm font-semibold text-[#be1e2d] hover:text-[#9a1824]">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {sortedDelivered.slice(0, 3).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                #{order.order_number ?? order.id}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(order.total_amount ?? order.total)}
                                            </p>
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                Delivered
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cancelled Orders */}
                    {sortedCancelled.length > 0 && (
                        <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
                            <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Cancelled Orders</h2>
                            <div className="space-y-3">
                                {sortedCancelled.slice(0, 3).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                #{order.order_number ?? order.id}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(order.updated_at ?? order.cancelled_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(order.total_amount ?? order.total)}
                                            </p>
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                                Cancelled
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
