// File: resources/js/Pages/Admin/Orders/Show.jsx

import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { toast } from 'react-hot-toast';

export default function ShowOrder({ order }) {
    const { data, setData, patch, processing } = useForm({
        status: order.status,
        tracking_number: order.tracking_number || '',
        notes: order.notes || '',
    });

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'yellow' },
        { value: 'processing', label: 'Processing', color: 'blue' },
        { value: 'shipped', label: 'Shipped', color: 'purple' },
        { value: 'delivered', label: 'Delivered', color: 'green' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    const handleStatusUpdate = () => {
        patch(`/admin/orders/${order.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Order status updated successfully', {
                    style: {
                        background: '#be1e2d',
                        color: '#faf5f6',
                    },
                });
            },
            onError: (errors) => {
                toast.error('Failed to update order status', {
                    style: {
                        background: '#dc2626',
                        color: '#ffffff',
                    },
                });
            },
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
        <AdminLayout title="Order Details">
            <Head title={`Order #${order.id} - Admin`} />

            <div className="max-w-6xl space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-900">Order #{order.id}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            {order.order_number && (
                                <p className="text-gray-600 font-mono text-sm mb-1">
                                    Order Number: {order.order_number}
                                </p>
                            )}
                            <p className="text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })} at {new Date(order.created_at).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            {order.updated_at !== order.created_at && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Last updated: {new Date(order.updated_at).toLocaleDateString('en-IN')} at {new Date(order.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                        <Link
                            href="/admin/orders"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                        >
                            ← Back to Orders
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Order Items ({order.items?.length || 0})
                            </h3>
                            {order.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                        {item.product?.images?.[0] && (
                                            <img
                                                src={`/storage/${item.product.images[0]}`}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ₹{parseFloat(item.price).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Subtotal: ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="mt-2 text-gray-500">No items in this order</p>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>₹0.00</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Status
                                    </label>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={processing || data.status === order.status}
                                    className="w-full px-4 py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50"
                                    style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                    onMouseEnter={(e) => !processing && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                    onMouseLeave={(e) => !processing && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{order.user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium text-gray-900">{order.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">{order.shipping_address || 'N/A'}</p>
                                <p className="text-gray-700">
                                    {order.shipping_city || 'N/A'}, {order.shipping_state || 'N/A'} - {order.shipping_pincode || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Order Details */}
                        {(order.order_number || order.tracking_number || order.notes) && (
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                                <div className="space-y-3">
                                    {order.order_number && (
                                        <div>
                                            <p className="text-sm text-gray-600">Order Number</p>
                                            <p className="font-medium text-gray-900 font-mono">{order.order_number}</p>
                                        </div>
                                    )}
                                    {order.tracking_number && (
                                        <div>
                                            <p className="text-sm text-gray-600">Tracking Number</p>
                                            <p className="font-medium text-gray-900 font-mono">{order.tracking_number}</p>
                                        </div>
                                    )}
                                    {order.notes && (
                                        <div>
                                            <p className="text-sm text-gray-600">Notes</p>
                                            <p className="font-medium text-gray-700">{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium text-gray-900">
                                        {order.payment_method?.toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.payment_status?.toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
