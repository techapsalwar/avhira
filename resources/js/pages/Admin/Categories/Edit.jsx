import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function EditSubcategory({ subcategory, mainCategories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: subcategory.name || '',
        main_category_id: subcategory.main_category_id || '',
        description: subcategory.description || '',
        display_order: subcategory.display_order || 0,
        is_active: subcategory.is_active ?? true,
        image: null,
        existing_image: subcategory.image || null,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeExistingImage = () => {
        setData('existing_image', null);
    };

    const removeNewImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/categories/${subcategory.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Subcategory">
            <Head title={`Edit ${subcategory.name} - Admin`} />
            
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Subcategory</h1>
                            <p className="text-gray-600 mt-1">Update subcategory details</p>
                        </div>
                        <Link
                            href="/admin/categories"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            ← Back to Categories
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="main_category_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                Main Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="main_category_id"
                                value={data.main_category_id}
                                onChange={(e) => setData('main_category_id', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                required
                            >
                                <option value="">Select a main category</option>
                                {mainCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.main_category_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.main_category_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Subcategory Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                placeholder="e.g., T-Shirts"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                placeholder="Enter a description for this subcategory..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Subcategory Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subcategory Image
                            </label>
                            
                            {/* Current Image */}
                            {data.existing_image && !imagePreview && (
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-2">
                                        Current Image
                                    </label>
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                                            <img
                                                src={`/storage/${data.existing_image}`}
                                                alt={subcategory.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeExistingImage}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 shadow-md"
                                            title="Remove image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Image Upload */}
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Upload an image that will be displayed in a circular container on the website</p>
                            
                            {/* New Image Preview */}
                            {imagePreview && (
                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-2">
                                        New Image Preview
                                    </label>
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 shadow-lg">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeNewImage}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 shadow-md"
                                            title="Remove new image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="display_order" className="block text-sm font-semibold text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                id="display_order"
                                value={data.display_order}
                                onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                min="0"
                            />
                            {errors.display_order && (
                                <p className="mt-1 text-sm text-red-600">{errors.display_order}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-avhira-red border-gray-300 rounded focus:ring-avhira-red"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                                Active (visible on website)
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Link
                                href="/admin/categories"
                                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 text-sm font-semibold text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#be1e2d' }}
                            >
                                {processing ? 'Updating...' : 'Update Subcategory'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
