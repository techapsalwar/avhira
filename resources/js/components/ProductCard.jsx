// File: resources/js/Components/ProductCard.jsx

import { Link } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';
import { useState, useEffect, useRef } from 'react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function ProductCard({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [showSizeSelector, setShowSizeSelector] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const hoverTimerRef = useRef(null);
    const autoAdvanceTimerRef = useRef(null);
    
    // Handle product images
    let imageUrls = [];
    try {
        const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(images) && images.length > 0) {
            imageUrls = images.map(img => `/storage/${img.replace(/\\/g, '')}`);
        }
    } catch (e) {
        console.error("Failed to parse product images:", e);
    }
    
    const mainImage = imageUrls.length > 0 ? imageUrls[currentImageIndex] : 'https://via.placeholder.com/400x400.png?text=No+Image';

    const { showToast } = useToast();

    // Auto-advance images on hover after 3 seconds
    useEffect(() => {
        if (isHovering && imageUrls.length > 1) {
            // Start timer after 3 seconds of hovering
            hoverTimerRef.current = setTimeout(() => {
                // Start auto-advancing every 2 seconds
                autoAdvanceTimerRef.current = setInterval(() => {
                    setCurrentImageIndex((prevIndex) => 
                        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
                    );
                }, 1000);
            }, 0);
        } else {
            // Clear timers when not hovering
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
            if (autoAdvanceTimerRef.current) {
                clearInterval(autoAdvanceTimerRef.current);
            }
            // Reset to first image when hover ends
            setCurrentImageIndex(0);
        }

        // Cleanup on unmount
        return () => {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
            if (autoAdvanceTimerRef.current) {
                clearInterval(autoAdvanceTimerRef.current);
            }
        };
    }, [isHovering, imageUrls.length]);

    const regularPrice = Number(product.price || 0);
    const salePrice = product.sale_price ? Number(product.sale_price) : null;
    const hasDiscount = salePrice !== null && salePrice < regularPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    // Size availability indicator
    const availableSizes = product.available_sizes || [];
    const requiresSizeSelection = availableSizes.length > 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // If product requires size selection and no size is selected, show size selector
        if (requiresSizeSelection && !selectedSize) {
            setShowSizeSelector(true);
            return;
        }

        if (isAddingToCart) return; // Prevent double-click
        
        setIsAddingToCart(true);
        try {
            await window.axios.post('/cart/add', { 
                product_id: product.id, 
                quantity: quantity,
                size: selectedSize
            });
            showToast(`Added ${quantity} item(s) to cart!`);
            window.dispatchEvent(new Event('cart-updated'));
            window.dispatchEvent(new Event('open-cart-slider'));
            
            // Reset state after adding
            setQuantity(1);
            setSelectedSize(null);
            setShowSizeSelector(false);
        } catch (err) {
            showToast('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setShowSizeSelector(false);
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden bg-white shadow-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(190,30,45,0.15)] h-full flex flex-col">
            {/* Discount badge */}
            {hasDiscount && (
                <div className="absolute top-3 right-3 z-20 bg-[#be1e2d] text-white text-xs font-semibold rounded-full px-3 py-1 shadow-lg">
                    -{discountPercent}%
                </div>
            )}
            
            <Link href={`/products/${product.slug}`} className="block flex-none relative">
                <div 
                    className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-avhira-bg relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="h-72 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Image navigation dots */}
                    {imageUrls.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                            {imageUrls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentImageIndex 
                                            ? 'bg-avhira-red w-6' 
                                            : 'bg-white/70 hover:bg-white'
                                    }`}
                                    aria-label={`View image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-avhira-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </Link>
            
            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col justify-start gap-2">
                <h3 className="text-base text-gray-900 font-semibold truncate group-hover:text-avhira-red transition-colors">
                    {product.name}
                </h3>
                
                {/* Price */}
                <div className="mt-1 flex items-end gap-3">
                    {hasDiscount ? (
                        <>
                            <div className="text-sm text-gray-500 line-through">{formatPrice(regularPrice)}</div>
                            <div className="text-lg font-bold text-avhira-red">{formatPrice(salePrice)}</div>
                        </>
                    ) : (
                        <div className="text-lg font-bold text-gray-900">{formatPrice(regularPrice)}</div>
                    )}
                </div>

                {/* Selected Size Display */}
                {selectedSize && (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <span className="text-xs text-gray-600">Size:</span>
                        <span className="text-sm font-semibold px-2 py-1 rounded-lg" 
                              style={{ backgroundColor: 'rgba(190, 30, 45, 0.1)', color: '#be1e2d' }}>
                            {selectedSize}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSize(null);
                                setShowSizeSelector(true);
                            }}
                            className="text-xs text-gray-500 hover:text-avhira-red underline"
                        >
                            Change
                        </button>
                    </div>
                )}

                {/* Quantity Selector */}
                {!showSizeSelector && (requiresSizeSelection ? selectedSize : true) && (
                    <div className="flex items-center justify-between mt-2 animate-fade-in">
                        <span className="text-xs text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(Math.max(1, quantity - 1));
                                }}
                                disabled={quantity <= 1}
                                className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all hover:border-[#be1e2d] disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ borderColor: '#e5e7eb' }}
                            >
                                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuantity(Math.min(10, quantity + 1));
                                }}
                                disabled={quantity >= 10}
                                className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all hover:border-[#be1e2d] disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ borderColor: '#e5e7eb' }}
                            >
                                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Size Selector or Add to Cart Button */}
            <div className="p-4 pt-0 flex-none">
                {showSizeSelector ? (
                    <div className="space-y-2 animate-fade-in">
                        <div className="text-xs text-gray-600 font-medium text-center mb-2">Select Size:</div>
                        <div className="grid grid-cols-4 gap-2">
                            {availableSizes.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSizeSelect(size);
                                    }}
                                    className="py-2 px-1 text-sm font-semibold rounded-lg border-2 transition-all transform hover:scale-105"
                                    style={{
                                        borderColor: '#be1e2d',
                                        color: '#be1e2d',
                                        backgroundColor: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#be1e2d';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = '#be1e2d';
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowSizeSelector(false);
                            }}
                            className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        className="w-full py-2.5 px-4 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#be1e2d] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                        onMouseEnter={(e) => !isAddingToCart && (e.currentTarget.style.backgroundColor = '#9a1824')}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#be1e2d'}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            {isAddingToCart ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Adding...
                                </>
                            ) : requiresSizeSelection && !selectedSize ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Select Size
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
