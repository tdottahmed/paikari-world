<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('products', [ProductController::class, 'index'])->name('products.index');
  Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
  Route::post('product/store', [ProductController::class, 'store'])->name('product.store');


  // Settings Routes
  Route::get('settings', [DashboardController::class, 'settings'])->name('settings');
});
