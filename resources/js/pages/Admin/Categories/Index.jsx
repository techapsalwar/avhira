import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function CategoriesIndex({ subcategories, mainCategories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [mainCategoryFilter, setMainCategoryFilter] = useState(filters?.main_category || '');
    const [activeTab, setActiveTab] = useState('subcategories');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search, main_category: mainCategoryFilter }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the subcategory "${name}"?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const handleMainCategoryDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the main category "${name}"?`)) {
            router.delete(`/admin/categories/main/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setMainCategoryFilter('');
        router.get('/admin/categories');
    };

    return (
        <AdminLayout title="Categories Management">
            <Head title="Categories - Admin" />
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                            <p className="text-gray-600 mt-1">Manage main categories and subcategories</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/admin/categories/main/create" className="px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2" style={{ backgroundColor: '#be1e2d' }}>
                                <span>+</span> Add Main Category
                            </Link>
                            <Link href="/admin/categories/create" className="px-6 py-2 rounded-lg font-semibold bg-gray-700 text-white shadow-md hover:bg-gray-800 hover:shadow-lg transition-all inline-flex items-center gap-2">
                                <span>+</span> Add Subcategory
                            </Link>
                        </div>
                    </div>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setActiveTab('subcategories')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'subcategories' ? 'border-avhira-red text-avhira-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                Subcategories ({subcategories?.total || 0})
                            </button>
                            <button onClick={() => setActiveTab('main')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'main' ? 'border-avhira-red text-avhira-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                Main Categories ({mainCategories?.length || 0})
                            </button>
                        </nav>
                    </div>
                </div>
                {activeTab === 'subcategories' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                                        <select value={mainCategoryFilter} onChange={(e) => setMainCategoryFilter(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                                            <option value="">All</option>
                                            {mainCategories?.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button type="submit" className="flex-1 px-6 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: '#be1e2d' }}>Search</button>
                                        <button type="button" onClick={clearFilters} className="px-6 py-2 rounded-lg bg-gray-200 font-medium">Clear</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-avhira-bg">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Main Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Products</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {subcategories?.data?.length > 0 ? (subcategories.data.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4"><div className="font-medium">{sub.name}</div><div className="text-xs text-gray-500">{sub.slug}</div></td>
                                                <td className="px-6 py-4">{sub.main_category?.name}</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white">{sub.products_count || 0}</span></td>
                                                <td className="px-6 py-4">{sub.is_active ? (<span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>) : (<span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>)}</td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <Link href={`/admin/categories/${sub.id}/edit`} className="text-red-600 hover:underline font-medium">Edit</Link>
                                                    <button onClick={() => handleDelete(sub.id, sub.name)} className="text-red-600 hover:underline font-medium">Delete</button>
                                                </td>
                                            </tr>
                                        ))) : (<tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No subcategories found</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'main' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mainCategories?.length > 0 ? (mainCategories.map((cat) => (
                            <div key={cat.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between mb-4">
                                    <div><h3 className="text-xl font-bold">{cat.name}</h3><p className="text-sm text-gray-500">{cat.slug}</p></div>
                                    {cat.is_active ? (<span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 h-fit">Active</span>) : (<span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 h-fit">Inactive</span>)}
                                </div>
                                {cat.description && (<p className="text-sm text-gray-600 mb-4">{cat.description}</p>)}
                                <div className="mb-4 text-sm text-gray-500"><span>{cat.subcategories_count || 0} subcategories</span></div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/categories/main/${cat.id}/edit`} className="flex-1 text-center py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white">Edit</Link>
                                    <button onClick={() => handleMainCategoryDelete(cat.id, cat.name)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white">Delete</button>
                                </div>
                            </div>
                        ))) : (<div className="col-span-full"><div className="bg-white rounded-2xl shadow-md p-12 text-center"><p className="text-gray-400 mb-4">No main categories found</p><Link href="/admin/categories/main/create" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: '#be1e2d' }}><span>+</span> Create First Main Category</Link></div></div>)}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
