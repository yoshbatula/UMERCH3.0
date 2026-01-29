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

        // Inertia forms require a redirect (not plain JSON)
        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        Products::findOrFail($id)->delete();
        // Return a redirect for Inertia compliance
        return redirect()->back()->with('success', 'Product deleted successfully!');
    }
}
