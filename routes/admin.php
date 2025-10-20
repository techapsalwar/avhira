<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    
    // Users management
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('admin.users.toggle-admin');
    
    // Main Categories management
    Route::get('/categories/main', [AdminCategoryController::class, 'indexMain'])->name('admin.categories.main.index');
    Route::get('/categories/main/create', [AdminCategoryController::class, 'createMain'])->name('admin.categories.main.create');
    Route::post('/categories/main', [AdminCategoryController::class, 'storeMain'])->name('admin.categories.main.store');
    Route::get('/categories/main/{mainCategory}/edit', [AdminCategoryController::class, 'editMain'])->name('admin.categories.main.edit');
    Route::put('/categories/main/{mainCategory}', [AdminCategoryController::class, 'updateMain'])->name('admin.categories.main.update');
    Route::delete('/categories/main/{mainCategory}', [AdminCategoryController::class, 'destroyMain'])->name('admin.categories.main.destroy');
    
    // Subcategories management
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('admin.categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/categories/{subcategory}/edit', [AdminCategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/categories/{subcategory}', [AdminCategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{subcategory}', [AdminCategoryController::class, 'destroy'])->name('admin.categories.destroy');
    
    // Products management
    Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{id}/edit', [AdminProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::get('/products/{id}', [AdminProductController::class, 'show'])->name('admin.products.show');

    // Orders management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
    Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'generateInvoice'])->name('admin.orders.invoice');
});
