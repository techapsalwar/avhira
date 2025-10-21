// File: resources/js/Pages/Admin/Dashboard.jsx

import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function Dashboard({ stats, revenueData, topProducts, recentOrders, categorySales, maintenanceMode }) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(maintenanceMode || false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');

    // Calculate revenue trend
    const revenueTrend = useMemo(() => {
        if (!revenueData || revenueData.length < 2) return 0;
        const lastTwo = revenueData.slice(-2);
        if (lastTwo.length < 2) return 0;
        const change = ((lastTwo[1].revenue - lastTwo[0].revenue) / lastTwo[0].revenue) * 100;
        return isFinite(change) ? change.toFixed(1) : 0;
    }, [revenueData]);

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatPrice(stats.total_revenue),
            icon: '💰',
            color: '#be1e2d',
            bgColor: '#faf5f6',
            trend: revenueTrend,
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: '📦',
            color: '#2563eb',
            bgColor: '#eff6ff',
            badge: `${stats.pending_orders} pending`,
        },
        {
            title: 'Products',
            value: stats.total_products,
            icon: '👕',
            color: '#16a34a',
            bgColor: '#f0fdf4',
            badge: `${stats.low_stock_products} low stock`,
        },
        {
            title: 'Customers',
            value: stats.total_users,
            icon: '👥',
            color: '#9333ea',
            bgColor: '#faf5ff',
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const toggleMaintenanceMode = () => {
        if (!isMaintenanceMode) {
            // Show modal to confirm and optionally add message
            setShowMaintenanceModal(true);
        } else {
            // Directly disable
            router.post('/admin/maintenance/toggle', {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsMaintenanceMode(false);
                    toast.success('Maintenance mode disabled', {
                        style: {
                            background: '#be1e2d',
                            color: '#faf5f6',
                        },
                    });
                },
            });
        }
    };

    const enableMaintenanceMode = () => {
        router.post('/admin/maintenance/toggle', { message: maintenanceMessage }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsMaintenanceMode(true);
                setShowMaintenanceModal(false);
                setMaintenanceMessage('');
                toast.success('Maintenance mode enabled', {
                    style: {
                        background: '#be1e2d',
                        color: '#faf5f6',
                    },
                });
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard - Avhira" />

            <div className="space-y-6">
                {/* Welcome Section with Maintenance Toggle */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#be1e2d' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Welcome to Avhira Admin</h2>
                            <p className="text-gray-600 mt-1">Manage your clothing store with ease</p>
                        </div>
                        
                        {/* Maintenance Mode Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
                                <p className="text-xs text-gray-500">
                                    {isMaintenanceMode ? 'Site is offline' : 'Site is online'}
                                </p>
                            </div>
                            <button
                                onClick={toggleMaintenanceMode}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    isMaintenanceMode 
                                        ? 'bg-gray-300 focus:ring-gray-400' 
                                        : 'bg-gray-300 focus:ring-gray-400'
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                        isMaintenanceMode ? 'translate-x-7' : 'translate-x-1' 
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card, index) => (
                        <div key={index} className="bg-white overflow-hidden shadow-md rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                        {card.badge && (
                                            <p className="text-xs text-gray-500 mt-2">{card.badge}</p>
                                        )}
                                        {card.trend !== undefined && (
                                            <p className={`text-xs mt-2 ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {card.trend >= 0 ? '↑' : '↓'} {Math.abs(card.trend)}% from yesterday
                                            </p>
                                        )}
                                    </div>
                                    <div 
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: card.bgColor, color: card.color }}
                                    >
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Revenue Chart & Category Sales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
                        {revenueData && revenueData.length > 0 ? (
                            <div className="space-y-3">
                                {revenueData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 w-24">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className="flex-1 bg-avhira-bg rounded-full h-8 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full flex items-center px-3 text-xs font-semibold transition-all"
                                                style={{ 
                                                    backgroundColor: '#be1e2d',
                                                    color: '#faf5f6',
                                                    width: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%`,
                                                    minWidth: '60px'
                                                }}
                                            >
                                                {formatPrice(item.revenue)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No revenue data available</p>
                        )}
                    </div>

                    {/* Category Sales */}
                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h3>
                        {categorySales && categorySales.length > 0 ? (
                            <div className="space-y-3">
                                {categorySales.map((item, index) => {
                                    const colors = ['#be1e2d', '#2563eb', '#16a34a', '#9333ea', '#f59e0b'];
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="text-sm text-gray-900 font-medium w-24 truncate">{item.name}</span>
                                            <div className="flex-1 bg-avhira-bg rounded-full h-8 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full flex items-center px-3 text-xs font-semibold text-white transition-all"
                                                    style={{ 
                                                        backgroundColor: color,
                                                        width: `${(item.total_sold / Math.max(...categorySales.map(c => c.total_sold))) * 100}%`,
                                                        minWidth: '50px'
                                                    }}
                                                >
                                                    {item.total_sold} sold
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">No sales data available</p>
                        )}
                    </div>
                </div>

                {/* Top Products & Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Selling Products */}
                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                            <Link href="/admin/products" className="text-sm font-medium hover:underline" style={{ color: '#be1e2d' }}>
                                View All →
                            </Link>
                        </div>
                        {topProducts && topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {topProducts.map((product, index) => (
                                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-avhira-bg transition-colors">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                             style={{ backgroundColor: '#be1e2d' }}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.total_sold} units sold</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No sales data available</p>
                        )}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-sm font-medium hover:underline" style={{ color: '#be1e2d' }}>
                                View All →
                            </Link>
                        </div>
                        {recentOrders && recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <Link 
                                        key={order.id} 
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-avhira-bg transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                            <p className="text-xs text-gray-500">
                                                {order.user ? order.user.name : order.guest_email || 'Guest'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total_amount)}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No orders yet</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/products/create"
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-avhira-red hover:bg-avhira-bg transition-all group"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">Add Product</span>
                        </Link>
                        <Link
                            href="/admin/categories/create"
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-avhira-red hover:bg-avhira-bg transition-all group"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">Add Category</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-avhira-red hover:bg-avhira-bg transition-all group"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">View Orders</span>
                        </Link>
                        <Link
                            href="/admin/users/create"
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-avhira-red hover:bg-avhira-bg transition-all group"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">Add User</span>
                        </Link>
                    </div>
                </div>

                {/* Maintenance Mode Modal */}
                {showMaintenanceModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Enable Maintenance Mode</h3>
                                <button
                                    onClick={() => setShowMaintenanceModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    This will make the website inaccessible to all visitors except admins. 
                                    Login functionality will remain available.
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Custom Message (Optional)
                                    </label>
                                    <textarea
                                        value={maintenanceMessage}
                                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                                        placeholder="We are currently performing scheduled maintenance. Please check back soon!"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowMaintenanceModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={enableMaintenanceMode}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Enable
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
