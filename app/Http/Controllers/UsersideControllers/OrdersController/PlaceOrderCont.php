<?php

namespace App\Http\Controllers\UsersideControllers\OrdersController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Carts;
use App\Models\Carts_Item;

class PlaceOrderCont extends Controller
{
    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'fulfillment_method' => 'required|string',
            'campus' => 'nullable|string',
            'cart_items' => 'required|array'
        ]);

        try {
            // Get user
            $userId = Auth::id();

            if (empty($validated['cart_items'])) {
                return response()->json([
                    'message' => 'No items to order'
                ], 400);
            }

            // Create order
            $order = Orders::create([
                'user_id' => $userId,
                'status' => 'Pending',
                'payment_method' => $validated['payment_method'],
                'fulfillment_method' => $validated['fulfillment_method'],
                'campus' => $validated['campus'],
                'order_date' => now(),
            ]);

            // Create order items from the provided cart items
            $total = 0;
            foreach ($validated['cart_items'] as $cartItem) {
                $subtotal = floatval($cartItem['price']) * intval($cartItem['quantity']);
                $total += $subtotal;

                OrderItems::create([
                    'order_id' => $order->order_id,
                    'product_id' => $cartItem['product_id'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $cartItem['price'],
                    'variant' => $cartItem['variant'],
                    'subtotal' => $subtotal,
                ]);
            }

            // Clear the cart after order is placed
            $cart = Carts::where('user_id', $userId)->first();
            if ($cart) {
                Carts_Item::where('cart_id', $cart->cart_id)->delete();
            }

            return response()->json([
                'message' => 'Order placed successfully',
                'orderId' => $order->order_id
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error placing order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
