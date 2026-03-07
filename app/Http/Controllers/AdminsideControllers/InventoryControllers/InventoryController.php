<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\InventoryLog;
use App\Models\ActivityLog;
use App\Models\Orders;
use App\Models\OrderItems;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        return Products::all();
    }

    public function userProducts()
    {
        // Get unique products by name (first one of each group)
        $products = Products::where('status', 'active')
            ->with('inventory')
            ->get()
            ->unique('product_name')
            ->map(function($product) {
                // Sum all inventory quantities for this product across all variants
                $totalStock = Products::where('product_name', $product->product_name)
                    ->with('inventory')
                    ->get()
                    ->sum(function($p) {
                        return $p->inventory->sum('quantity') ?? 0;
                    });
                $product->product_stock = $totalStock;
                return $product;
            })->values();
        
        return $products;
    }

    public function store(Request $request)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can create products');
        }
        $request->validate([
            'product_name' => 'required',
            'product_price' => 'required|numeric|min:0.01',
            'variant' => 'required',
            'variant_type' => 'required',
            'product_image' => 'nullable|image'
        ]);

        $imagePath = null;

        if ($request->hasFile('product_image')) {
            $imagePath = $request->file('product_image')->store('products', 'public');
        }

        // Check if product with same name and variant already exists
        $existingProduct = Products::where('product_name', $request->product_name)
            ->where('variant', $request->variant)
            ->first();

        if ($existingProduct) {
            // WB-PR-02: Reject duplicate product (same name + variant) with 409
            return response()->json([
                'message' => 'Product already exists!',
                'success' => false
            ], 409);
        }

        // Check if product with same name exists (but different variant)
        $sameNameProduct = Products::where('product_name', $request->product_name)->first();

        if ($sameNameProduct) {
            // Add as new variant to existing product
            $product = Products::create([
                'product_name' => $request->product_name,
                'product_price' => $request->product_price,
                'variant' => $request->variant,
                'variant_type' => $request->variant_type,
                'product_description' => $request->product_description,
                'product_stock' => 0,
                'product_image' => $imagePath ? Storage::url($imagePath) : $sameNameProduct->product_image,
                'status' => 'active',
            ]);

            return response()->json([
                'message' => 'New variant added to existing product!',
                'success' => true,
                'product' => $product
            ]);
        }

        // Create completely new product
        $product = Products::create([
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'variant' => $request->variant,
            'variant_type' => $request->variant_type,
            'product_description' => $request->product_description,
            'product_stock' => 0,
            'product_image' => $imagePath ? Storage::url($imagePath) : null,
            'status' => 'active',
        ]);

        // Log the add product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Add Product',
            'quantity' => 0,
            'total' => 0,
            'admin_action' => 'Admin'
        ]);

        return response()->json([
            'message' => 'Product added successfully!',
            'success' => true,
            'product' => $product
        ]);
    }

    public function update(Request $request, $product_id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can edit products');
        }
        $request->validate([
            'product_price' => 'required|numeric|min:0',
        ]);
        
        $product = Products::findOrFail($product_id);

        // Check if trying to archive/disable product with pending orders
        if (isset($request->status) && $request->status !== 'active') {
            $pendingOrders = OrderItems::where('product_id', $product_id)
                ->whereHas('order', function ($query) {
                    $query->whereIn('status', ['pending', 'to_pay', 'to_receive']);
                })
                ->exists();
            
            if ($pendingOrders) {
                return response()->json([
                    'message' => 'Cannot archive/disable product! There are pending orders for this product.',
                    'success' => false
                ], 409);
            }
        }

        $data = [
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'variant' => $request->variant,
            'variant_type' => $request->variant_type,
            'product_description' => $request->product_description,
        ];

        if ($request->hasFile('product_image')) {
            $path = $request->file('product_image')->store('products', 'public');
            $data['product_image'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        $product->update(array_filter($data, fn($v) => !is_null($v)));

        // Log the edit product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Edit Product',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => 'Admin'
        ]);

        return response()->json([
            'message' => 'Product updated successfully!',
            'success' => true,
            'product' => $product
        ]);
    }

    public function destroy($product_id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can delete products');
        }
        $product = Products::findOrFail($product_id);
        
        // Check for pending orders containing this product
        $pendingOrders = OrderItems::where('product_id', $product_id)
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['pending', 'to_pay', 'to_receive']);
            })
            ->exists();
        
        if ($pendingOrders) {
            return response()->json([
                'message' => 'Cannot delete product! There are pending orders for this product.',
                'success' => false
            ], 409);
        }
        
        // Log the delete product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Delete Product',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => 'Admin'
        ]);

        $product->delete();
        
        return response()->json([
            'message' => 'Product deleted successfully!',
            'success' => true
        ]);
    }

    public function archive($product_id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can archive products');
        }
        $product = Products::findOrFail($product_id);
        
        // Check if there are any pending orders for this product
        $pendingOrders = OrderItems::where('product_id', $product_id)
            ->whereHas('order', function($query) {
                $query->where('status', 'Pending');
            })
            ->exists();
        
        if ($pendingOrders) {
            return response()->json([
                'message' => 'Cannot archive this product. There are pending orders containing this item.',
                'error' => 'pending_orders_exist'
            ], 400);
        }
        
        $product->update(['status' => 'archived']);
        
        // Log the archive product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Archived',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => 'Admin'
        ]);
        
        return response()->json(['message' => 'Product archived successfully!']);
    }

    public function restore($product_id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can restore products');
        }
        $product = Products::findOrFail($product_id);
        
        $product->update(['status' => 'active']);
        
        // Log the restore product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Restored',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => 'Admin'
        ]);
        
        return response()->json(['message' => 'Product restored successfully!']);
    }
}
