// File: resources/js/Pages/Admin/Products/Edit.jsx

import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function EditProduct({ product, mainCategories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '', 
        main_category_id: product.subcategory?.main_category_id || '',
        subcategory_id: product.subcategory_id || '',
        description: product.description || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        stock_quantity: product.stock_quantity || '',
        sku: product.sku || '',
        is_featured: product.is_featured || false,
        new_images: [],
        existing_images: product.images || [],
        video_url: product.video_url || '',
        available_sizes: product.available_sizes || [],
        _method: 'PUT',
    });

    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [availableSizeOptions] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']);
    const [selectedMainCategory, setSelectedMainCategory] = useState(
        mainCategories?.find(cat => cat.id === product.subcategory?.main_category_id)
    );
    const [discountPercentage, setDiscountPercentage] = useState(() => {
        if (product.sale_price && product.price) {
            return ((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100).toFixed(2);
        }
        return '';
    });

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('new_images', files);

        const previews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(previews);
    };

    const removeExistingImage = (index) => {
        const updated = data.existing_images.filter((_, i) => i !== index);
        setData('existing_images', updated);
    };

    const handleSizeToggle = (size) => {
        const currentSizes = data.available_sizes;
        if (currentSizes.includes(size)) {
            setData('available_sizes', currentSizes.filter(s => s !== size));
        } else {
            setData('available_sizes', [...currentSizes, size]);
        }
    };

    const handlePriceChange = (newPrice) => {
        setData('price', newPrice);
        if (discountPercentage && newPrice) {
            const calculatedSalePrice = (parseFloat(newPrice) * (1 - parseFloat(discountPercentage) / 100)).toFixed(2);
            setData('sale_price', calculatedSalePrice);
        }
    };

    const handleDiscountChange = (discount) => {
        setDiscountPercentage(discount);
        if (discount && data.price) {
            const calculatedSalePrice = (parseFloat(data.price) * (1 - parseFloat(discount) / 100)).toFixed(2);
            setData('sale_price', calculatedSalePrice);
        } else if (!discount) {
            setData('sale_price', '');
        }
    };

    const handleSalePriceChange = (salePrice) => {
        setData('sale_price', salePrice);
        if (salePrice && data.price) {
            const calculatedDiscount = ((1 - parseFloat(salePrice) / parseFloat(data.price)) * 100).toFixed(2);
            setDiscountPercentage(calculatedDiscount >= 0 ? calculatedDiscount : '0');
        } else if (!salePrice) {
            setDiscountPercentage('');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Product">
            <Head title={`Edit ${product.name} - Admin`} />

            <div className="max-w-4xl">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <form onSubmit={submit} className="space-y-6">

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU Code
                            </label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                        </div>


                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Category *
                                </label>
                                <select
                                    value={data.main_category_id}
                                    onChange={(e) => {
                                        const mainCatId = e.target.value;
                                        setData('main_category_id', mainCatId);
                                        setData('subcategory_id', ''); // Reset subcategory
                                        setSelectedMainCategory(mainCategories?.find(cat => cat.id === parseInt(mainCatId)));
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                >
                                    <option value="">Select Main Category</option>
                                    {mainCategories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.main_category_id && <p className="mt-1 text-sm text-red-600">{errors.main_category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategory *
                                </label>
                                <select
                                    value={data.subcategory_id}
                                    onChange={(e) => setData('subcategory_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                    disabled={!selectedMainCategory}
                                >
                                    <option value="">Select Subcategory</option>
                                    {selectedMainCategory?.active_subcategories?.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                                {errors.subcategory_id && <p className="mt-1 text-sm text-red-600">{errors.subcategory_id}</p>}
                            </div>
                        </div>

                        

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Regular Price *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                />
                                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount %
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={discountPercentage}
                                    onChange={(e) => handleDiscountChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                    placeholder="0"
                                />
                                <p className="mt-1 text-xs text-gray-500">Auto-calculates sale price</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sale Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.sale_price}
                                    onChange={(e) => handleSalePriceChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                />
                                {errors.sale_price && <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                />
                                {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                            </div>
                        </div>

                        

                        {/* Available Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Sizes *
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {availableSizeOptions.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            data.available_sizes.includes(size)
                                                ? 'text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        style={data.available_sizes.includes(size) ? { backgroundColor: '#be1e2d' } : {}}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {errors.available_sizes && <p className="mt-1 text-sm text-red-600">{errors.available_sizes}</p>}
                        </div>

                        {/* Existing Images */}
                        {data.existing_images && data.existing_images.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Images
                                </label>
                                <div className="grid grid-cols-4 gap-4">
                                    {data.existing_images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add New Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleNewImageChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            
                            {newImagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-4 gap-4">
                                    {newImagePreviews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL
                            </label>
                            <input
                                type="url"
                                value={data.video_url}
                                onChange={(e) => setData('video_url', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 focus:ring-avhira-red"
                                style={{ accentColor: '#be1e2d' }}
                            />
                            <label className="ml-3 text-sm font-medium text-gray-700">
                                Mark as Featured Product
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50"
                                style={{ backgroundColor: '#be1e2d', color: '#faf5f6' }}
                                onMouseEnter={(e) => !processing && (e.currentTarget.style.backgroundColor = '#9a1824')}
                                onMouseLeave={(e) => !processing && (e.currentTarget.style.backgroundColor = '#be1e2d')}
                            >
                                {processing ? 'Updating...' : 'Update Product'}
                            </button>
                            <Link
                                href="/admin/products"
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
