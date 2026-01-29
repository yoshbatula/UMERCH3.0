<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;

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
            'product_image' => $imagePath ? asset('storage/' . $imagePath) : null,
        ]);

        return redirect()->back()->with('success', 'Product added successfully!');
    }

    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $product->update([
            'product_name' => $request->product_name,
            'product_price' => $request->product_price,
            'variant' => $request->variant,
            'product_description' => $request->product_description,
            'product_image' => $request->product_image,
        ]);

        return response()->json(['message' => 'Product updated']);
    }

    public function destroy($id)
    {
        Products::findOrFail($id)->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
