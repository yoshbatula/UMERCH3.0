<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Middleware;
use App\Http\Controllers\AdminsideControllers\DashboardControllers\AdminDashboardCont;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\AddRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\UpdateRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\DeleteRecords;
use App\Models\User;

Route::get('/', function () {
            return inertia('Admin-side/Dashboard-page/Dashboard');
        })->name('Dashboard');

Route::post('/add-user', [AddRecords::class, 'addUser'])->name('AddUser');
Route::patch('/update-user/{id}', [UpdateRecords::class, 'updateUser'])->name('UpdateUser');
Route::delete('/delete-user/{id}', [DeleteRecords::class, 'deleteUser'])->name('DeleteUser');


Route::get('/api/admin/users', function () {
    return response()->json(
        User::select('id', 'user_fullname', 'um_id', 'email')->get()
    );
});

 Route::get('/admin/transaction', function () {
            return inertia('Admin-side/Transaction-page/AdminTransaction');
        })->name('AdminTransaction');

        Route::get('/admin/inventory', function () {
            return inertia('Admin-side/Inventory-page/AdminInventory');
        })->name('AdminInventory');

        
        Route::get('/admin/record-logs', function () {
            return inertia('Admin-side/RecordLogin-page/AdminRecord');
        })->name('AdminRecordLogs');
    
        Route::get('/admin/logout', function () {
            Auth::logout();
            return redirect('/');
        })->name('AdminLogout');