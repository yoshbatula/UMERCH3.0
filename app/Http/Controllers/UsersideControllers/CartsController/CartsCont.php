<?php

namespace App\Http\Controllers\UsersideControllers\CartsController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Carts_Item;
use App\Models\Carts;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartsCont extends Controller
{
    public function index() {
        // Get authenticated user's cart
        $cart = Carts::where('user_id', Auth::id())->first();
        
        if (!$cart) {
            return Inertia::render('User-side/Cart-page/Carts', [
                'cartItems' => []
            ]);
        }

        // Get cart items with product details
        $cartItems = Carts_Item::where('cart_id', $cart->cart_id)
            ->with('product')
            ->get();

        return Inertia::render('User-side/Cart-page/Carts', [
            'cartItems' => $cartItems
        ]);
    }
}