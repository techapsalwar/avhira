// File: resources/js/Components/ProductCard.jsx

import { Link } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export default function ProductCard({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [step, setStep] = useState('idle'); // 'idle', 'size'
    const [selectedSize, setSelectedSize] = useState(null);
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

    // Handle cart icon click
    const handleCartIconClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (step === 'idle') {
            // If product requires size selection, show size selector
            if (requiresSizeSelection) {
                setStep('size');
            } else {
                // If no size required, add to cart immediately
                handleAddToCart(e);
            }
        } else if (step === 'size') {
            // X button - close the bar
            handleCancel(e);
        }
    };

    // Handle size selection - Add to cart immediately after size is selected
    const handleSizeSelect = async (size) => {
        setSelectedSize(size);
        setIsAddingToCart(true);
        
        try {
            await window.axios.post('/cart/add', { 
                product_id: product.id, 
                quantity: 1,
                size: size
            });
            showToast(`Added to cart!`);
            window.dispatchEvent(new Event('cart-updated'));
            window.dispatchEvent(new Event('open-cart-slider'));
            
            // Reset state
            setStep('idle');
            setSelectedSize(null);
        } catch (err) {
            showToast('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handle add to cart (for products without size selection)
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAddingToCart) return;
        
        setIsAddingToCart(true);
        try {
            await window.axios.post('/cart/add', { 
                product_id: product.id, 
                quantity: 1,
                size: null
            });
            showToast(`Added to cart!`);
            window.dispatchEvent(new Event('cart-updated'));
            window.dispatchEvent(new Event('open-cart-slider'));
            
            // Reset state
            setStep('idle');
            setSelectedSize(null);
        } catch (err) {
            showToast('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handle cancel
    const handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStep('idle');
        setSelectedSize(null);
    };

    return (
        <div className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            {/* Image index dots - top left corner */}
            {imageUrls.length > 1 && (
                <div className="absolute top-3 left-3 z-30 flex gap-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentImageIndex % 4 === idx
                                    ? 'bg-[#be1e2d] scale-110 shadow-md'
                                    : 'bg-gray-300 opacity-60'
                            }`}
                            style={{ boxShadow: currentImageIndex % 4 === idx ? '0 0 0 2px #fff' : undefined }}
                        />
                    ))}
                </div>
            )}
            {/* Discount badge */}
            {hasDiscount && (
                <div className="absolute top-4 right-4 z-30 bg-[#be1e2d] text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-lg">
                    -{discountPercent}%
                </div>
            )}
            
            <Link href={`/products/${product.slug}`} className="block flex-none relative">
                <div 
                    className="aspect-[3/4] w-full overflow-hidden bg-gray-50 relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Interactive overlay on product image */}
                    <div className="absolute bottom-0 md:bottom-4 right-0 md:right-4 left-0 md:left-auto">
                        <div className="flex items-center justify-end gap-1 md:gap-2 px-2 pb-2 md:p-0">
                            {/* Horizontal sliding bar - slides from right */}
                            {step !== 'idle' && (
                                <div className="animate-in slide-in-from-right duration-300 flex items-center gap-1 md:gap-2 bg-white/95 backdrop-blur-sm rounded-full px-2 md:px-4 py-1.5 md:py-3 shadow-lg h-9 md:h-12 max-w-[calc(100%-2.5rem)] md:max-w-none">
                                    {/* Size Selector */}
                                    {step === 'size' && (
                                        <div className="flex items-center gap-0.5 md:gap-1.5 overflow-x-auto scrollbar-hide">
                                            {availableSizes.map((size, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleSizeSelect(size);
                                                    }}
                                                    disabled={isAddingToCart}
                                                    className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 flex items-center justify-center text-[10px] md:text-xs font-bold rounded-full border-2 border-[#be1e2d] text-[#be1e2d] hover:bg-[#be1e2d] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Cart/Close Button - Always visible */}
                            <button
                                onClick={handleCartIconClick}
                                disabled={isAddingToCart}
                                className="w-9 h-9 md:w-12 md:h-12 flex-shrink-0 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 hover:bg-[#be1e2d] hover:text-white transition-all duration-300 group/cart disabled:opacity-50 disabled:cursor-not-allowed relative"
                            >
                                {isAddingToCart ? (
                                    <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-[#be1e2d] border-t-transparent rounded-full animate-spin" />
                                ) : step === 'size' ? (
                                    <X className="w-4 h-4 md:w-5 md:h-5 text-[#be1e2d] group-hover/cart:text-white transition-colors" />
                                ) : (
                                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-[#be1e2d] group-hover/cart:text-white transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* Product Info - Outside image, clean and minimal */}
            <div className="p-3 flex-1 flex flex-col justify-start gap-1">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#be1e2d] transition-colors leading-tight">
                    {product.name}
                </h3>
                
                {/* Price */}
                <div className="flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-lg font-bold text-[#be1e2d]">{formatPrice(salePrice)}</span>
                            <span className="text-xs text-gray-400 line-through">{formatPrice(regularPrice)}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-900">{formatPrice(regularPrice)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
