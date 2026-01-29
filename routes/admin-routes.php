<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/* CONTROLLERS */
use App\Http\Controllers\AdminsideControllers\InventoryControllers\InventoryController;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\AddRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\UpdateRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\DeleteRecords;
use App\Http\Controllers\AdminsideControllers\InventoryControllers\StockInController;
use App\Http\Controllers\AdminsideControllers\InventoryControllers\StockOutController;

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/
Route::get('/admin', function () {
    return inertia('Admin-side/Dashboard-page/Dashboard');
})->name('Dashboard');

/*
|--------------------------------------------------------------------------
| USERS (RECORDS)
|--------------------------------------------------------------------------
*/
Route::post('/admin/add-user', [AddRecords::class, 'addUser']);
Route::patch('/admin/update-user/{id}', [UpdateRecords::class, 'updateUser']);
Route::delete('/admin/delete-user/{id}', [DeleteRecords::class, 'deleteUser']);

Route::get('/api/admin/users', function () {
    return response()->json(
        User::select('id', 'user_fullname', 'um_id', 'email')->get()
    );
});

/*
|--------------------------------------------------------------------------
| INVENTORY (PAGES)
|--------------------------------------------------------------------------
*/
Route::get('admin/inventory/add', function () {
    return inertia('Admin-side/Inventory-page/AddProducts');
})->name('AddProducts');

Route::get('/admin/inventory/stock-in', function () {
    return inertia('Admin-side/Inventory-page/Stock-In');
})->name('StockIn');

Route::get('/admin/inventory/stock-out', function () {
    return inertia('Admin-side/Inventory-page/Stock-Out');
})->name('StockOut');

/*
|--------------------------------------------------------------------------
| INVENTORY (API)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // PRODUCTS
    Route::get('/products', [InventoryController::class, 'index']);
    Route::post('/products', [InventoryController::class, 'store']);
    Route::post('/products/store', [InventoryController::class, 'store']);
    Route::patch('/products/{id}', [InventoryController::class, 'update']);
    Route::delete('/products/{id}', [InventoryController::class, 'destroy']);

    // STOCK IN
    Route::get('/stock-in', [StockInController::class, 'index']);
    Route::post('/stock-in/store', [StockInController::class, 'store']);
    Route::patch('/stock-in/{id}', [StockInController::class, 'update']);
    Route::delete('/stock-in/{id}', [StockInController::class, 'destroy']);

    // STOCK OUT
    Route::get('/stock-out/logs', [StockOutController::class, 'logs']);
    Route::post('/stock-out/store', [StockOutController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| OTHER ADMIN PAGES
|--------------------------------------------------------------------------
*/
Route::get('/admin/transaction', function () {
    return inertia('Admin-side/Transaction-page/AdminTransaction');
});

Route::get('/admin/record-logs', function () {
    return inertia('Admin-side/RecordLogin-page/AdminRecord');
});

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
Route::get('/admin/logout', function () {
    Auth::logout();
    return redirect('/');
});
