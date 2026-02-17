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
        $request->validate([
            'product_name' => 'required',
            'product_price' => 'required|numeric|min:0',
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
            // Update existing product instead of creating duplicate
            $existingProduct->update([
                'product_price' => $request->product_price,
                'product_description' => $request->product_description,
                'product_image' => $imagePath ? Storage::url($imagePath) : $existingProduct->product_image,
                'variant_type' => $request->variant_type,
                'status' => 'active',
            ]);

            return redirect()->back()->with('success', 'Product updated successfully!');
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

            return redirect()->back()->with('success', 'New variant added to existing product!');
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
            'admin_action' => auth()->user()?->user_fullname ?? 'Admin'
        ]);

        return redirect()->back()->with('success', 'Product added successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'product_price' => 'required|numeric|min:0',
        ]);
        
        $product = Products::findOrFail($id);

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
            'admin_action' => auth()->user()?->user_fullname ?? 'Admin'
        ]);

        
        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Products::findOrFail($id);
        
        // Log the delete product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Delete Product',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => auth()->user()?->user_fullname ?? 'Admin'
        ]);

        $product->delete();
        
        return redirect()->back()->with('success', 'Product deleted successfully!');
    }

    public function archive($id)
    {
        $product = Products::findOrFail($id);
        
        // Check if there are any pending orders for this product
        $pendingOrders = OrderItems::where('product_id', $id)
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
            'admin_action' => auth()->user()?->user_fullname ?? 'Admin'
        ]);
        
        // Log to activity log
        $user = Auth::user();
        if ($user) {
            ActivityLog::logProductArchive($user, $product->product_name, $product->variant);
        }
        
        return response()->json(['message' => 'Product archived successfully!']);
    }

    public function restore($id)
    {
        $product = Products::findOrFail($id);
        
        $product->update(['status' => 'active']);
        
        // Log the restore product operation
        InventoryLog::create([
            'product_id' => $product->product_id,
            'item_name' => $product->product_name . ' - ' . $product->variant,
            'type' => 'Restored',
            'quantity' => 0,
            'total' => $product->product_stock,
            'admin_action' => auth()->user()?->user_fullname ?? 'Admin'
        ]);
        
        // Log to activity log
        $user = Auth::user();
        if ($user) {
            ActivityLog::logProductRestore($user, $product->product_name, $product->variant);
        }
        
        return response()->json(['message' => 'Product restored successfully!']);
    }
}
