// File: resources/js/Pages/Admin/Categories/Index.jsx

import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function CategoriesIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Categories">
            <Head title="Categories - Admin" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent w-full sm:w-64"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-all"
                            style={{ backgroundColor: '#be1e2d' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                        >
                            Search
                        </button>
                    </form>
                    <Link
                        href="/admin/categories/create"
                        className="px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all inline-flex items-center gap-2"
                        style={{ backgroundColor: '#be1e2d' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                    >
                        <span>+</span> Add Category
                    </Link>
                </div>

                {/* Categories Table */}
                <div className="bg-white shadow-md rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-avhira-bg">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Products
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-avhira-bg transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{category.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-avhira-red text-white">
                                                {category.products_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {category.description || 'No description'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="text-avhira-red hover:text-avhira-dark-red mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {categories.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {categories.from} to {categories.to} of {categories.total} results
                                </div>
                                <div className="flex gap-2">
                                    {categories.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-avhira-red text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
