<?php

namespace App\Http\Controllers\UsersideControllers\CartsController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Carts;
use App\Models\Carts_Item;
use App\Models\Products;
use App\Models\Inventory;

class Checkout extends Controller {
    
    public function checkout(Request $request) {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();
        $cart = Carts::where('user_id', $userId)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $cartItems = Carts_Item::where('cart_id', $cart->cart_id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        Carts_Item::where('cart_id', $cart->cart_id)->delete();

        return response()->json(['message' => 'Checkout successful'], 200);
    }
}