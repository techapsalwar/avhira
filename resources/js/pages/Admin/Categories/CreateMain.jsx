import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateMainCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        display_order: 0,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/categories/main');
    };

    return (
        <AdminLayout title="Create Main Category">
            <Head title="Create Main Category - Admin" />
            
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Main Category</h1>
                            <p className="text-gray-600 mt-1">Add a new main category to your store</p>
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
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Main Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avhira-red focus:border-transparent"
                                placeholder="e.g., Men, Women, Kids"
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
                                placeholder="Enter a description for this main category..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
                                {processing ? 'Creating...' : 'Create Main Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
