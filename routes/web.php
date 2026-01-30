<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController\AuthCont;
use App\Http\Controllers\InventoryApiController;
use Inertia\Middleware;
use Inertia\Inertia;

Route::get('/', function () {
return inertia('Login');
})->name('login');

Route::get('Products', function () {
    return inertia('Products');
})->name('products');

// API Routes for inventory data
Route::get('/api/inventory', [InventoryApiController::class, 'index']);
Route::get('/api/inventory/{productId}', [InventoryApiController::class, 'getByProduct']);

require __DIR__.'/users-routes.php';
require __DIR__.'/admin-routes.php';