<?php
use Illuminate\Support\Facades\Route;

Route::get('/', function() {
    return inertia('Admin-side/RecordLogin-page/AdminRecord');
})->name('admin.recordlogin');