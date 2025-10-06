// File: resources/js/Pages/Dashboard.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <MainLayout>
            <Head title="Dashboard" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Stats Cards */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-semibold">Total Orders</h3>
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-semibold">Wishlist</h3>
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-600 font-semibold">Cart Items</h3>
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link 
                                href="/products"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Browse Products</h3>
                                    <p className="text-sm text-gray-600">Explore our collection</p>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/orders"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">View Orders</h3>
                                    <p className="text-sm text-gray-600">Track your purchases</p>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/cart"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                                    <p className="text-sm text-gray-600">View your cart</p>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/profile"
                                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-avhira-red hover:bg-avhira-bg transition-all"
                            >
                                <svg className="w-8 h-8 text-avhira-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                                    <p className="text-sm text-gray-600">Manage your account</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
