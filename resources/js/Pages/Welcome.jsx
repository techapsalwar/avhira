// File: resources/js/Pages/Welcome.jsx

import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import DomeGallery from '@/Components/DomeGallery';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function Welcome({ featuredForHer, featuredForHim, categories }) {
    const [scrollY, setScrollY] = useState(0);
    const { flash } = usePage().props;
    const { showToast } = useToast();

    // Horizontal scroll states for For Her and For Him sections
    const [canScrollLeftHer, setCanScrollLeftHer] = useState(false);
    const [canScrollRightHer, setCanScrollRightHer] = useState(true);
    const [canScrollLeftHim, setCanScrollLeftHim] = useState(false);
    const [canScrollRightHim, setCanScrollRightHim] = useState(true);
    const [canScrollLeftSubcategories, setCanScrollLeftSubcategories] = useState(false);
    const [canScrollRightSubcategories, setCanScrollRightSubcategories] = useState(false);

    // Hero image carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Animated counter states
    const [designs, setDesigns] = useState(0);
    const [prints, setPrints] = useState(0);
    const [years, setYears] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const heroImages = [
        '/images/hero/1.png',
        '/images/hero/2.png',
        '/images/hero/3.png',
        '/images/hero/4.png',
        '/images/hero/5.png',
        '/images/hero/6.png',
        '/images/hero/7.png',
        '/images/hero/8.png',
        '/images/hero/9.png',
        '/images/hero/10.png',
        '/images/hero/11.png',
        '/images/hero/12.png',
        '/images/hero/13.png',
        '/images/hero/14.png',
        '/images/hero/15.png',
        '/images/hero/16.png',
        '/images/hero/17.png',
        '/images/hero/18.png',
        '/images/hero/19.png',
        '/images/hero/20.png',
        '/images/hero/21.png',
        '/images/hero/22.png',
        '/images/hero/23.png',
        '/images/hero/24.png',
        '/images/hero/25.png',
        '/images/hero/26.png',
        '/images/hero/27.png',
        '/images/hero/28.png',
        '/images/hero/29.png',
        '/images/hero/30.png',


        
    ];

    const allSubcategories = useMemo(() => {
        if (!categories) {
            return [];
        }

        return categories.flatMap((category) => {
            const subcategories = category.active_subcategories ?? [];

            return subcategories.map((subcategory) => ({
                ...subcategory,
                mainCategory: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                },
            }));
        });
    }, [categories]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-advance hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % heroImages.length
            );
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, []);

    // Show success message if redirected after order
    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
    }, [flash]);

    // Animate stats counters on mount
    useEffect(() => {
        if (hasAnimated) return;
        
        const animateValue = (setter, start, end, duration, suffix = '') => {
            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(start + (end - start) * easeOutQuart);
                
                setter(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        };

        // Delay before starting animation
        const startDelay = setTimeout(() => {
            animateValue(setDesigns, 0, 1500, 2000);
            animateValue(setPrints, 0, 100, 1800);
            animateValue(setYears, 0, 20, 1500);
            setHasAnimated(true);
        }, 600);

        return () => clearTimeout(startDelay);
    }, [hasAnimated]);

    // Initialize scroll button states
    useEffect(() => {
        const initScrollStates = () => {
            handleScrollHer('scroll-container-her');
            handleScrollHim('scroll-container-him');
            handleScrollSubcategories();
        };
        
        // Delay to ensure DOM is ready
        setTimeout(initScrollStates, 100);
    }, [featuredForHer, featuredForHim, allSubcategories]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % heroImages.length
        );
    };

    // Horizontal scroll handlers for For Her section
    const handleScrollHer = (scrollContainerId) => {
        const container = document.getElementById(scrollContainerId);
        if (container) {
            setCanScrollLeftHer(container.scrollLeft > 0);
            setCanScrollRightHer(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    const scrollHer = (direction) => {
        const container = document.getElementById('scroll-container-her');
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Horizontal scroll handlers for For Him section
    const handleScrollHim = (scrollContainerId) => {
        const container = document.getElementById(scrollContainerId);
        if (container) {
            setCanScrollLeftHim(container.scrollLeft > 0);
            setCanScrollRightHim(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    const scrollHim = (direction) => {
        const container = document.getElementById('scroll-container-him');
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollSubcategories = () => {
        const container = document.getElementById('scroll-container-subcategories');
        if (container) {
            setCanScrollLeftSubcategories(container.scrollLeft > 0);
            setCanScrollRightSubcategories(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    const scrollSubcategories = (direction) => {
        const container = document.getElementById('scroll-container-subcategories');
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <MainLayout>
            <Head title="Avhira - Premium Clothing Brand" />
            
            {/* Hero Section - Full-Width DomeGallery Background */}
            <section className="relative min-h-[580px] sm:min-h-[460px] lg:min-h-[900px] flex items-center overflow-hidden -mt-20 sm:-mt-24 lg:-mt-40" 
                     style={{ backgroundColor: 'rgba(250, 245, 246, 0)' }}>
                
                {/* Full-Width DomeGallery Background */}
                <div className="absolute inset-0 z-0">
                    <DomeGallery
                        images={heroImages}
                        fit={1}
                        segments={30}
                        dragSensitivity={15}
                        maxVerticalRotationDeg={2}
                        grayscale={false}
                        imageBorderRadius="30px"
                        openedImageWidth="400px"
                        openedImageHeight="450px"
                    />
                </div>

                
                
                                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 max-w-[1600px] pointer-events-none flex items-end min-h-[700px] lg:min-h-[900px] pb-12 lg:pb-16">
                                    {/* Mobile-only lower overlay: covers bottom ~40% to improve text/CTA contrast on small screens
                                        This overlay captures pointer events to block interactions with the DomeGallery under it */}
                             <div className="absolute left-0 right-0 bottom-0 block lg:hidden"
                                 style={{ height: '40%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0, 0, 0, 0) 100%)', zIndex: 5, pointerEvents: 'auto', touchAction: 'pan-y' }} />
                                    <div className="max-w-3xl pointer-events-auto relative z-20">
                                        {/* Main Heading */}
                                        <div className="mb-6 animate-fade-in">
                                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                                                <span className="block text-white" style={{ 
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2), 0 0 2px rgba(0,0,0,0.5)'
                                                }}>Welcome to the</span>
                                                <span className="block" style={{ 
                                                    color: '#be1e2d',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 2px rgba(0,0,0,0.6), 0 0 20px rgba(190, 30, 45, 0.3)'
                                                }}>World of Avhira</span>
                                                
                                            </h1>
                                        </div>

                                        {/* CTA Button */}
                        <div className="mb-12 animate-fade-in pointer-events-auto" style={{ animationDelay: '0.2s' }}>
                            <Link 
                                href="/products" 
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base lg:text-lg text-white transition-all transform hover:scale-105 hover:shadow-2xl shadow-xl backdrop-blur-sm"
                                style={{ backgroundColor: '#be1e2d' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                            >
                                Explore More
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        
                    </div>
                </div>
            </section>

            {/* Featured Products - For Her & For Him */}
            {((featuredForHer && featuredForHer.length > 0) || (featuredForHim && featuredForHim.length > 0)) && (
                <section id="featured" className="container mx-auto px-4 lg:px-8 xl:px-20 py-12 sm:py-16 lg:py-20 max-w-[1600px] scroll-mt-32">
                    {/* Section Header */}
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <span className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
                              style={{ backgroundColor: 'rgba(190, 30, 45, 0.1)', color: '#be1e2d' }}>
                            Featured Collection
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 px-4">
                            Handpicked
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Curated selection of our finest pieces. Each item chosen for its exceptional quality and style.
                        </p>
                    </div>

                    {/* Two-Section Layout - For Her & For Him */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* For Her Section */}
                        {featuredForHer && featuredForHer.length > 0 && (
                            <div className="space-y-6">
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        For Her
                                    </h3>
                                    <div className="w-16 h-1 mx-auto lg:mx-0" style={{ backgroundColor: '#be1e2d' }}></div>
                                </div>
                                
                                {/* Horizontal Scroll Container */}
                                <div className="relative group">
                                    {/* Left Scroll Button */}
                                    {canScrollLeftHer && (
                                        <button
                                            onClick={() => scrollHer('left')}
                                            className="absolute left-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                            style={{ marginLeft: '-12px' }}
                                            aria-label="Scroll left"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Scrollable Products Container */}
                                    <div 
                                        id="scroll-container-her"
                                        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                                        onScroll={() => handleScrollHer('scroll-container-her')}
                                        style={{
                                            scrollSnapType: 'x mandatory',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        {featuredForHer.map((product, index) => (
                                            <div 
                                                key={product.id} 
                                                className="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[200px] animate-fade-in"
                                                style={{ 
                                                    animationDelay: `${index * 0.1}s`,
                                                    scrollSnapAlign: 'start'
                                                }}
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Scroll Button */}
                                    {canScrollRightHer && (
                                        <button
                                            onClick={() => scrollHer('right')}
                                            className="absolute right-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                            style={{ marginRight: '-12px' }}
                                            aria-label="Scroll right"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Explore Women Button */}
                                <div className="text-center lg:text-left mt-6">
                                    <Link
                                        href="/categories/women"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                                        style={{ backgroundColor: '#be1e2d' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                    >
                                        Explore Women
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* For Him Section */}
                        {featuredForHim && featuredForHim.length > 0 && (
                            <div className="space-y-6">
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        For Him
                                    </h3>
                                    <div className="w-16 h-1 mx-auto lg:mx-0" style={{ backgroundColor: '#be1e2d' }}></div>
                                </div>
                                
                                {/* Horizontal Scroll Container */}
                                <div className="relative group">
                                    {/* Left Scroll Button */}
                                    {canScrollLeftHim && (
                                        <button
                                            onClick={() => scrollHim('left')}
                                            className="absolute left-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                            style={{ marginLeft: '-12px' }}
                                            aria-label="Scroll left"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Scrollable Products Container */}
                                    <div 
                                        id="scroll-container-him"
                                        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                                        onScroll={() => handleScrollHim('scroll-container-him')}
                                        style={{
                                            scrollSnapType: 'x mandatory',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        {featuredForHim.map((product, index) => (
                                            <div 
                                                key={product.id} 
                                                className="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[200px] animate-fade-in"
                                                style={{ 
                                                    animationDelay: `${index * 0.1}s`,
                                                    scrollSnapAlign: 'start'
                                                }}
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Scroll Button */}
                                    {canScrollRightHim && (
                                        <button
                                            onClick={() => scrollHim('right')}
                                            className="absolute right-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                            style={{ marginRight: '-12px' }}
                                            aria-label="Scroll right"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Explore Men Button */}
                                <div className="text-center lg:text-left mt-6">
                                    <Link
                                        href="/categories/men"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                                        style={{ backgroundColor: '#be1e2d' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                    >
                                        Explore Men
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    
                </section>
            )}

            {/* Categories Section */}
            {allSubcategories.length > 0 && (
                <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#faf5f6' }}>
                    <div className="container mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                            <span className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
                                  style={{ backgroundColor: 'rgba(190, 30, 45, 0.1)', color: '#be1e2d' }}>
                                Browse by Category
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 px-4">
                                Find Your Perfect Match
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                                Explore our diverse collection across multiple categories
                            </p>
                        </div>

                        {/* Subcategories Horizontal Carousel */}
                        <div className="relative group">
                            {canScrollLeftSubcategories && (
                                <button
                                    onClick={() => scrollSubcategories('left')}
                                    className="absolute left-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                    style={{ marginLeft: '-12px' }}
                                    aria-label="Scroll subcategories left"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            <div
                                id="scroll-container-subcategories"
                                className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-3 sm:pb-4"
                                onScroll={handleScrollSubcategories}
                                style={{
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch',
                                }}
                            >
                                {allSubcategories.map((subcategory, index) => (
                                    <Link
                                        key={subcategory.id}
                                        href={`/categories/${subcategory.mainCategory.slug}/${subcategory.slug}`}
                                        className="group flex-shrink-0 w-[88px] sm:w-[200px] flex flex-col items-center text-center animate-fade-in"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                            scrollSnapAlign: 'center',
                                        }}
                                    >
                                        {/* Round Image Container */}
                                        <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 mb-3 sm:mb-4">
                                            {subcategory.image ? (
                                                <img
                                                    src={`/storage/${subcategory.image}`}
                                                    alt={subcategory.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#be1e2d] to-[#9a1824]">
                                                    <span className="text-white text-2xl sm:text-4xl md:text-6xl font-bold opacity-80">
                                                        {subcategory.name?.charAt(0) ?? '?'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Circular Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        {/* Subcategory Name Below */}
                                        <div className="text-center">
                                            <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-[#be1e2d] transition-colors">
                                                {subcategory.name}
                                            </h3>
                                            <p className="text-[10px] sm:text-sm text-gray-500 mb-1 sm:mb-2">
                                                {subcategory.mainCategory.name}
                                            </p>
                                            <div className="hidden sm:flex items-center justify-center gap-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs sm:text-sm">Explore</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {canScrollRightSubcategories && (
                                <button
                                    onClick={() => scrollSubcategories('right')}
                                    className="absolute right-0 top-2/5 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                                    style={{ marginRight: '-12px' }}
                                    aria-label="Scroll subcategories right"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Avhira - Jaipur Heritage Section */}
            <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
                

                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 max-w-[1600px]">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <span className="inline-block px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold mb-5 shadow-lg"
                              style={{ 
                                  background: 'linear-gradient(135deg, #be1e2d 0%, #9a1824 100%)',
                                  color: 'white'
                              }}>
                            ✨ Why Choose Avhira?
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 px-4 leading-tight">
                            The Soul of Jaipur's
                            <br />
                            <span style={{ color: '#be1e2d' }}>Timeless Prints</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
                            At Avhira, we bring you the essence of Jaipur's heritage with a modern touch. From premium cotton fabrics to handcrafted detailing — everything we create is rooted in <strong className="text-[#be1e2d]">authenticity, comfort, and style</strong>.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 sm:mb-16">
                        {[
                            {
                                icon: (
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                ),
                                title: "Premium Cotton Quality",
                                description: "High-grade cotton that's soft, breathable, and durable — perfect for all-day comfort in every season",
                                gradient: "from-emerald-400 to-emerald-600",
                                delay: "0s"
                            },
                            {
                                icon: (
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.172V5L7 4z" />
                                    </svg>
                                ),
                                title: "In-House Manufacturing",
                                description: "Our own production setup lets us design and craft exclusive patterns you won't find anywhere else",
                                gradient: "from-blue-400 to-blue-600",
                                delay: "0.1s"
                            },
                            {
                                icon: (
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                ),
                                title: "Crafted by Jaipur's Artisans",
                                description: "Our prints come alive through skilled artisans carrying forward the legacy of Jaipuri and Sanganeri art",
                                gradient: "from-purple-400 to-purple-600",
                                delay: "0.2s"
                            },
                            {
                                icon: (
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                ),
                                title: "Trend Meets Tradition",
                                description: "Blending traditional prints with modern silhouettes — from shirts to kurtis, tops, and dresses for today's lifestyle",
                                gradient: "from-rose-400 to-rose-600",
                                delay: "0.3s"
                            }
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="group relative animate-fade-in"
                                style={{ animationDelay: feature.delay }}
                            >
                                {/* Card */}
                                <div className="relative h-full p-6 sm:p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                                    {/* Gradient Icon Background */}
                                    <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 text-white">
                                            {feature.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Accent */}
                                    <div className={`absolute inset-x-0 bottom-0 h-1.5 rounded-b-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Heritage Banner */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#be1e2d] via-[#d4243a] to-[#be1e2d]" />
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                            }} />
                        </div>
                        
                        <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-12 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-1 bg-white/40 rounded-full" />
                                <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                </svg>
                                <div className="w-12 h-1 bg-white/40 rounded-full" />
                            </div>
                            
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                                Handcrafted with Heritage, Styled for Today
                            </h3>
                            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6">
                                Every piece tells the story of Jaipur's rich artistic tradition, reimagined for the modern wardrobe
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm sm:text-base text-white/80">Authentic Prints</div>
                                </div>
                                <div className="hidden sm:block w-px h-12 bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">Premium</div>
                                    <div className="text-sm sm:text-base text-white/80">Cotton Quality</div>
                                </div>
                                <div className="hidden sm:block w-px h-12 bg-white/20" />
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">Exclusive</div>
                                    <div className="text-sm sm:text-base text-white/80">Designs</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {[
                            { 
                                icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
                                label: "Free Shipping", 
                                sublabel: "On orders over ₹999" 
                            },
                            { 
                                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                                label: "Secure Payment", 
                                sublabel: "100% Protected" 
                            },
                            { 
                                icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
                                label: "24/7 Support", 
                                sublabel: "Always here to help" 
                            },
                            { 
                                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                                label: "Quality Assured", 
                                sublabel: "Guaranteed satisfaction" 
                            }
                        ].map((item, index) => (
                            <div 
                                key={index} 
                                className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-lg animate-fade-in" 
                                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                            >
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#be1e2d] to-[#9a1824] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                </div>
                                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">{item.label}</div>
                                <div className="text-xs sm:text-sm text-gray-600">{item.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#be1e2d] to-[#9a1824]" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }} />
                </div>

                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 text-center max-w-[1600px]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
                            Join The AVHIRA Community
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 px-4">
                            Subscribe to our newsletter for exclusive offers, style tips, and new arrivals
                        </p>
                        
                        <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-lg"
                                required
                            />
                            <button 
                                type="submit"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-full text-sm sm:text-base font-bold text-gray-900 hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                            >
                                Subscribe Now
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-white/70">
                            No spam, unsubscribe at any time
                        </p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
