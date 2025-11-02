import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState, useMemo } from 'react';

export default function Show({ category, mainCategory, products }) {
    const [sortBy, setSortBy] = useState('newest');

    const sortedProducts = useMemo(() => {
        const productList = [...products];

        return productList.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.sale_price ?? a.price) - (b.sale_price ?? b.price);
                case 'price-high':
                    return (b.sale_price ?? b.price) - (a.sale_price ?? a.price);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return b.id - a.id;
            }
        });
    }, [products, sortBy]);

    return (
        <MainLayout>
            <Head title={`${category.name} - ${mainCategory.name} - Avhira`} />

            <div className="container mx-auto px-4 py-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-[#be1e2d] transition-colors">
                                Home
                            </Link>
                        </li>
                        
                        <li className="flex items-center">
                            <svg className="mx-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link
                                href={`/categories/${mainCategory.slug}`}
                                className="hover:text-[#be1e2d] transition-colors"
                            >
                                {mainCategory.name}
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <svg className="mx-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-gray-900">{category.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
                        {category.description && (
                            <p className="mt-2 max-w-2xl text-gray-600">{category.description}</p>
                        )}
                        
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-full bg-white shadow-sm hover:border-gray-300 focus:outline-none focus:border-[#be1e2d] transition-all appearance-none pr-8 bg-no-repeat bg-right"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, transparent 0, transparent calc(100% - 2.5rem), rgba(190, 30, 45, 0.06) calc(100% - 2.5rem)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='%23be1e2d' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                                backgroundSize: '100% 100%, 1.125rem',
                                backgroundPosition: 'center, right 0.6rem center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </div>
                </div>

                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <div className="mb-4 text-gray-400">
                            <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-600">No Products Found</h3>
                        <p className="text-gray-500">We are busy curating fresh styles for this subcategory. Check back soon.</p>
                        <div className="mt-6">
                            <Link
                                href={`/categories/${mainCategory.slug}`}
                                className="inline-flex items-center gap-2 rounded-full bg-[#be1e2d] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#9a1824]"
                            >
                                Explore {mainCategory.name}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
