<?php

namespace App\Http\Controllers\UsersideControllers\CartsController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Carts;
use App\Models\Carts_Item;
use App\Models\Products;
use App\Models\Inventory;

// This controller is for add to cart functionality
class AddCartCont extends Controller {
    
    // Add item to cart logic
    public function AddCart(Request $request) {
        
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:_products,product_id',
            'variant' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric'
        ]);

        $userId = Auth::id();
        $productId = $request->product_id;
        $variant = trim($request->variant);

        $cart = Carts::firstOrCreate(['user_id' => $userId]);

        $existingItem = Carts_Item::where('cart_id', $cart->cart_id)
            ->where('product_id', $productId)
            ->where('variant', $variant)
            ->first();

        if ($existingItem) {
            
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity
            ]);
            return response()->json(['message' => 'Item quantity updated in cart'], 200);
        }

        Carts_Item::create([
            'cart_id' => $cart->cart_id,
            'product_id' => $productId,
            'variant' => $variant,
            'quantity' => $request->quantity,
            'price' => $request->price
        ]);

        return response()->json(['message' => 'Item added to cart successfully'], 201);
    }
}