<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Storage;

class InventoryController extends Controller
{
    public function index()
    {
        return Products::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required',
            'product_price' => 'required|numeric',
            'variant' => 'required',
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
                'product_description' => $request->product_description,
                'product_stock' => 0,
                'product_image' => $imagePath ? Storage::url($imagePath) : $sameNameProduct->product_image,
            ]);

            return redirect()->back()->with('success', 'New variant added to existing product!');
        }

        // Create completely new product
        $product = Products::create([
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'variant' => $request->variant,
            'product_description' => $request->product_description,
            'product_stock' => 0,
            'product_image' => $imagePath ? Storage::url($imagePath) : null,
        ]);

        return redirect()->back()->with('success', 'Product added successfully!');
    }

    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $data = [
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'variant' => $request->variant,
            'product_description' => $request->product_description,
        ];

        if ($request->hasFile('product_image')) {
            $path = $request->file('product_image')->store('products', 'public');
            $data['product_image'] = \Illuminate\Support\Facades\Storage::url($path);
        }

        $product->update(array_filter($data, fn($v) => !is_null($v)));

        
        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        Products::findOrFail($id)->delete();
        
        return redirect()->back()->with('success', 'Product deleted successfully!');
    }
}
