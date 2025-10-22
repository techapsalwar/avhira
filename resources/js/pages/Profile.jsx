import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function Profile({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        pincode: user.pincode || '',
    });
    const { showToast } = useToast();

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile/update', {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Profile Updated', 'success');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="User Profile" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                disabled
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={data.address}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={data.city}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={data.state}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                                />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={data.country}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={data.pincode}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-avhira-red"
                                />
                                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-avhira-red/90 transition-colors disabled:opacity-60"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
