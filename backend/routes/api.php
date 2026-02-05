<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/best-sellers', [ProductController::class, 'bestSellers']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Cart routes (user only)
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Order routes (user only)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Product management
        Route::get('/admin/products/low-stock', [ProductController::class, 'lowStock']);
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);

        // Order management
        Route::get('/admin/orders', [AdminOrderController::class, 'index']);
        Route::get('/admin/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/admin/orders/{id}/payment-status', [AdminOrderController::class, 'updatePaymentStatus']);
        Route::put('/admin/orders/{id}/delivery-status', [AdminOrderController::class, 'updateDeliveryStatus']);

        // Brand management
        Route::get('/admin/brands', [BrandController::class, 'index']);
        Route::post('/admin/brands', [BrandController::class, 'store']);
        Route::put('/admin/brands/{id}', [BrandController::class, 'update']);
        Route::delete('/admin/brands/{id}', [BrandController::class, 'destroy']);

        // Category management
        Route::get('/admin/categories', [CategoryController::class, 'index']);
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
    });
});

