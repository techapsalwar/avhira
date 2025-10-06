// File: resources/js/Pages/Admin/Users/Edit.jsx

import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function EditUser({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin || false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout title="Edit User">
            <Head title={`Edit ${user.name} - Admin`} />

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password (leave blank to keep current)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Admin Role */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_admin}
                                onChange={(e) => setData('is_admin', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 focus:ring-avhira-red"
                                style={{ accentColor: '#be1e2d' }}
                            />
                            <label className="ml-3 text-sm font-medium text-gray-700">
                                Grant Admin Access
                            </label>
                        </div>

                        {/* User Info */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">User ID:</span>
                                    <p className="text-gray-900 font-medium">{user.id}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Total Orders:</span>
                                    <p className="text-gray-900 font-medium">{user.orders_count || 0}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Member Since:</span>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Last Updated:</span>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(user.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => !processing && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                onMouseLeave={(e) => !processing && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                            >
                                {processing ? 'Updating...' : 'Update User'}
                            </button>
                            <Link
                                href="/admin/users"
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
