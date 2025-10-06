// File: resources/js/Pages/Products/Index.jsx

import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState } from 'react';

export default function Index({ products, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const filteredProducts = products.filter(product => {
        if (selectedCategory === 'all') return true;
        return product.category_id === parseInt(selectedCategory);
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
            <Head title="All Products - Avhira" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header with Inline Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    {/* Title and Count */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
                        <p className="text-gray-600 mt-1">
                            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Inline Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category Filter */}
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full bg-white hover:border-gray-300 focus:outline-none focus:border-[#be1e2d] transition-all cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23be1e2d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundSize: '1.25rem',
                                backgroundPosition: 'right 0.75rem center'
                            }}
                        >
                            <option value="all">All Categories</option>
                            {categories && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

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

                        {/* Reset Filters Button (only shows when filters are active) */}
                        {(selectedCategory !== 'all' || sortBy !== 'newest') && (
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
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

                {/* Products Grid */}
                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                        <button 
                            onClick={() => {
                                setSelectedCategory('all');
                                setSortBy('newest');
                            }}
                            className="bg-avhira-red text-white px-6 py-2 rounded-lg hover:bg-avhira-dark-red transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
