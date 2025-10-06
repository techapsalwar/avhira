// File: resources/js/Pages/Admin/Users/Index.jsx

import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function UsersIndex({ users, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', {
            search: searchQuery,
            role: roleFilter !== 'all' ? roleFilter : undefined,
        }, {
            preserveState: true,
        });
    };

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        router.get('/admin/users', {
            search: searchQuery || undefined,
            role: role !== 'all' ? role : undefined,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (userId, userName) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', userId), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('User deleted successfully', {
                        style: {
                            background: '#be1e2d',
                            color: '#faf5f6',
                        },
                    });
                },
            });
        }
    };

    const toggleAdminRole = (userId, currentStatus, userName) => {
        const action = currentStatus ? 'remove admin access from' : 'grant admin access to';
        if (confirm(`Are you sure you want to ${action} "${userName}"?`)) {
            router.post(route('admin.users.toggle-admin', userId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Admin status updated for ${userName}`, {
                        style: {
                            background: '#be1e2d',
                            color: '#faf5f6',
                        },
                    });
                },
            });
        }
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
                        <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
                        style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                    >
                        + Add User
                    </Link>
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
                                placeholder="Search by name or email..."
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

                    {/* Role Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleRoleFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                roleFilter === 'all'
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={roleFilter === 'all' ? { backgroundColor: '#be1e2d' } : {}}
                        >
                            All Users
                        </button>
                        <button
                            onClick={() => handleRoleFilter('admin')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                roleFilter === 'admin'
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={roleFilter === 'admin' ? { backgroundColor: '#be1e2d' } : {}}
                        >
                            Admins
                        </button>
                        <button
                            onClick={() => handleRoleFilter('customer')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                roleFilter === 'customer'
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={roleFilter === 'customer' ? { backgroundColor: '#be1e2d' } : {}}
                        >
                            Customers
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#faf5f6' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                                         style={{ backgroundColor: '#be1e2d' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.is_admin
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.is_admin ? 'ADMIN' : 'CUSTOMER'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.orders_count || 0} orders
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleAdminRole(user.id, user.is_admin, user.name)}
                                                        className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                                                    >
                                                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                                    </button>
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="text-sm font-semibold text-avhira-red hover:text-avhira-red-dark"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.name)}
                                                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <p className="mt-4 text-lg font-medium">No users found</p>
                                                <p className="mt-1 text-sm">Try adjusting your filters or search query</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.data && users.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {users.from || 0} to {users.to || 0} of {users.total || 0} users
                            </div>
                            <div className="flex gap-2">
                                {users.links?.map((link, index) => (
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
