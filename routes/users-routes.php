<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginControllers\LoginCont;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Controllers\AuthenticationController\AuthCont;;
use Illuminate\Auth\Events\Login;
use Inertia\Middleware;
use Inertia\Inertia;


// User authentication routes
Route::get('/login', [LoginCont::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginCont::class, 'login'])->name('login.submit');

// Protected routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/authentication', [AuthCont::class, 'showAuthenticationPage'])->name('authentication');
    Route::post('/resend-otp', [AuthCont::class, 'resendOtp'])->name('resend.otp');
    Route::post('/verify-otp', [AuthCont::class, 'verifyOtp'])->name('verify.otp');

    Route::get('/Landing', function () {
        return inertia('User-side/Landing-page/Landingpage');
    })->name('landing');

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
