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
    const [restoring, setRestoring] = useState(false);
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

    const handleLogout = async (e) => {
        e && e.preventDefault();
        try {
            // Use axios to POST logout then force a full reload so CSRF/meta tags are refreshed
            await window.axios.post('/logout');
            window.location.href = '/';
        } catch (err) {
            console.error('Logout failed, falling back to full navigation', err);
            // Fallback: navigate to root which will clear client state
            window.location.href = '/';
        }
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener('cart-updated', fetchCartCount);
        return () => window.removeEventListener('cart-updated', fetchCartCount);
    }, []);

    // If user just logged in and there's a guest cart saved, restore it server-side
    useEffect(() => {
        const tryRestoreGuestCart = async () => {
            try {
                if (!auth?.user) return;
                const raw = sessionStorage.getItem('guestCartToRestore');
                const redirect = sessionStorage.getItem('postAuthRedirect');
                if (!raw) return;
                let items = [];
                try { items = JSON.parse(raw); } catch (e) { console.warn('Failed parse guestCartToRestore', e); }
                if (!Array.isArray(items) || items.length === 0) {
                    sessionStorage.removeItem('guestCartToRestore');
                    return;
                }

                setRestoring(true);
                try {
                    // Small delay to ensure auth session/cookies are fully established after login reload
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    console.debug('MainLayout: calling /cart/merge-guest with items', items);
                    const res = await window.axios.post('/cart/merge-guest', { items });
                    console.debug('MainLayout: merge-guest response', res && res.data ? res.data : res);
                    // helpful toast for debugging in the browser
                    try { window.dispatchEvent(new Event('cart-updated')); } catch(e) {}
                } catch (e) {
                    console.warn('MainLayout: merge-guest failed', e);
                    try { window.dispatchEvent(new Event('cart-updated')); } catch(e) {}
                } finally {
                    setRestoring(false);
                }

                sessionStorage.removeItem('guestCartToRestore');

                if (redirect) {
                    sessionStorage.removeItem('postAuthRedirect');
                    window.location.href = redirect;
                }
            } catch (e) {
                console.error('Error restoring guest cart in MainLayout', e);
                setRestoring(false);
            }
        };

        tryRestoreGuestCart();
    }, [auth]);

    useEffect(() => {
        const handleOpenCart = () => setCartSliderOpen(true);
        const handleOpenAuth = () => setAuthModalOpen(true);
        window.addEventListener('open-cart-slider', handleOpenCart);
        window.addEventListener('open-auth-modal', handleOpenAuth);
        return () => {
            window.removeEventListener('open-cart-slider', handleOpenCart);
            window.removeEventListener('open-auth-modal', handleOpenAuth);
        };
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
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <div className="w-14 h-10 rounded-full flex items-center justify-center bg-white">
                                <img
                                    src="/apple-touch-icon.png"
                                    alt="AVHIRA Logo"
                                    className="w-14 h-14 object-contain"
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>
                            <img
                                src="/logo.svg"
                                alt="AVHIRA"
                                className="h-7 w-auto -ml-[20px]"
                                style={{ minWidth: 150 }}
                            />
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
                        {restoring && (
                            <div className="text-sm text-gray-600 mr-2 hidden sm:block">
                                Restoring cart...
                            </div>
                        )}
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
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-avhira-bg hover:text-avhira-red transition-colors"
                                    >
                                        Logout
                                    </button>
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
                                        <button
                                            onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                            className="text-sm text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg text-left"
                                        >
                                            Logout
                                        </button>
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

            {/* Spacer so content doesn't sit under the fixed nav (hidden on small screens so hero can touch top) */}
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
                                Contemporary Indian fashion inspired by Jaipur craftsmanship, designed for modern elegance and everyday comfort.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Policy Highlights</h4>
                            <ul className="space-y-2">
                                <li><Link href="/policies/privacy-policy" className="text-gray-400 hover:text-avhira-red">Privacy Policy</Link></li>
                                <li><Link href="/policies/terms-and-conditions" className="text-gray-400 hover:text-avhira-red">Terms & Conditions</Link></li>
                                <li><Link href="/policies/shipping-policy" className="text-gray-400 hover:text-avhira-red">Shipping Policy</Link></li>
                                <li><Link href="/policies/return-refund-exchange" className="text-gray-400 hover:text-avhira-red">Return, Refund & Exchange</Link></li>
                                <li><Link href="/policies/cancellation-policy" className="text-gray-400 hover:text-avhira-red">Cancellation Policy</Link></li>
                                <li><Link href="/policies/cookie-policy" className="text-gray-400 hover:text-avhira-red">Cookie Policy</Link></li>
                                <li><Link href="/policies/disclaimer" className="text-gray-400 hover:text-avhira-red">Disclaimer</Link></li>
                                <li><Link href="/policies/grievance-redressal" className="text-gray-400 hover:text-avhira-red">Grievance Redressal</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support & Contact</h4>
                            <ul className="space-y-2">
                                <li><Link href="/policies/contact-us" className="text-gray-400 hover:text-avhira-red">Contact Us</Link></li>
                                <li><Link href="/policies/faqs" className="text-gray-400 hover:text-avhira-red">FAQs</Link></li>
                                <li><a href="mailto:avhirahouse@gmail.com" className="text-gray-400 hover:text-avhira-red">avhirahouse@gmail.com</a></li>
                                <li><a href="tel:+919157903173" className="text-gray-400 hover:text-avhira-red">+91-9157903173</a></li>
                                <li className="text-gray-400">Mon-Sat, 10:00 AM - 6:00 PM IST</li>
                                <li><Link href="/about" className="text-gray-400 hover:text-avhira-red">About Avhira</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal & Compliance</h4>
                            <p className="text-gray-400 text-sm leading-6">
                                Compliant with applicable Indian laws including the Information Technology Act, Consumer Protection Act,
                                E-Commerce Rules, and GST regulations.
                            </p>
                            <p className="text-gray-500 text-xs mt-3 leading-5">
                                Disputes are governed by Indian law, with jurisdiction and arbitration seat at Ahmedabad, Gujarat, India.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 AVHIRA. All rights reserved.</p>
                        <p className="text-xs text-gray-500 mt-2">By using this website, you agree to Avhira's applicable policies including Privacy, Terms, Shipping, Returns, and Cookies.</p>
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
