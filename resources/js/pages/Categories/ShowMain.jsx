// File: resources/js/Pages/Categories/ShowMain.jsx

import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState } from 'react';

export default function ShowMain({ mainCategory, products, totalProducts }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const filteredProducts = products.filter(product => {
        if (selectedSubcategory === 'all') return true;
        return product.subcategory_id === parseInt(selectedSubcategory);
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (a.sale_price || a.price) - (b.sale_price || b.price);
            case 'price-high':
                return (b.sale_price || b.price) - (a.sale_price || a.price);
            case 'name':
                return a.name.localeCompare(b.name);
            default: // newest
                return b.id - a.id;
        }
    });

    return (
        <MainLayout>
            <Head title={`${mainCategory.name} - Avhira`} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-avhira-red transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link href="/categories" className="hover:text-avhira-red transition-colors">
                                Categories
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium">{mainCategory.name}</span>
                        </li>
                    </ol>
                </nav>

                {/* Header with Inline Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    {/* Title and Description */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{mainCategory.name}</h1>
                        {mainCategory.description && (
                            <p className="text-gray-600 mt-2 max-w-2xl">{mainCategory.description}</p>
                        )}
                        <p className="text-gray-600 mt-1">
                            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Inline Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Subcategory Filter */}
                        {mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
                            <select 
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full bg-white hover:border-gray-300 focus:outline-none focus:border-[#be1e2d] transition-all cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23be1e2d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundSize: '1.25rem',
                                    backgroundPosition: 'right 0.75rem center'
                                }}
                            >
                                <option value="all">All Subcategories</option>
                                {mainCategory.subcategories.map(subcategory => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name} ({subcategory.products_count || 0})
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-8 bg-gray-300" />

                        {/* Sort By */}
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full bg-white hover:border-gray-300 focus:outline-none focus:border-[#be1e2d] transition-all cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23be1e2d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundSize: '1.25rem',
                                backgroundPosition: 'right 0.75rem center'
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>

                        {/* Reset Filters Button */}
                        {(selectedSubcategory !== 'all' || sortBy !== 'newest') && (
                            <button
                                onClick={() => {
                                    setSelectedSubcategory('all');
                                    setSortBy('newest');
                                }}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#be1e2d] transition-colors flex items-center gap-1"
                                title="Reset filters"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Subcategory Quick Links */}
                {mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedSubcategory('all')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                selectedSubcategory === 'all'
                                    ? 'bg-avhira-red text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {mainCategory.subcategories.map(subcategory => (
                            <button
                                key={subcategory.id}
                                onClick={() => setSelectedSubcategory(subcategory.id.toString())}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                    selectedSubcategory === subcategory.id.toString()
                                        ? 'bg-avhira-red text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {subcategory.name}
                                <span className="ml-2 text-xs opacity-75">
                                    ({subcategory.products_count || 0})
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Products Grid */}
                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                        <p className="text-gray-500 mb-6">
                            {selectedSubcategory !== 'all' 
                                ? 'Try selecting a different subcategory or reset the filters.'
                                : 'Products will appear here soon.'}
                        </p>
                        {selectedSubcategory !== 'all' && (
                            <button
                                onClick={() => setSelectedSubcategory('all')}
                                className="px-6 py-3 bg-avhira-red text-white rounded-lg font-semibold hover:bg-avhira-red/90 transition-colors"
                            >
                                View All Products
                            </button>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
