// File: resources/js/Pages/Products/Index.jsx

import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useMemo, useState } from 'react';

export default function Index({ products, categories }) {
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const menCategory = useMemo(() => (
        categories?.find((category) =>
            category?.slug?.toLowerCase() === 'men' || category?.name?.toLowerCase() === 'men'
        ) ?? null
    ), [categories]);

    const womenCategory = useMemo(() => (
        categories?.find((category) =>
            category?.slug?.toLowerCase() === 'women' || category?.name?.toLowerCase() === 'women'
        ) ?? null
    ), [categories]);

    const activeCategory = useMemo(() => {
        if (!activeCategoryId) {
            return null;
        }

        return categories?.find((category) => category?.id === activeCategoryId) ?? null;
    }, [categories, activeCategoryId]);

    const numericSubcategoryId = selectedSubcategoryId === 'all' ? null : Number(selectedSubcategoryId);

    const filteredProducts = products.filter((product) => {
        const mainCategoryId = product.subcategory?.main_category?.id
            ?? product.subcategory?.main_category_id
            ?? null;
        const normalizedMainCategoryId = mainCategoryId !== null ? Number(mainCategoryId) : null;
        const subcategoryId = product.subcategory?.id ?? product.subcategory_id ?? null;
        const normalizedSubcategoryId = subcategoryId !== null ? Number(subcategoryId) : null;

        if (activeCategory && normalizedMainCategoryId !== Number(activeCategory.id)) {
            return false;
        }

        if (numericSubcategoryId && normalizedSubcategoryId !== numericSubcategoryId) {
            return false;
        }

        return true;
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

    const availableSubcategories = activeCategory?.active_subcategories ?? [];

    return (
        <MainLayout>
            <Head title="All Products - Avhira" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header with Inline Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    {/* Title and Count */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
                        
                    </div>

                    {/* Inline Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category Toggles */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!menCategory) return;
                                    setActiveCategoryId((current) => {
                                        const next = current === menCategory.id ? null : menCategory.id;
                                        if (next === null) {
                                            setSelectedSubcategoryId('all');
                                        } else if (next !== current) {
                                            setSelectedSubcategoryId('all');
                                        }
                                        return next;
                                    });
                                }}
                                className={`px-4 py-2.5 text-sm font-semibold rounded-full border transition-all ${
                                    activeCategoryId === menCategory?.id
                                        ? 'bg-[#be1e2d] text-white border-[#be1e2d]'
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:text-[#be1e2d]'
                                } ${menCategory ? '' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!menCategory}
                            >
                                Men
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!womenCategory) return;
                                    setActiveCategoryId((current) => {
                                        const next = current === womenCategory.id ? null : womenCategory.id;
                                        if (next === null) {
                                            setSelectedSubcategoryId('all');
                                        } else if (next !== current) {
                                            setSelectedSubcategoryId('all');
                                        }
                                        return next;
                                    });
                                }}
                                className={`px-4 py-2.5 text-sm font-semibold rounded-full border transition-all ${
                                    activeCategoryId === womenCategory?.id
                                        ? 'bg-[#be1e2d] text-white border-[#be1e2d]'
                                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:text-[#be1e2d]'
                                } ${womenCategory ? '' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!womenCategory}
                            >
                                Women
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-8 bg-gray-300" />

                        {/* Subcategory Dropdown */}
                        {activeCategory && availableSubcategories.length > 0 && (
                            <select
                                value={selectedSubcategoryId}
                                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                                className="px-4 py-2.5 text-sm font-medium border-2 border-gray-200 rounded-full bg-white hover:border-gray-300 focus:outline-none focus:border-[#be1e2d] transition-all cursor-pointer appearance-none pr-10 bg-no-repeat bg-right"
                                style={{
                                    backgroundImage: `url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23be1e2d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")`,
                                    backgroundSize: '1.25rem',
                                    backgroundPosition: 'right 0.75rem center'
                                }}
                            >
                                <option value="all">All {activeCategory.name}</option>
                                {availableSubcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>
                        )}

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
                        {(activeCategory || selectedSubcategoryId !== 'all' || sortBy !== 'newest') && (
                            <button
                                onClick={() => {
                                    setActiveCategoryId(null);
                                    setSelectedSubcategoryId('all');
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
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
                                setActiveCategoryId(null);
                                setSelectedSubcategoryId('all');
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
