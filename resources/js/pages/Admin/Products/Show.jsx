// File: resources/js/Pages/Admin/Products/Show.jsx

import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function ShowProduct({ product }) {
    const [selectedImage, setSelectedImage] = useState(product.images?.[0] || null);

    return (
        <AdminLayout title="Product Details">
            <Head title={`${product.name} - Admin`} />

            <div className="max-w-6xl">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center" style={{ backgroundColor: '#faf5f6' }}>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-gray-600 mt-1">SKU: {product.sku || 'N/A'}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                            >
                                Edit Product
                            </Link>
                            <Link
                                href="/admin/products"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Images Section */}
                            <div>
                                {selectedImage && (
                                    <div className="mb-4">
                                        <img
                                            src={`/storage/${selectedImage}`}
                                            alt={product.name}
                                            className="w-full h-96 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                {product.images && product.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(image)}
                                                className={`rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === image ? 'border-avhira-red' : 'border-gray-200'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${image}`}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="w-full h-20 object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {product.video_url && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Product Video</h4>
                                        <video
                                            src={product.video_url}
                                            controls
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="space-y-6">
                                {/* Price */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Pricing</h3>
                                    <div className="flex items-baseline gap-3">
                                        {product.sale_price && product.sale_price < product.price ? (
                                            <>
                                                <span className="text-3xl font-bold text-avhira-red">
                                                    ₹{parseFloat(product.sale_price).toFixed(2)}
                                                </span>
                                                <span className="text-xl text-gray-400 line-through">
                                                    ₹{parseFloat(product.price).toFixed(2)}
                                                </span>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                                                    {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-bold text-gray-900">
                                                ₹{parseFloat(product.price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Stock</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-gray-900">{product.stock_quantity}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            product.stock_quantity > 20 ? 'bg-green-100 text-green-800' :
                                            product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock_quantity > 20 ? 'In Stock' :
                                             product.stock_quantity > 0 ? 'Low Stock' :
                                             'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Category</h3>
                                    <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium">
                                        {product.category?.name || 'N/A'}
                                    </span>
                                </div>

                                {/* Available Sizes */}
                                {product.available_sizes && product.available_sizes.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Available Sizes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.available_sizes.map(size => (
                                                <span
                                                    key={size}
                                                    className="px-4 py-2 rounded-lg font-semibold text-white"
                                                    style={{ backgroundColor: '#be1e2d' }}
                                                >
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Featured Badge */}
                                {product.is_featured && (
                                    <div>
                                        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Featured Product
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>

                                {/* Timestamps */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Created:</span>
                                            <p className="text-gray-900 font-medium">
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Last Updated:</span>
                                            <p className="text-gray-900 font-medium">
                                                {new Date(product.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
