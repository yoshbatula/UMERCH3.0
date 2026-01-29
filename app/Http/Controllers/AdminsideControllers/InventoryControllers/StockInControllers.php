<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\StockIn;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    public function index()
    {
        return Products::select(
            'id',
            'product_name',
            'variant',
            'product_price as cost',
            'product_stock as stock_qty',
            'product_image'
        )->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:_products,id',
            'stock_qty' => 'required|integer|min:1',
            'cost' => 'required|numeric'
        ]);

        DB::transaction(function () use ($request) {
            $product = Products::findOrFail($request->product_id);

            $product->increment('product_stock', $request->stock_qty);

            StockIn::create([
                'product_id' => $product->id,
                'stock_qty' => $request->stock_qty,
                'cost' => $request->cost,
                'stock_in_date' => now()
            ]);
        });

        return response()->json(['message' => 'Stock added']);
    }
}
