// File: resources/js/Pages/Checkout/Index.jsx

import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CheckoutIndex({ cartItems, auth, razorpayKey }) {
    const [currentStep, setCurrentStep] = useState(auth?.user ? 2 : 1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [form, setForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || '',
        city: auth?.user?.city || '',
        state: auth?.user?.state || '',
        pincode: auth?.user?.pincode || '',
        country: auth?.user?.country || 'India',
        password: '',
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.sale_price ?? item.product.price;
        return sum + (price * item.quantity);
    }, 0);
    
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
        if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!auth?.user && !form.password) {
            newErrors.password = 'Password is required for new accounts';
        }
        if (form.password && form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        
        // Validate contact info (important for logged-in users)
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
        if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        // Validate address fields
        if (!form.address.trim()) newErrors.address = 'Address is required';
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.state.trim()) newErrors.state = 'State is required';
        if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!validateStep2()) return;

        setLoading(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert('Failed to load payment gateway. Please try again.');
                setLoading(false);
                return;
            }

            // Create Razorpay order
            const { data } = await axios.post('/api/checkout/create-razorpay-order', {
                amount: total,
            });

            const options = {
                key: razorpayKey,
                amount: data.amount,
                currency: 'INR',
                name: 'Avhira',
                description: 'Purchase from Avhira',
                order_id: data.order_id,
                handler: function (response) {
                    // Payment successful, submit form with payment details
                    router.post('/checkout', {
                        ...form,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    }, {
                        onSuccess: () => {
                            setLoading(false);
                        },
                        onError: (errors) => {
                            setErrors(errors);
                            setLoading(false);
                        },
                    });
                },
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                notes: {
                    address: form.address,
                },
                theme: {
                    color: '#be1e2d',
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <MainLayout>
            <Head title="Checkout - Avhira" />

            <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#faf5f6' }}>
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                        <p className="text-gray-600">Complete your purchase securely</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="flex items-center justify-center">
                            {/* Step 1 */}
                            <div className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                                    currentStep >= 1
                                        ? 'bg-avhira-red text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    {currentStep > 1 ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : '1'}
                                </div>
                                <span className={`ml-2 hidden sm:block font-medium ${
                                    currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                    Contact Info
                                </span>
                            </div>

                            {/* Connector */}
                            <div className={`w-16 sm:w-24 h-1 mx-2 sm:mx-4 transition-all ${
                                currentStep >= 2 ? 'bg-avhira-red' : 'bg-gray-300'
                            }`} />

                            {/* Step 2 */}
                            <div className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                                    currentStep >= 2
                                        ? 'bg-avhira-red text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    2
                                </div>
                                <span className={`ml-2 hidden sm:block font-medium ${
                                    currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                    Delivery & Payment
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main Form Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                                {/* Step 1: Contact Information */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                                            <p className="text-gray-600">We'll use this to keep you updated about your order</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name <span className="text-avhira-red">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                        errors.name
                                                            ? 'border-red-500'
                                                            : 'border-gray-300 focus:border-avhira-red'
                                                    }`}
                                                    placeholder="Enter your full name"
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        disabled={!!auth?.user}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.email
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        } ${auth?.user ? 'bg-gray-100' : ''}`}
                                                        placeholder="your@email.com"
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.phone
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="10-digit mobile number"
                                                        maxLength="10"
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {!auth?.user && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Create Password <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.password
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="Minimum 8 characters"
                                                    />
                                                    {errors.password && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                                    )}
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        We'll create an account for you to track your order
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleContinue}
                                            className="w-full py-4 px-6 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                                            style={{ backgroundColor: '#be1e2d' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9a1824'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                                        >
                                            Continue to Delivery
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: Delivery Address & Payment */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact & Delivery</h2>
                                                <p className="text-gray-600">Enter your contact details and delivery address</p>
                                            </div>
                                            {!auth?.user && (
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="text-avhira-red hover:text-red-700 font-medium transition-colors"
                                                >
                                                    ← Back
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {/* Contact Information - Always visible in Step 2 */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.name
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.phone
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="10-digit mobile number"
                                                        maxLength="10"
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Complete Address <span className="text-avhira-red">*</span>
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 resize-none ${
                                                        errors.address
                                                            ? 'border-red-500'
                                                            : 'border-gray-300 focus:border-avhira-red'
                                                    }`}
                                                    placeholder="House/Flat No, Street Name, Area, Landmark"
                                                />
                                                {errors.address && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Pincode <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={form.pincode}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.pincode
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="6-digit PIN"
                                                        maxLength="6"
                                                    />
                                                    {errors.pincode && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.city
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="Your city"
                                                    />
                                                    {errors.city && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        State <span className="text-avhira-red">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={form.state}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-avhira-red/20 ${
                                                            errors.state
                                                                ? 'border-red-500'
                                                                : 'border-gray-300 focus:border-avhira-red'
                                                        }`}
                                                        placeholder="Your state"
                                                    />
                                                    {errors.state && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={form.country}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handlePayment}
                                                disabled={loading}
                                                className="w-full py-4 px-6 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                style={{ backgroundColor: '#be1e2d' }}
                                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Proceed to Payment • {formatPrice(total)}
                                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                            <p className="mt-3 text-center text-sm text-gray-500">
                                                🔒 Secure payment powered by Razorpay
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                                
                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item, index) => {
                                        const price = item.product.sale_price ?? item.product.price;
                                        const imageUrl = (() => {
                                            try {
                                                const images = typeof item.product.images === 'string'
                                                    ? JSON.parse(item.product.images)
                                                    : item.product.images;
                                                return Array.isArray(images) && images.length > 0
                                                    ? `/storage/${images[0].replace(/\\/g, '')}`
                                                    : 'https://via.placeholder.com/80x80.png?text=Product';
                                            } catch {
                                                return 'https://via.placeholder.com/80x80.png?text=Product';
                                            }
                                        })();

                                        return (
                                            <div key={index} className="flex gap-3">
                                                <img
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    {item.size && (
                                                        <p className="text-xs text-gray-500">Size: {item.size}</p>
                                                    )}
                                                    <p className="text-sm font-bold text-avhira-red mt-1">
                                                        {formatPrice(price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                                        <span>Total</span>
                                        <span style={{ color: '#be1e2d' }}>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Secure Checkout
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        All cards accepted
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Easy Returns
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
