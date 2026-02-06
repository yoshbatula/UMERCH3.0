<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/* CONTROLLERS */
use App\Http\Controllers\AdminsideControllers\InventoryControllers\InventoryController;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\AddRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\UpdateRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\DeleteRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\InventoryLogsController;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\ActivityLogsController;
use App\Http\Controllers\AdminsideControllers\InventoryControllers\StockInController;
use App\Http\Controllers\AdminsideControllers\InventoryControllers\StockOutController;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\DashboardController;
use App\Http\Controllers\UsersideControllers\OrdersController\PlaceOrderCont;
use App\Http\Controllers\UsersideControllers\LoginControllers\LoginCont;

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
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
    Route::patch('/admin/deactivate-user/{id}', [UpdateRecords::class, 'deactivateUser']);
    Route::patch('/admin/reactivate-user/{id}', [UpdateRecords::class, 'reactivateUser']);

    Route::get('/api/admin/users', function () {
        return response()->json(
            User::where('role', '!=', 'Admin')
                ->where('um_id', '!=', 1)
                ->where('email', '!=', 'admin@umerch.com')
                ->select('id', 'user_fullname', 'um_id', 'email', 'role', 'status')
                ->get()
        );
    });

    // INVENTORY LOGS API
    Route::get('/api/admin/inventory-logs', [InventoryLogsController::class, 'getLogs']);

    // ACTIVITY LOGS API
    Route::get('/api/admin/activity-logs', [ActivityLogsController::class, 'getLogs']);
    Route::get('/api/admin/activity-logs/stats', [ActivityLogsController::class, 'getStats']);

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
        Route::patch('/products/{id}/archive', [InventoryController::class, 'archive']);
        Route::patch('/products/{id}/restore', [InventoryController::class, 'restore']);

        // STOCK IN
        Route::get('/stock-in', [StockInController::class, 'index']);
        Route::post('/stock-in/store', [StockInController::class, 'store']);
        Route::patch('/stock-in/{id}', [StockInController::class, 'update']);
        Route::delete('/stock-in/{id}', [StockInController::class, 'destroy']);

        // STOCK OUT
        Route::get('/stock-out/logs', [StockOutController::class, 'logs']);
        Route::post('/stock-out/store', [StockOutController::class, 'store']);


        // Transactions API
        Route::get('/api/admin/orders', [PlaceOrderCont::class, 'getAllOrders'])->name('api.admin.orders');

        // DASHBOARD API
        Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
        Route::get('/dashboard/sales-overview', [DashboardController::class, 'getSalesOverview']);
        Route::get('/dashboard/inventory-status', [DashboardController::class, 'getInventoryStatus']);
        Route::get('/dashboard/recent-transactions', [DashboardController::class, 'getRecentTransactions']);
        Route::get('/dashboard/top-products', [DashboardController::class, 'getTopProducts']);
        Route::get('/dashboard/weekly-stats', [DashboardController::class, 'getWeeklyStats']);
    });


    /*
    |--------------------------------------------------------------------------
    | OTHER ADMIN PAGES
    |--------------------------------------------------------------------------
    */
    Route::get('/admin/transaction', function () {
        return inertia('Admin-side/Transaction-page/AdminTransaction');
    });

    Route::get('/admin/record-logs/user', function () {
        return inertia('Admin-side/RecordLogin-page/UserLogs');
    });

    Route::get('/admin/record-logs/inventory', [InventoryLogsController::class, 'index'])->name('InventoryLogs');

    Route::get('/admin/record-logs/activity', function () {
        return inertia('Admin-side/RecordLogin-page/ActivityLogs');
    })->name('ActivityLogs');

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */
    Route::get('/admin/logout', [LoginCont::class, 'logout'])->name('admin.logout');
});
