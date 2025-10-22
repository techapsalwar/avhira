// File: resources/js/Pages/Welcome.jsx

import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import DomeGallery from '@/Components/DomeGallery';
import { useState, useEffect } from 'react';
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
        };
        
        // Delay to ensure DOM is ready
        setTimeout(initScrollStates, 100);
    }, [featuredForHer, featuredForHim]);

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
                                    <div className="max-w-3xl">
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
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
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
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
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
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
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
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
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
            {categories && categories.length > 0 && (
                <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#faf5f6' }}>
                    <div className="container mx-auto px-4 lg:px-8 xl:px-16 max-w-[1600px]">
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

                        {/* Categories Grid - Round Shape */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                            {categories.map((category, index) => (
                                <Link 
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group flex flex-col items-center animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Round Image Container */}
                                    <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 mb-4">
                                        {category.image ? (
                                            <img 
                                                src={`/storage/${category.image}`} 
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#be1e2d] to-[#9a1824]">
                                                <span className="text-white text-4xl md:text-6xl font-bold opacity-80">
                                                    {category.name[0]}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Circular Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        
                                    </div>
                                    
                                    {/* Category Name Below */}
                                    <div className="text-center">
                                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 group-hover:text-[#be1e2d] transition-colors">
                                            {category.name}
                                        </h3>
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
                    </div>
                </section>
            )}

            {/* Why Choose Us Section */}
            <section className="container mx-auto px-4 lg:px-8 xl:px-16 py-12 sm:py-16 lg:py-20 max-w-[1600px]">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <span className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
                          style={{ backgroundColor: 'rgba(190, 30, 45, 0.1)', color: '#be1e2d' }}>
                        Why Choose AVHIRA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 px-4">
                        Experience Excellence
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        We're committed to providing you with the best shopping experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "M5 13l4 4L19 7",
                            title: "Premium Quality",
                            description: "Only the finest fabrics and materials for lasting comfort and style",
                            delay: "0s"
                        },
                        {
                            icon: "M13 10V3L4 14h7v7l9-11h-7z",
                            title: "Fast Shipping",
                            description: "Quick and reliable delivery to your doorstep within 3-5 days",
                            delay: "0.1s"
                        },
                        {
                            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                            title: "Easy Returns",
                            description: "Hassle-free returns within 30 days of purchase, no questions asked",
                            delay: "0.2s"
                        }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative p-5 sm:p-6 lg:p-8 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: feature.delay }}
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                                 style={{ backgroundColor: '#be1e2d' }}>
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                </svg>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative Element */}
                            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                 style={{ backgroundColor: '#be1e2d' }} />
                        </div>
                    ))}
                </div>

                {/* Additional Trust Elements */}
                <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                    {[
                        { label: "Free Shipping", sublabel: "On orders over ₹999" },
                        { label: "Secure Payment", sublabel: "100% Protected" },
                        { label: "24/7 Support", sublabel: "Always here to help" },
                        { label: "Satisfaction", sublabel: "Guaranteed quality" }
                    ].map((item, index) => (
                        <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{item.label}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{item.sublabel}</div>
                        </div>
                    ))}
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
