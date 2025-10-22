// File: resources/js/Pages/Products/Show.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function Show({ product }) {
    // Parse images
    let images = [];
    try {
        const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        images = Array.isArray(parsedImages) ? parsedImages : [];
    } catch (e) {
        images = [];
    }

    const imageUrls = images.length > 0 
        ? images.map(img => `/storage/${img.replace(/\\/g, '')}`)
        : ['https://via.placeholder.com/600x600.png?text=No+Image'];

    const { showToast } = useToast();
    
    const [activeImage, setActiveImage] = useState(imageUrls[0]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showVideo, setShowVideo] = useState(false);

    const availableSizes = product.available_sizes || [];
    const hasVideo = product.video_url && product.video_url.trim() !== '';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    const regularPrice = Number(product.price || 0);
    const salePrice = product.sale_price ? Number(product.sale_price) : null;
    const hasDiscount = salePrice !== null && salePrice < regularPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
    const displayPrice = hasDiscount ? salePrice : regularPrice;

    const handleAddToCart = async () => {
        if (availableSizes.length > 0 && !selectedSize) {
            showToast('Please select a size');
            return;
        }

        try {
            await window.axios.post('/cart/add', { 
                product_id: product.id, 
                quantity: quantity,
                size: selectedSize 
            });
            showToast(`Added ${quantity} item(s) to cart!`);
            window.dispatchEvent(new Event('cart-updated'));
            window.dispatchEvent(new Event('open-cart-slider'));
        } catch (err) {
            showToast('Failed to add to cart');
        }
    };

    return (
        <MainLayout>
            <Head title={product.name} />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Section */}
                    <div className="space-y-4">
                        {/* Main Image/Video Display */}
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-avhira-bg shadow-lg relative">
                            {/* Left Arrow */}
                            {imageUrls.length > 1 && !showVideo && (
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white/90 text-gray-700 rounded-full p-2 shadow transition-all focus:outline-none"
                                    style={{ backdropFilter: 'blur(2px)' }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        const currentIdx = imageUrls.indexOf(activeImage);
                                        const prevIdx = (currentIdx - 1 + imageUrls.length) % imageUrls.length;
                                        setActiveImage(imageUrls[prevIdx]);
                                        setShowVideo(false);
                                    }}
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            {/* Main Image/Video */}
                            {showVideo && hasVideo ? (
                                <video
                                    src={product.video_url}
                                    controls
                                    className="h-full w-full object-cover"
                                    autoPlay
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center select-none"
                                />
                            )}
                            {/* Right Arrow */}
                            {imageUrls.length > 1 && !showVideo && (
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white/90 text-gray-700 rounded-full p-2 shadow transition-all focus:outline-none"
                                    style={{ backdropFilter: 'blur(2px)' }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        const currentIdx = imageUrls.indexOf(activeImage);
                                        const nextIdx = (currentIdx + 1) % imageUrls.length;
                                        setActiveImage(imageUrls[nextIdx]);
                                        setShowVideo(false);
                                    }}
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                            {/* Discount Badge */}
                            {hasDiscount && !showVideo && (
                                <div className="absolute top-4 right-4 bg-[#be1e2d] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                    -{discountPercent}%
                                </div>
                            )}
                        </div>

                        {/* Thumbnails Grid */}
                        <div className="grid grid-cols-5 gap-3">
                            {/* Video Thumbnail */}
                            {hasVideo && (
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                        showVideo ? 'border-avhira-red shadow-md' : 'border-gray-300 hover:border-avhira-red'
                                    }`}
                                >
                                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-avhira-red" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                </button>
                            )}
                            
                            {/* Image Thumbnails */}
                            {imageUrls.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveImage(image);
                                        setShowVideo(false);
                                    }}
                                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImage === image && !showVideo 
                                            ? 'border-avhira-red shadow-md scale-105' 
                                            : 'border-gray-300 hover:border-avhira-red'
                                    }`}
                                >
                                    <img 
                                        src={image} 
                                        alt={`${product.name} view ${index + 1}`}
                                        className="aspect-square object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            {product.category && (
                                <p className="text-sm text-gray-600">
                                    Category: <span className="text-avhira-red font-medium">{product.category.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="border-t border-b border-gray-200 py-4">
                            {hasDiscount ? (
                                <div className="flex items-center gap-4">
                                    <p className="text-4xl font-bold text-avhira-red">{formatPrice(salePrice)}</p>
                                    <p className="text-xl text-gray-500 line-through">{formatPrice(regularPrice)}</p>
                                    <span className="bg-avhira-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Save {discountPercent}%
                                    </span>
                                </div>
                            ) : (
                                <p className="text-4xl font-bold text-gray-900">{formatPrice(regularPrice)}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Size Selection */}
                        {availableSizes.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h2>
                                <div className="flex gap-3 flex-wrap">
                                    {availableSizes.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                                selectedSize === size
                                                    ? 'bg-[#be1e2d] text-white shadow-md scale-105'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#be1e2d]'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-avhira-red flex items-center justify-center font-bold text-xl"
                                >
                                    −
                                </button>
                                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-avhira-red flex items-center justify-center font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Stock Info */}
                        <div className="text-sm">
                            {product.stock_quantity > 0 ? (
                                <p className="text-green-600 font-medium">
                                    ✓ In Stock ({product.stock_quantity} available)
                                </p>
                            ) : (
                                <p className="text-red-600 font-medium">✗ Out of Stock</p>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0}
                            className="w-full bg-gradient-to-r from-[#be1e2d] to-[#9a1824] text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg hover:from-[#9a1824] hover:to-[#be1e2d] focus:outline-none focus:ring-4 focus:ring-[#be1e2d]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            <span className="inline-flex items-center justify-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                </svg>
                                Add to Cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
