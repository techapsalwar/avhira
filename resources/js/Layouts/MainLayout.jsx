// File: resources/js/Layouts/MainLayout.jsx

import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthModal from '@/Components/AuthModal';
import CartSlider from '@/Components/CartSlider';

export default function MainLayout({ children }) {
    const { auth, url } = usePage().props;
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [cartSliderOpen, setCartSliderOpen] = useState(false);
    const [compact, setCompact] = useState(false);
    const lastY = useRef(0);

    // Derive current pathname
    let currentPath = '/';
    try {
        const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        currentPath = parsed.pathname;
    } catch (e) {
        if (typeof window !== 'undefined') {
            const parsed = new URL(window.location.href);
            currentPath = parsed.pathname;
        }
    }

    const navLinks = [
        { label: 'Men', href: '/categories/men' },
        { label: 'Women', href: '/categories/women' },
        { label: 'Featured', href: '/#featured', scrollTo: 'featured' },
        { label: 'About Us', href: '/about' },
    ];

    const isActive = (link) => {
        if (link.href === '/') return currentPath === '/';
        if (link.href === '/#featured') return currentPath === '/';
        return currentPath.startsWith(link.href);
    };

    const handleNavClick = (e, link) => {
        if (link.scrollTo) {
            e.preventDefault();
            
            // If not on homepage, navigate there first
            if (currentPath !== '/') {
                router.visit('/', {
                    onSuccess: () => {
                        setTimeout(() => {
                            const element = document.getElementById(link.scrollTo);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }, 100);
                    }
                });
            } else {
                // Already on homepage, just scroll
                const element = document.getElementById(link.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener('cart-updated', fetchCartCount);
        return () => window.removeEventListener('cart-updated', fetchCartCount);
    }, []);

    useEffect(() => {
        const handleOpenCart = () => setCartSliderOpen(true);
        window.addEventListener('open-cart-slider', handleOpenCart);
        return () => window.removeEventListener('open-cart-slider', handleOpenCart);
    }, []);

    useEffect(() => {
        // Compact header when user scrolls down; reveal on scroll up
        const handleScroll = () => {
            if (typeof window === 'undefined') return;
            const y = window.scrollY || window.pageYOffset;
            
            if (mobileMenuOpen) {
                lastY.current = y;
                return;
            }

            if (y > lastY.current && y > 80) {
                setCompact(true);
            } else if (y < lastY.current - 10 || y <= 80) {
                setCompact(false);
            }
            lastY.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mobileMenuOpen]);

    const fetchCartCount = async () => {
        try {
            const response = await window.axios.get('/cart/count');
            setCartCount(response.data.count || 0);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    return (
        <div className="min-h-screen bg-avhira-bg">
            {/* Floating Centered Navigation */}
            <nav 
                className={`fixed left-1/2 transform -translate-x-1/2 z-50 bg-white/95 border border-gray-200 rounded-full shadow-xl backdrop-blur-md transition-all duration-300 ${
                    compact ? 'top-4 py-2' : 'top-8 py-3'
                }`}
            >
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                                 style={{ backgroundColor: '#be1e2d' }}>
                                A
                            </div>
                            <span className="text-xl font-bold text-gray-800">AVHIRA</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-2 text-sm">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`relative px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                                    isActive(link)
                                        ? 'text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                style={isActive(link) ? { backgroundColor: '#be1e2d' } : {}}
                                onMouseEnter={(e) => {
                                    if (!isActive(link)) {
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(190, 30, 45, 0.12)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(link)) {
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
                                />
                            </svg>
                        </button>

                        {/* Cart Icon */}
                        <button
                            onClick={() => setCartSliderOpen(true)}
                            className="relative text-gray-700 hover:text-avhira-red transition-colors p-2 rounded-full hover:bg-gray-50"
                            aria-label="Shopping cart"
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span 
                                    className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                                    style={{ backgroundColor: '#be1e2d' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User Menu or Login */}
                        {auth.user ? (
                            <div className="hidden lg:block relative group">
                                <button className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
                                    <svg 
                                        className="w-6 h-6 text-gray-700" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                                    <svg 
                                        className="w-4 h-4 text-gray-500" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                                    <Link 
                                        href="/dashboard" 
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-avhira-bg hover:text-avhira-red transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        href="/orders" 
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-avhira-bg hover:text-avhira-red transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                    <Link 
                                        href="/profile" 
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-avhira-bg hover:text-avhira-red transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    <Link 
                                        href="/logout" 
                                        method="post" 
                                        as="button"
                                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-avhira-bg hover:text-avhira-red transition-colors"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="hidden lg:inline-block text-sm font-semibold px-5 py-2 rounded-full shadow-md transition-all"
                                    style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                >
                                    Log in
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute left-4 right-4 mt-4 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => {
                                        handleNavClick(e, link);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                                        isActive(link)
                                            ? 'text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    style={isActive(link) ? { backgroundColor: '#be1e2d' } : {}}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
                                {auth.user ? (
                                    <>
                                        <Link 
                                            href="/dashboard" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link 
                                            href="/orders" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            My Orders
                                        </Link>
                                        <Link 
                                            href="/logout" 
                                            method="post" 
                                            as="button"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg text-left"
                                        >
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setAuthModalOpen(true);
                                            }}
                                            className="text-sm font-semibold px-4 py-2 rounded-lg"
                                            style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                        >
                                            Log in
                                        </button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </nav>

            {/* Spacer so content doesn't sit under the fixed nav */}
            <div className="h-32"></div>

            {/* Main Content */}
            <main className="pt-0 sm:pt-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-avhira-red mb-4">AVHIRA</h3>
                            <p className="text-gray-400">
                                Premium clothing brand offering the finest quality apparel for the modern individual.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/products" className="text-gray-400 hover:text-avhira-red">Products</Link></li>
                                <li><Link href="/categories" className="text-gray-400 hover:text-avhira-red">Categories</Link></li>                            
                                <li><Link href="/contact" className="text-gray-400 hover:text-avhira-red">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2">
                                <li><Link href="/shipping" className="text-gray-400 hover:text-avhira-red">Shipping Info</Link></li>
                                <li><Link href="/returns" className="text-gray-400 hover:text-avhira-red">Returns</Link></li>
                                <li><Link href="/faq" className="text-gray-400 hover:text-avhira-red">FAQ</Link></li>
                                <li><Link href="/privacy" className="text-gray-400 hover:text-avhira-red">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Connect With Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-avhira-red">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-avhira-red">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 AVHIRA. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
            />

            {/* Cart Slider */}
            <CartSlider 
                isOpen={cartSliderOpen}
                onClose={() => setCartSliderOpen(false)}
            />
        </div>
    );
}
