<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/admin', function () {
            return inertia('Admin-side/Dashboard-page/Dashboard');
        })->name('Dashboard');


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