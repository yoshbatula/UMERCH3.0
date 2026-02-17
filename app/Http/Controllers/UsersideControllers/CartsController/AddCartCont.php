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
        $quantityRequested = $request->quantity;

        // Check stock availability
        $inventoryItem = Inventory::where('product_id', $productId)
            ->where('variant', $variant)
            ->first();

        $availableStock = $inventoryItem ? $inventoryItem->quantity : 0;

        // Fallback to product_stock if inventory doesn't have the variant
        if ($availableStock === 0) {
            $product = Products::where('product_id', $productId)->first();
            $availableStock = $product ? $product->product_stock : 0;
        }

        // Validate stock is available
        if ($availableStock <= 0) {
            return response()->json([
                'message' => 'This product variant is out of stock',
                'available_stock' => 0
            ], 400);
        }

        if ($quantityRequested > $availableStock) {
            return response()->json([
                'message' => 'Insufficient stock available',
                'requested' => $quantityRequested,
                'available_stock' => $availableStock
            ], 400);
        }

        $cart = Carts::firstOrCreate(['user_id' => $userId]);

        $existingItem = Carts_Item::where('cart_id', $cart->cart_id)
            ->where('product_id', $productId)
            ->where('variant', $variant)
            ->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantityRequested;
            
            // Check if total quantity exceeds available stock
            if ($newQuantity > $availableStock) {
                return response()->json([
                    'message' => 'Total quantity exceeds available stock',
                    'current_in_cart' => $existingItem->quantity,
                    'requested_additional' => $quantityRequested,
                    'total_requested' => $newQuantity,
                    'available_stock' => $availableStock
                ], 400);
            }
            
            $existingItem->update([
                'quantity' => $newQuantity
            ]);
            return response()->json(['message' => 'Item quantity updated in cart'], 200);
        }

        Carts_Item::create([
            'cart_id' => $cart->cart_id,
            'product_id' => $productId,
            'variant' => $variant,
            'quantity' => $quantityRequested,
            'price' => $request->price
        ]);

        return response()->json(['message' => 'Item added to cart successfully'], 201);
    }
}