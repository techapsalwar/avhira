// File: resources/js/Components/AuthModal.jsx

import { useState, Fragment } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';
import { router } from '@inertiajs/react';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await window.axios.post('/login', loginData);
            
            showToast('Login successful!', 'success');
            onClose();
            
            // Reload the page to refresh auth state
            router.reload();
            
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                showToast(error.response?.data?.message || 'Login failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await window.axios.post('/register', registerData);
            
            showToast('Registration successful!', 'success');
            onClose();
            
            // Reload the page to refresh auth state
            router.reload();
            
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                showToast(error.response?.data?.message || 'Registration failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4" onClick={onClose}>
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-600">
                            {isLogin ? 'Login to your Avhira account' : 'Join the Avhira community'}
                        </p>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex gap-2 mb-6 bg-avhira-bg rounded-lg p-1">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setErrors({});
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                                isLogin
                                    ? 'text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            style={isLogin ? { backgroundColor: '#be1e2d' } : {}}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setErrors({});
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                                !isLogin
                                    ? 'text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            style={!isLogin ? { backgroundColor: '#be1e2d' } : {}}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={loginData.remember}
                                        onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 focus:ring-avhira-red"
                                        style={{ accentColor: '#be1e2d' }}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>

                                <a href="/forgot-password" className="text-sm hover:underline" style={{ color: '#be1e2d' }}>
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        /* Register Form */
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={registerData.password_confirmation}
                                    onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
