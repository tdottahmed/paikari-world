<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
  Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('products', [ProductController::class, 'index'])->name('products.index');
  Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
  Route::post('product/store', [ProductController::class, 'store'])->name('product.store');
  Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
  Route::post('products/{product}/update', [ProductController::class, 'update'])->name('product.update');
  Route::delete('products/delete/{product}', [ProductController::class, 'destroy'])->name('product.delete');
  Route::get('products/show/{product}', [ProductController::class, 'show'])->name('product.show');

  Route::resource('categories', CategoryController::class);


  // Settings Routes
  Route::get('settings', [DashboardController::class, 'settings'])->name('settings');
});
