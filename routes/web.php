<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController\AuthCont;
use App\Http\Controllers\InventoryApiController;
use Inertia\Middleware;
use Inertia\Inertia;

Route::get('/debug-env', function () {
    return response()->json([
        'db_connection' => env('DB_CONNECTION'),
        'db_host' => env('DB_HOST'),
        'db_database' => env('DB_DATABASE'),
        'app_key_set' => !empty(env('APP_KEY')),
        'app_env' => env('APP_ENV'),
        'app_debug' => env('APP_DEBUG'),
    ]);
});

Route::get('/', function () {
    return inertia('LoadingAnimation');
})->name('splash');

Route::get('Products', function () {
    return inertia('Products');
})->name('products');

Route::get('AboutUs', function () {
    return inertia('AboutUs');
})->name('aboutus');

// API Routes for inventory data
Route::get('/api/inventory', [InventoryApiController::class, 'index']);
Route::get('/api/inventory/{productId}', [InventoryApiController::class, 'getByProduct']);

require __DIR__.'/users-routes.php';
require __DIR__.'/admin-routes.php';