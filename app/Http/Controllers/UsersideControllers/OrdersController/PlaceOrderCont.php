<?php

namespace App\Http\Controllers\UsersideControllers\OrdersController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Carts;
use App\Models\Carts_Item;

class PlaceOrderCont extends Controller
{
    // 
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

    public function getUserOrders()
    {
        try {
            $userId = Auth::id();
            
            if (!$userId) {
                return response()->json([
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $orders = Orders::where('user_id', $userId)
                ->with('orderItems.product')
                ->orderBy('created_at', 'desc')
                ->get();
            
            $formattedOrders = $orders->map(function ($order) {
                $orderItems = $order->orderItems ?? [];
                $orderTotal = 0;
                
                foreach ($orderItems as $item) {
                    $orderTotal += ($item->subtotal ?? 0);
                }
                
                return [
                    'order_id' => $order->order_id ?? null,
                    'order_status' => $order->status ?? 'Pending',
                    'order_total' => $orderTotal,
                    'fulfillment_method' => $order->fulfillment_method ?? 'N/A',
                    'campus' => $order->campus ?? null,
                    'receipt_form' => $order->receipt_form ?? null,
                    'created_at' => $order->created_at,
                    'order_items' => $orderItems->map(function ($item) {
                        return [
                            'quantity' => $item->quantity ?? 0,
                            'price' => $item->price ?? 0,
                            'variant' => $item->variant ?? 'N/A',
                            'subtotal' => $item->subtotal ?? 0,
                            'product' => $item->product ? [
                                'product_id' => $item->product->product_id ?? null,
                                'product_name' => $item->product->product_name ?? 'Product',
                                'product_image' => $item->product->product_image ?? null,
                                'product_description' => $item->product->product_description ?? null,
                            ] : null
                        ];
                    })->toArray()
                ];
            });

            return response()->json($formattedOrders, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadReceipt($orderId)
    {
        try {
            $userId = Auth::id();
            
            if (!$userId) {
                return response()->json([
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Find order
            $order = Orders::where('order_id', $orderId)
                ->where('user_id', $userId)
                ->first();

            if (!$order) {
                return response()->json([
                    'message' => 'Order not found'
                ], 404);
            }

            // Validate file
            if (!request()->hasFile('receipt_form')) {
                return response()->json([
                    'message' => 'No file provided'
                ], 400);
            }

            $file = request()->file('receipt_form');
            
            // Validate file type
            $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (!in_array($file->getMimeType(), $allowedMimes)) {
                return response()->json([
                    'message' => 'Invalid file type. Only images and PDF are allowed'
                ], 400);
            }

            // Store file in storage/app/receipts directory
            $fileName = 'receipt_' . $orderId . '_' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('receipts', $fileName, 'public');

            // Update order with receipt_form path
            $order->update([
                'receipt_form' => $filePath
            ]);

            return response()->json([
                'message' => 'Receipt uploaded successfully',
                'file_path' => $filePath
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error uploading receipt',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllOrders()
    {
        try {
            $orders = Orders::with(['orderItems.product', 'user'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            $formattedOrders = $orders->map(function ($order) {
                $orderItems = $order->orderItems ?? [];
                $orderTotal = 0;
                
                foreach ($orderItems as $item) {
                    $orderTotal += ($item->subtotal ?? 0);
                }
                
                return [
                    'order_id' => $order->order_id ?? null,
                    'order_status' => $order->status ?? 'Pending',
                    'order_total' => $orderTotal,
                    'receipt_form' => $order->receipt_form ?? null,
                    'campus' => $order->campus ?? null,
                    'created_at' => $order->created_at,
                    'user_id' => $order->user_id,
                    'user_fullname' => $order->user?->user_fullname ?? 'Customer',
                    'order_items' => $orderItems->map(function ($item) {
                        return [
                            'quantity' => $item->quantity ?? 0,
                            'price' => $item->price ?? 0,
                            'variant' => $item->variant ?? 'N/A',
                            'subtotal' => $item->subtotal ?? 0,
                            'product' => $item->product ? [
                                'product_id' => $item->product->product_id ?? null,
                                'product_name' => $item->product->product_name ?? 'Product',
                                'product_image' => $item->product->product_image ?? null,
                            ] : null
                        ];
                    })->toArray()
                ];
            });

            return response()->json($formattedOrders, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrderStatus($orderId, Request $request)
    {
        try {
            Log::info('updateOrderStatus called with orderId: ' . $orderId);
            Log::info('Status from request: ' . $request->input('status'));
            
            $order = Orders::where('order_id', $orderId)->first();
            
            Log::info('Order found: ' . ($order ? 'yes' : 'no'));
            
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }
            
            $status = $request->input('status');
            $order->status = $status;
            $order->save();
            
            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => [
                    'order_id' => $order->order_id,
                    'status' => $order->status,
                    'campus' => $order->campus
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error updating order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}