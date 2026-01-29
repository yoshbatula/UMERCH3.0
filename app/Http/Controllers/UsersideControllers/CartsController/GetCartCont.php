<?php

namespace App\Http\Controllers\UsersideControllers\CartsController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Carts;
use App\Models\Carts_Item;

class GetCartCont extends Controller {
    
    // Get user's cart items
    public function getCart() {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();
        
        
        $cart = Carts::where('user_id', $userId)->first();
        
        if (!$cart) {
            return response()->json([]);
        }

        $cartItems = Carts_Item::where('cart_id', $cart->cart_id)
            ->with('product')
            ->get();

        return response()->json($cartItems);
    }

    public function removeFromCart($cartItemId) {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            Carts_Item::destroy($cartItemId);
            return response()->json(['message' => 'Item removed successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error removing item'], 500);
        }
    }
    public function updateCartItem(Request $request, $cartItemId) {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'variant' => 'required|string'
        ]);

        try {
            $cartItem = Carts_Item::findOrFail($cartItemId);
            $cartItem->update(['variant' => $request->variant]);
            return response()->json(['message' => 'Item updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating item'], 500);
        }
    }
}
