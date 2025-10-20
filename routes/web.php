<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Products
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{mainCategory:slug}', [CategoryController::class, 'showMain'])->name('categories.main.show');
Route::get('/categories/{mainCategory:slug}/{subcategory:slug}', [CategoryController::class, 'showSubcategory'])->name('categories.subcategory.show');

// Cart
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');
Route::get('/cart/items', [CartController::class, 'items'])->name('cart.items');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::match(['patch', 'put'], '/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cart}', [CartController::class, 'remove'])->name('cart.remove');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::post('/api/checkout/create-razorpay-order', [CheckoutController::class, 'createRazorpayOrder'])->name('checkout.razorpay');
Route::get('/order/success/{orderId}', [CheckoutController::class, 'success'])->name('order.success');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
