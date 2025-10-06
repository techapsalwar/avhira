// File: resources/js/Pages/Welcome.jsx

import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState, useEffect } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function Welcome({ featuredProducts, categories }) {
    const [scrollY, setScrollY] = useState(0);
    const { flash } = usePage().props;
    const { showToast } = useToast();

    // Hero image carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Animated counter states
    const [designs, setDesigns] = useState(0);
    const [prints, setPrints] = useState(0);
    const [years, setYears] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const heroImages = [
        '/images/hero/product-1.jpg',
        '/images/hero/product-2.png',
        '/images/hero/product-3.png',
        
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

    return (
        <MainLayout>
            <Head title="Avhira - Premium Clothing Brand" />
            
            {/* Hero Section - Modern Layout Inspired Design */}
            <section className="relative min-h-[700px] lg:min-h-[900px] flex items-center overflow-hidden -mt-20 sm:-mt-32 lg:-mt-40" 
                     style={{ backgroundColor: '#faf5f6' }}>
                
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(190, 30, 45, 0.8) 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10 max-w-[1600px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 xl:gap-6 items-center">
                        
                        {/* Left Content */}
                        <div className="order-2 lg:order-1 space-y-4 lg:space-y-6 animate-fade-in pl-4 lg:pl-8 xl:pl-12">
                            {/* Main Heading */}
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                                    <span className="block text-gray-900">Timeless prints,</span>
                                    <span className="block" style={{ color: '#be1e2d' }}>reimagined for</span>
                                    <span className="block text-gray-900">modern living</span>
                                </h1>
                                
                                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl">
                                    Handcrafted premium cotton, rooted in tradition, refined for the modern wardrobe.
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <Link 
                                    href="/products" 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base lg:text-lg text-white transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
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
                            <div className="grid grid-cols-3 gap-6 lg:gap-8 pt-6 lg:pt-8 border-t border-gray-300 animate-fade-in" 
                                 style={{ animationDelay: '0.4s' }}>
                                <div>
                                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 tabular-nums" 
                                         style={{ color: '#be1e2d' }}>
                                        {designs}+
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-600 font-medium">
                                        Premium Designs
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 tabular-nums" 
                                         style={{ color: '#be1e2d' }}>
                                        {prints}+
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-600 font-medium">
                                        Artisan Prints
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 tabular-nums" 
                                         style={{ color: '#be1e2d' }}>
                                        {years}+
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-600 font-medium">
                                        Years Legacy
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Product Showcase */}
                        <div className="order-1 lg:order-2 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            {/* Main Product Card - Smaller & Seamless */}
                            <div className="relative group">
                                {/* Subtle Decorative Glow */}
                                <div className="absolute inset-0 rounded-3xl opacity-10 blur-2xl"
                                     style={{ backgroundColor: '#be1e2d' }} />
                                
                                {/* Main Image Container - Smaller Size */}
                                <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] mx-auto">
                                    {/* Image Carousel */}
                                    {heroImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                                index === currentImageIndex
                                                    ? 'opacity-100 scale-100'
                                                    : 'opacity-0 scale-105'
                                            }`}
                                        >
                                            <img 
                                                src={image}
                                                alt={`Avhira Collection ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    filter: 'contrast(1.05) saturate(1.1)',
                                                }}
                                                onError={(e) => {
                                                    // Fallback to placeholder if image doesn't exist
                                                    e.target.style.display = 'none';
                                                    if (index === currentImageIndex) {
                                                        e.target.parentElement.nextElementSibling?.classList.remove('hidden');
                                                        e.target.parentElement.nextElementSibling?.classList.add('flex');
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                    
                                    {/* Placeholder for when images are not yet added */}
                                    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 items-center justify-center hidden absolute inset-0">
                                        <div className="text-center p-8">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#be1e2d] to-[#9a1824]">
                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 font-medium text-base">Hero Product Images</p>
                                            <p className="text-gray-500 text-xs mt-2">Add to: public/images/hero/</p>
                                            <p className="text-gray-400 text-xs mt-1">product-1.jpg to product-4.jpg</p>
                                        </div>
                                    </div>

                                    {/* Subtle Overlay for Blend Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#faf5f6]/20 via-transparent to-[#faf5f6]/10 pointer-events-none" />

                                    {/* Minimalistic Navigation Controls - Inside Image at Bottom */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 animate-fade-in"
                                         style={{ animationDelay: '0.8s' }}>
                                        {/* Previous Button */}
                                        <button 
                                            onClick={handlePrevImage}
                                            className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white/90 hover:scale-110"
                                            style={{ color: '#be1e2d' }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        
                                        {/* Minimalistic Dots Indicator */}
                                        <div className="flex gap-1.5">
                                            {heroImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`transition-all duration-300 rounded-full ${
                                                        index === currentImageIndex
                                                            ? 'w-6 h-1.5 bg-white'
                                                            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Next Button */}
                                        <button 
                                            onClick={handleNextImage}
                                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110"
                                            style={{ backgroundColor: '#be1e2d' }}
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts && featuredProducts.length > 0 && (
                <section className="container mx-auto px-4 lg:px-8 xl:px-20 py-12 sm:py-16 lg:py-20 max-w-[1600px]">
                    {/* Section Header */}
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <span className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
                              style={{ backgroundColor: 'rgba(190, 30, 45, 0.1)', color: '#be1e2d' }}>
                            Featured Collection
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 px-4">
                            Handpicked For You
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Curated selection of our finest pieces. Each item chosen for its exceptional quality and style.
                        </p>
                    </div>

                    {/* Products Grid with Stagger Animation */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                        {featuredProducts.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* View All CTA */}
                    <div className="text-center mt-8 sm:mt-12">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                            style={{ backgroundColor: '#be1e2d' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                        >
                            View All Products
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
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
                                        
                                        {/* Hover Border Effect */}
                                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#be1e2d] rounded-full transition-colors duration-300" />
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
