<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersideControllers\LoginControllers\LoginCont;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Controllers\UsersideControllers\AuthenticationController\AuthCont;;
use App\Http\Controllers\UsersideControllers\CartsController\AddCartCont;
use App\Http\Controllers\UsersideControllers\CartsController\GetCartCont;
use App\Http\Controllers\UsersideControllers\CartsController\CartsCont;
use Illuminate\Auth\Events\Login;
use Inertia\Middleware;
use Inertia\Inertia;


// User authentication routes
Route::get('/login', [LoginCont::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginCont::class, 'login'])->name('login.submit');

// Protected routes for authenticated users
Route::middleware(['auth'])->group(function () {
    
    // This routes for authentications
    Route::get('/authentication', [AuthCont::class, 'showAuthenticationPage'])->name('authentication');
    Route::post('/resend-otp', [AuthCont::class, 'resendOtp'])->name('resend.otp');
    Route::post('/verify-otp', [AuthCont::class, 'verifyOtp'])->name('verify.otp');

    // This route for adding items to cart
    Route::post('/add-to-cart', [AddCartCont::class, 'AddCart'])->name('add.to.cart');
    Route::get('/get-cart', [GetCartCont::class, 'getCart'])->name('get.cart');
    Route::delete('/remove-from-cart/{cartItemId}', [GetCartCont::class, 'removeFromCart'])->name('remove.from.cart');
    Route::put('/update-cart-item/{cartItemId}', [GetCartCont::class, 'updateCartItem'])->name('update.cart.item');

    // User-side page routes
    Route::get('/Landing', function () {
        return inertia('User-side/Landing-page/Landingpage');
    })->name('landing');

    Route::get('/Shop', function () {
        return inertia('User-side/Shop-page/Shop');
    })->name('shop');

    Route::get('/Cart', [CartsCont::class, 'index'])->name('cart');

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
