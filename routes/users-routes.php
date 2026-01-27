<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController\AuthCont;
use Inertia\Middleware;
use Inertia\Inertia;



// Login (users only)
Route::middleware(['auth'])->group(function () {

Route::get('/login', [AuthCont::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthCont::class, 'login'])->name('login.submit');

Route::get('/authentication', function () {
    return Inertia::render('Authentication'); 
})->name('2fa');

Route::get('/Shop', function () {
    return inertia('User-side/Shop-page/Shop');
})->name('shop');

Route::get('/Cart', function () {
    return inertia('User-side/Cart-page/Carts');
})->name('cart');

Route::get('/Checkout', function () {
    return inertia('User-side/Cart-page/Checkout');
})->name('checkout');

Route::get('/Orders', function () {
    return inertia('User-side/Order-page/Orders');
})->name('orders'); 

Route::get('/ToPay', function () {
    return inertia('User-side/Order-page/To-Pay');
})->name('to-pay');

Route::get('/ToReceive', function () {
    return inertia('User-side/Order-page/To-Receive');
})->name('to-receive');

Route::get('Completed', function () {
    return inertia('User-side/Order-page/Complete');
})->name('completed');

Route::get('Cancelled', function () {
    return inertia('User-side/Order-page/Cancelled');
})->name('cancelled');
});

// // Final dashboard (after OTP success)
// Route::middleware(['auth'])->group(function () {
//     Route::get('/dashboard', function () {
//         return Inertia::render('Dashboard');
//     })->name('dashboard');
// });
