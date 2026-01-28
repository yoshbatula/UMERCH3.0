<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController\AuthCont;
use Inertia\Middleware;
use Inertia\Inertia;

Route::get('/', function () {
return inertia('Login');
})->name('login');

Route::get('Products', function () {
    return inertia('Products');
})->name('products');


require __DIR__.'/users-routes.php';
require __DIR__.'/admin-routes.php';