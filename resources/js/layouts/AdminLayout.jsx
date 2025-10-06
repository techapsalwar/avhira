// File: resources/js/Layouts/AdminLayout.jsx

import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ title, children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: '📊', current: url === '/admin' },
        { name: 'Categories', href: '/admin/categories', icon: '📁', current: url.startsWith('/admin/categories') },
        { name: 'Products', href: '/admin/products', icon: '👕', current: url.startsWith('/admin/products') },
        { name: 'Orders', href: '/admin/orders', icon: '📦', current: url.startsWith('/admin/orders') },
        { name: 'Users', href: '/admin/users', icon: '👥', current: url.startsWith('/admin/users') },
    ];

    return (
        <div className="min-h-screen bg-avhira-bg">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <span className="text-white text-2xl">×</span>
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl font-bold" style={{ color: '#be1e2d' }}>Avhira</span>
                                <span className="text-sm text-gray-500">Admin</span>
                            </Link>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? 'text-white shadow-md'
                                            : 'text-gray-700 hover:bg-avhira-bg hover:text-avhira-red'
                                    } group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all`}
                                    style={item.current ? { backgroundColor: '#be1e2d' } : {}}
                                >
                                    <span className="mr-3 text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <Link
                            href="/"
                            className="flex-shrink-0 w-full group block"
                        >
                            <div className="flex items-center">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">
                                        ← Back to Store
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white shadow-lg">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 mb-6">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl font-bold" style={{ color: '#be1e2d' }}>Avhira</span>
                                <span className="text-sm text-gray-500 font-semibold">ADMIN</span>
                            </Link>
                        </div>
                        <nav className="flex-1 px-2 bg-white space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? 'text-white shadow-md'
                                            : 'text-gray-700 hover:bg-avhira-bg hover:text-avhira-red'
                                    } group flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all`}
                                    style={item.current ? { backgroundColor: '#be1e2d' } : {}}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 border-t border-gray-200 p-4">
                        <Link
                            href="/"
                            className="flex-shrink-0 w-full group block hover:bg-avhira-bg rounded-lg p-2 transition-colors"
                        >
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-avhira-red">
                                        ← Back to Store
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow-sm">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset"
                        style={{ focusRingColor: '#be1e2d' }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <span className="text-2xl">☰</span>
                    </button>
                </div>
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {title && (
                                <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
                            )}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
