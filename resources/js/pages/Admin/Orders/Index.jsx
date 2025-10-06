// File: resources/js/Pages/Admin/Orders/Index.jsx

import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function OrdersIndex({ orders, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const statusOptions = [
        { value: 'all', label: 'All Orders', color: 'gray' },
        { value: 'pending', label: 'Pending', color: 'yellow' },
        { value: 'processing', label: 'Processing', color: 'blue' },
        { value: 'shipped', label: 'Shipped', color: 'purple' },
        { value: 'delivered', label: 'Delivered', color: 'green' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', {
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        }, {
            preserveState: true,
        });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get('/admin/orders', {
            search: searchQuery || undefined,
            status: status !== 'all' ? status : undefined,
        }, {
            preserveState: true,
        });
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Orders Management</h2>
                        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order ID, customer name, or email..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusFilter(option.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    statusFilter === option.value
                                        ? 'text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                style={statusFilter === option.value ? { backgroundColor: '#be1e2d' } : {}}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#faf5f6' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-semibold text-gray-900">
                                                    #{order.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                                                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900">
                                                    {order.items?.length || 0} item(s)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">
                                                    ₹{parseFloat(order.total_amount).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-avhira-red hover:text-avhira-red-dark font-semibold"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="mt-4 text-lg font-medium">No orders found</p>
                                                <p className="mt-1 text-sm">Try adjusting your filters or search query</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.data && orders.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} orders
                            </div>
                            <div className="flex gap-2">
                                {orders.links?.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            link.active
                                                ? 'text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        style={link.active ? { backgroundColor: '#be1e2d' } : {}}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveState
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
