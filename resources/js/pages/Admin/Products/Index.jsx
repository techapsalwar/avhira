// File: resources/js/Pages/Admin/Products/Index.jsx

import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [stock, setStock] = useState(filters.stock || '');
    const [featured, setFeatured] = useState(filters.featured || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { search, category, stock, featured }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const getStockBadge = (quantity) => {
        if (quantity === 0) return 'bg-red-100 text-red-800';
        if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <AdminLayout title="Products">
            <Head title="Products - Admin" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                        />
                        
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                        >
                            <option value="">All Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                            <option value="in">In Stock</option>
                        </select>

                        <select
                            value={featured}
                            onChange={(e) => setFeatured(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                        >
                            <option value="">All Products</option>
                            <option value="yes">Featured Only</option>
                            <option value="no">Not Featured</option>
                        </select>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-all"
                            style={{ backgroundColor: '#be1e2d' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                        >
                            Filter
                        </button>
                    </form>

                    <Link
                        href="/admin/products/create"
                        className="px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all inline-flex items-center gap-2 whitespace-nowrap"
                        style={{ backgroundColor: '#be1e2d' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                    >
                        <span>+</span> Add Product
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.data.map((product) => {
                        let imageUrl = 'https://via.placeholder.com/300x300.png?text=No+Image';
                        try {
                            const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                            if (Array.isArray(images) && images.length > 0) {
                                imageUrl = `/storage/${images[0].replace(/\\/g, '')}`;
                            }
                        } catch (e) {
                            console.error("Failed to parse product images:", e);
                        }

                        return (
                            <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    {product.is_featured && (
                                        <span className="absolute top-2 right-2 bg-avhira-red text-white text-xs font-semibold px-2 py-1 rounded">
                                            Featured
                                        </span>
                                    )}
                                    <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${getStockBadge(product.stock_quantity)}`}>
                                        Stock: {product.stock_quantity}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        {product.sale_price ? (
                                            <>
                                                <span className="text-lg font-bold text-avhira-red">{formatPrice(product.sale_price)}</span>
                                                <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="flex-1 text-center py-2 px-3 bg-avhira-bg text-avhira-red rounded-lg text-sm font-medium hover:bg-avhira-red hover:text-white transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="bg-white rounded-2xl shadow-md px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {products.from} to {products.to} of {products.total} results
                            </div>
                            <div className="flex gap-2">
                                {products.links.map((link, index) => (
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
        </AdminLayout>
    );
}
